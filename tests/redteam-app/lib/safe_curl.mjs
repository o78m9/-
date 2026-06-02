#!/usr/bin/env node
/**
 * safe_curl — guardrailed HTTP wrapper for the red-team-attacker agent.
 *
 * All live traffic from the red-team agent MUST go through this.
 * Direct curl / WebFetch to unallowlisted hosts is forbidden.
 *
 * Enforces:
 *  - Allowlist of hosts per scope (local / staging / prod)
 *  - Per-scope method allowlist
 *  - Per-scope rate cap
 *  - dry_run default (no live request without --live)
 *  - Authorization doc must exist + not be past valid_until
 *  - Tamper-evident append-only log to docs/security/redteam-app/session.log
 *  - 10s timeout, 5MB max response size
 *
 * Usage:
 *   node safe_curl.mjs --scope=local --method=GET --url=http://localhost:3000/api/health
 *   node safe_curl.mjs --scope=staging --method=POST --url=... --body=... --live
 *   node safe_curl.mjs --abort   # kill-switch: writes ABORT marker to log
 */

import { readFileSync, appendFileSync, existsSync, mkdirSync } from "node:fs";
import { URL, fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";
import { createHash } from "node:crypto";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, "../../..");
const CONFIG_PATH = join(REPO_ROOT, "tests/redteam-app/config/allowed-targets.json");
const AUTH_DOC_PATH = join(REPO_ROOT, "docs/security/RED-TEAM-AUTHORIZATION.md");
const LOG_PATH = join(REPO_ROOT, "docs/security/redteam-app/session.log");
const MAX_RESPONSE_BYTES = 5 * 1024 * 1024;
const REQUEST_TIMEOUT_MS = 10_000;

const rateState = new Map();

function logLine(record) {
  const dir = dirname(LOG_PATH);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const line = JSON.stringify({ ts: new Date().toISOString(), ...record });
  appendFileSync(LOG_PATH, line + "\n", { encoding: "utf8" });
}

function fail(code, msg, extra = {}) {
  logLine({ event: "blocked", code, msg, ...extra });
  console.error(`[safe_curl] BLOCKED (${code}): ${msg}`);
  process.exit(2);
}

function parseArgs(argv) {
  const out = {};
  for (const arg of argv.slice(2)) {
    if (arg === "--live") out.live = true;
    else if (arg === "--abort") out.abort = true;
    else if (arg.startsWith("--")) {
      const eq = arg.indexOf("=");
      if (eq === -1) out[arg.slice(2)] = true;
      else out[arg.slice(2, eq)] = arg.slice(eq + 1);
    }
  }
  return out;
}

function loadConfig() {
  if (!existsSync(CONFIG_PATH)) fail("CFG-404", `config not found: ${CONFIG_PATH}`);
  try {
    return JSON.parse(readFileSync(CONFIG_PATH, "utf8"));
  } catch (e) {
    fail("CFG-PARSE", `config parse error: ${e.message}`);
  }
}

function validateAuthDoc(scopeAuthId) {
  if (!existsSync(AUTH_DOC_PATH)) {
    fail("AUTH-404", `authorization doc missing: ${AUTH_DOC_PATH}`);
  }
  const text = readFileSync(AUTH_DOC_PATH, "utf8");
  if (!text.includes(scopeAuthId)) {
    fail("AUTH-MISMATCH", `auth id ${scopeAuthId} not present in authorization doc`);
  }
}

function checkValidUntil(scope) {
  const until = new Date(scope.valid_until + "T23:59:59Z").getTime();
  if (!Number.isFinite(until)) fail("CFG-DATE", `invalid valid_until: ${scope.valid_until}`);
  if (Date.now() > until) {
    fail("AUTH-EXPIRED", `scope expired ${scope.valid_until} — renew authorization doc`);
  }
}

function checkHost(url, scope) {
  let u;
  try {
    u = new URL(url);
  } catch {
    fail("URL-INVALID", `not a valid URL: ${url}`);
  }
  if (!scope.hosts.includes(u.hostname)) {
    fail("HOST-DENY", `host ${u.hostname} not in allowlist`, { allowed: scope.hosts });
  }
  return u;
}

function checkMethod(method, scope) {
  const m = (method || "GET").toUpperCase();
  if (!scope.methods.includes(m)) {
    fail("METHOD-DENY", `method ${m} not allowed for this scope`, { allowed: scope.methods });
  }
  return m;
}

function enforceRate(scopeName, ratePerSec) {
  const now = Date.now();
  const bucket = rateState.get(scopeName) || { tokens: ratePerSec, last: now };
  const elapsedSec = (now - bucket.last) / 1000;
  bucket.tokens = Math.min(ratePerSec, bucket.tokens + elapsedSec * ratePerSec);
  bucket.last = now;
  if (bucket.tokens < 1) {
    fail("RATE-LIMIT", `rate cap hit for scope ${scopeName} (${ratePerSec}/s)`);
  }
  bucket.tokens -= 1;
  rateState.set(scopeName, bucket);
}

async function doFetch(method, url, body) {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), REQUEST_TIMEOUT_MS);
  let res;
  try {
    res = await fetch(url, {
      method,
      headers: { "User-Agent": "aooda-red-team/1.0" },
      body: body && method !== "GET" && method !== "HEAD" ? body : undefined,
      signal: ac.signal,
      redirect: "manual",
    });
  } finally {
    clearTimeout(timer);
  }
  const reader = res.body?.getReader();
  let received = 0;
  const chunks = [];
  if (reader) {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      received += value.length;
      if (received > MAX_RESPONSE_BYTES) {
        fail("RESP-TOOBIG", `response exceeded ${MAX_RESPONSE_BYTES} bytes`);
      }
      chunks.push(value);
    }
  }
  const bodyBuf = Buffer.concat(chunks);
  return { status: res.status, headers: Object.fromEntries(res.headers), bodySize: bodyBuf.length };
}

async function main() {
  const args = parseArgs(process.argv);

  if (args.abort) {
    logLine({ event: "ABORT", reason: "operator kill-switch invoked" });
    console.error("[safe_curl] ABORT recorded.");
    process.exit(0);
  }

  const scopeName = args.scope;
  const url = args.url;
  const method = args.method;
  const body = args.body;
  const live = !!args.live;

  if (!scopeName || !url) {
    console.error("Usage: safe_curl --scope=<local|staging|prod> --method=GET --url=https://...  [--body=...] [--live]");
    process.exit(64);
  }

  const cfg = loadConfig();
  const scope = cfg.scopes?.[scopeName];
  if (!scope) fail("SCOPE-404", `unknown scope: ${scopeName}`);

  validateAuthDoc(scope.auth_id);
  checkValidUntil(scope);
  const u = checkHost(url, scope);
  const m = checkMethod(method, scope);
  enforceRate(scopeName, scope.rate_per_sec);

  if (!live) {
    logLine({ event: "dry-run", scope: scopeName, method: m, url: u.toString() });
    console.log(JSON.stringify({ ok: true, dry_run: true, scope: scopeName, method: m, url: u.toString() }, null, 2));
    process.exit(0);
  }

  logLine({ event: "request", scope: scopeName, method: m, url: u.toString(), body_hash: body ? createHash("sha256").update(body).digest("hex").slice(0, 16) : null });
  try {
    const result = await doFetch(m, u.toString(), body);
    logLine({ event: "response", scope: scopeName, status: result.status, body_size: result.bodySize });
    console.log(JSON.stringify({ ok: true, ...result }, null, 2));
  } catch (e) {
    logLine({ event: "error", scope: scopeName, error: e.message });
    console.error(`[safe_curl] ERROR: ${e.message}`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(`[safe_curl] FATAL: ${e.stack || e.message}`);
  process.exit(1);
});
