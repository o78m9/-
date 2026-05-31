-- Outbound message log + attribution disputes. See docs/ATTRIBUTION.md.
-- Idempotent. Safe to re-apply.

create table if not exists messages (
  id                          uuid primary key default gen_random_uuid(),
  clinic_id                   text not null,
  customer_id                 text not null,
  template_slug               text not null,
  meta_template_id            text,
  variables                   jsonb not null,
  status                      text not null default 'queued',
  sent_at                     timestamptz,
  delivered_at                timestamptz,
  read_at                     timestamptz,
  failed_at                   timestamptz,
  failure_reason              text,
  meta_message_id             text,
  patient_was_dormant_at_send boolean,
  superseded_by               uuid references messages(id) on delete set null,
  created_at                  timestamptz default now()
);

create index if not exists messages_clinic_idx       on messages(clinic_id);
create index if not exists messages_customer_idx     on messages(customer_id);
create index if not exists messages_status_idx       on messages(status);
create index if not exists messages_sent_at_idx      on messages(sent_at);
create index if not exists messages_clinic_cust_sent_idx on messages(clinic_id, customer_id, sent_at);

create table if not exists attribution_disputes (
  id          uuid primary key default gen_random_uuid(),
  clinic_id   text not null,
  visit_id    text not null,
  message_id  uuid references messages(id) on delete set null,
  reason      text not null,
  notes       text,
  filed_at    timestamptz default now(),
  decided_at  timestamptz default now()
);

create index if not exists attr_disputes_clinic_idx  on attribution_disputes(clinic_id);
create index if not exists attr_disputes_visit_idx   on attribution_disputes(visit_id);
