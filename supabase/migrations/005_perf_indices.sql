-- CTO fix: composite indices to kill the `ORDER BY last_visit DESC LIMIT 50`
-- sort + the visits join on dashboards. Without these, every dashboard hit on
-- a 5k-patient tenant does a full-tenant scan + sort.
--
-- Idempotent. Safe to re-apply.

-- Dashboard "most recent 50 customers" query (src/app/dashboard/page.tsx):
--   SELECT ... FROM customers WHERE clinic_id=$1 ORDER BY last_visit DESC NULLS LAST LIMIT 50
CREATE INDEX IF NOT EXISTS customers_clinic_last_visit_desc_idx
  ON customers (clinic_id, last_visit DESC NULLS LAST);

-- ROI report 6-month trend (joins visits to customers, groups by month):
--   FROM visits v JOIN customers c ON c.id = v.customer_id WHERE c.clinic_id=$1 AND v.date>=NOW()-INTERVAL '6 months'
-- visits.customer_id already has an index from migration 001; this composite
-- helps the date predicate after the join.
CREATE INDEX IF NOT EXISTS visits_customer_date_idx
  ON visits (customer_id, date DESC);

-- Audit-log tenant filter for compliance reports + spend-check cron:
--   SELECT ... FROM audit_log WHERE clinic_id=$1 AND created_at > now() - interval '1 day'
CREATE INDEX IF NOT EXISTS audit_log_clinic_created_idx
  ON audit_log (clinic_id, created_at DESC);

-- Messages table (PDPL export): already has messages_clinic_cust_sent_idx from
-- migration 003. No additional index needed.

-- Verification (manual, after apply):
-- EXPLAIN ANALYZE SELECT id FROM customers WHERE clinic_id='<uuid>' ORDER BY last_visit DESC LIMIT 50;
-- Expected plan: Index Scan using customers_clinic_last_visit_desc_idx (NOT Seq Scan + Sort).
