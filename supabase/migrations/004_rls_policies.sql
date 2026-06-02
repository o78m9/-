-- CPS-001 / APP-RLS-001: enable Postgres row-level security as a second wall
-- behind the application-layer requireClinic() check. Closes the "any auth-layer
-- bug = unmediated cross-tenant access" class.
--
-- Wiring: every request handler that uses requireClinic() must also call
--   await sql`SELECT set_config('app.clinic_id', ${clinicId}, true)`
-- before running data queries. The `true` flag scopes the setting to the current
-- transaction. Neon serverless: wrap data queries in `sql.transaction()`.
--
-- Idempotent. Safe to re-apply.

ALTER TABLE clinics              ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers            ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits               ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log            ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages             ENABLE ROW LEVEL SECURITY;
ALTER TABLE attribution_disputes ENABLE ROW LEVEL SECURITY;

-- Force RLS even for table owner roles — prevents accidental bypass via superuser.
ALTER TABLE clinics              FORCE ROW LEVEL SECURITY;
ALTER TABLE customers            FORCE ROW LEVEL SECURITY;
ALTER TABLE visits               FORCE ROW LEVEL SECURITY;
ALTER TABLE messages             FORCE ROW LEVEL SECURITY;
ALTER TABLE attribution_disputes FORCE ROW LEVEL SECURITY;
-- audit_log intentionally NOT forced — pruning cron needs full delete access.

-- Drop existing policies if any (idempotent re-apply).
DROP POLICY IF EXISTS clinics_self            ON clinics;
DROP POLICY IF EXISTS customers_tenant        ON customers;
DROP POLICY IF EXISTS visits_tenant           ON visits;
DROP POLICY IF EXISTS messages_tenant         ON messages;
DROP POLICY IF EXISTS attr_disputes_tenant    ON attribution_disputes;
DROP POLICY IF EXISTS audit_log_tenant        ON audit_log;

-- clinics: each tenant sees only its own clinic row.
CREATE POLICY clinics_self ON clinics FOR ALL
  USING      (id = current_setting('app.clinic_id', true)::uuid)
  WITH CHECK (id = current_setting('app.clinic_id', true)::uuid);

-- customers: tenant-scoped.
CREATE POLICY customers_tenant ON customers FOR ALL
  USING      (clinic_id = current_setting('app.clinic_id', true)::uuid)
  WITH CHECK (clinic_id = current_setting('app.clinic_id', true)::uuid);

-- visits: no direct clinic_id column — join through customers.
CREATE POLICY visits_tenant ON visits FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM customers c
      WHERE c.id = visits.customer_id
        AND c.clinic_id = current_setting('app.clinic_id', true)::uuid
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers c
      WHERE c.id = visits.customer_id
        AND c.clinic_id = current_setting('app.clinic_id', true)::uuid
    )
  );

-- messages: clinic_id stored as text in migration 003 — cast for compare.
CREATE POLICY messages_tenant ON messages FOR ALL
  USING      (clinic_id::uuid = current_setting('app.clinic_id', true)::uuid)
  WITH CHECK (clinic_id::uuid = current_setting('app.clinic_id', true)::uuid);

CREATE POLICY attr_disputes_tenant ON attribution_disputes FOR ALL
  USING      (clinic_id::uuid = current_setting('app.clinic_id', true)::uuid)
  WITH CHECK (clinic_id::uuid = current_setting('app.clinic_id', true)::uuid);

-- audit_log: writes are tenant-scoped (or unscoped for public booking — clinic_id is null).
-- Reads require a matching tenant setting.
-- CISO fix: WITH CHECK was previously `true`, allowing an authenticated session
-- to spray fake audit entries into any victim tenant's log (forensic-integrity
-- forfeit). Now writes must match the request-scoped clinic OR be unscoped (null,
-- e.g. /api/booking from an anonymous lead).
CREATE POLICY audit_log_tenant ON audit_log FOR ALL
  USING (
    clinic_id IS NULL
    OR clinic_id = current_setting('app.clinic_id', true)
  )
  WITH CHECK (
    clinic_id IS NULL
    OR clinic_id = current_setting('app.clinic_id', true)
  );

-- Helpful comment for ops: app.clinic_id setting is consumed by these policies.
COMMENT ON TABLE clinics              IS 'RLS-enabled. Set app.clinic_id per request.';
COMMENT ON TABLE customers            IS 'RLS-enabled. Set app.clinic_id per request.';
COMMENT ON TABLE visits               IS 'RLS-enabled. Set app.clinic_id per request (via customers join).';
COMMENT ON TABLE messages             IS 'RLS-enabled. Set app.clinic_id per request.';
COMMENT ON TABLE attribution_disputes IS 'RLS-enabled. Set app.clinic_id per request.';
COMMENT ON TABLE audit_log            IS 'RLS-enabled. Set app.clinic_id per request for reads; writes always pass.';
