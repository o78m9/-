create table clinics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner text,
  phone text,
  created_at timestamptz default now()
);

create table customers (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid references clinics(id) on delete cascade,
  name text not null,
  phone text not null,
  email text,
  first_visit date,
  last_visit date,
  total_spent numeric default 0,
  status text default 'active',
  tags text[],
  notes text,
  created_at timestamptz default now(),
  constraint customers_phone_clinic_unique unique (phone, clinic_id)
);

create table visits (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete cascade,
  date date not null,
  service text,
  amount numeric,
  notes text,
  created_at timestamptz default now()
);

create index customers_clinic_id_idx on customers(clinic_id);
create index customers_status_idx on customers(status);
create index customers_last_visit_idx on customers(last_visit);
create index visits_customer_id_idx on visits(customer_id);
