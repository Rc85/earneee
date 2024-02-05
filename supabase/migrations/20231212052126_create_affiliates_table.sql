create table affiliates (
  id varchar primary key,
  name varchar not null,
  logo_url varchar,
  logo_path varchar,
  url varchar,
  manager_url varchar,
  description varchar,
  commission_rate double precision,
  rate_type varchar not null default 'fixed',
  cashback double precision,
  status varchar not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create trigger handle_updated_at before update on affiliates
  for each row execute procedure moddatetime (updated_at);

alter publication supabase_realtime add table affiliates;