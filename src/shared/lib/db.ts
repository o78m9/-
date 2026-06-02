import { neon, type NeonQueryFunction } from '@neondatabase/serverless'

/**
 * Single source of truth for the Neon SQL driver.
 *
 * Two exports:
 *   1. `sql` — bare tagged-template, for queries that do NOT need tenant scoping
 *      (e.g. /api/cron/prune-audit, /api/health, /api/booking which is unauth).
 *   2. `withClinic(clinicId, buildQueries)` — runs queries inside a transaction
 *      that first sets `app.clinic_id` so the RLS policies in migration 004 evaluate
 *      to the right tenant. EVERY tenant-scoped data query must go through this.
 *
 * Why a single driver instance: previously eight separate `neon()` calls existed
 * across the codebase (per CTO memo). Centralised here so we instantiate once and
 * so the `withClinic` wrapper has a single, well-tested code path.
 */

const connectionString = process.env.DATABASE_URL
if (!connectionString && process.env.NODE_ENV !== 'test') {
  console.warn('[db] DATABASE_URL not set — sql will be null')
}

const driver: NeonQueryFunction<false, false> | null = connectionString
  ? neon(connectionString)
  : null

export const sql = driver

/**
 * Run a transaction with `app.clinic_id` pre-set so RLS policies (migration 004)
 * scope every query to this tenant. The first transaction statement is the
 * `set_config` call; the rest are the caller's queries. The set_config result is
 * stripped from the return value so the caller gets `[query1Result, query2Result, ...]`.
 *
 * `buildQueries` receives the driver as its argument so callers can build tagged-
 * template queries that capture the right clinicId values.
 *
 * Example:
 * ```ts
 * const [rows] = await withClinic<[Array<{id: string}>]>(ctx.clinicId, (sql) => [
 *   sql`INSERT INTO customers (...) VALUES (...) RETURNING id`,
 * ])
 * ```
 *
 * Safety: throws if `DATABASE_URL` is unset. Use only in code paths reached after
 * `requireClinic()` resolves successfully.
 */
type SqlBuilder = NeonQueryFunction<false, false>

export async function withClinic<R extends unknown[]>(
  clinicId: string,
  buildQueries: (sqlDriver: SqlBuilder) => unknown[],
): Promise<R> {
  if (!driver) {
    throw new Error('withClinic called without DATABASE_URL configured')
  }
  if (!clinicId || typeof clinicId !== 'string') {
    throw new Error('withClinic requires a non-empty clinicId')
  }
  // The SET LOCAL must be inside the same transaction as the data queries.
  // `transaction()` runs all statements over a single Postgres session.
  // Use the callback form (driver.transaction((tx) => [...])) for type safety —
  // each query is built with the transaction's own tagged-template binding.
  const result = (await driver.transaction((tx) => {
    const setClinic = tx`SELECT set_config('app.clinic_id', ${clinicId}, true)`
    const userQueries = buildQueries(tx as unknown as SqlBuilder)
    return [setClinic, ...(userQueries as unknown as (typeof setClinic)[])]
  })) as unknown[]
  // Drop the SET LOCAL result row from the returned array.
  return result.slice(1) as R
}
