-- PDPL-compliant audit trail. 12-month retention enforced via scheduled prune.
-- Never store secrets, tokens, raw OTPs, or full PII payloads in metadata.

create table if not exists audit_log (
  id           uuid primary key default gen_random_uuid(),
  user_id      text,
  clinic_id    text,
  action       text not null,
  resource     text not null,
  resource_id  text,
  ip           text,
  user_agent   text,
  metadata     jsonb,
  created_at   timestamptz default now()
);

create index if not exists audit_log_user_id_idx     on audit_log(user_id);
create index if not exists audit_log_clinic_id_idx   on audit_log(clinic_id);
create index if not exists audit_log_action_idx      on audit_log(action);
create index if not exists audit_log_created_at_idx  on audit_log(created_at);
