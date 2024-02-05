create table offers (
  id varchar primary key,
  name varchar not null,
  url varchar not null,
  logo_url varchar not null,
  logo_path varchar not null,
  logo_width int not null,
  logo_height int not null,
  details varchar,
  ordinance int default 1,
  start_date timestamptz,
  end_date timestamptz,
  status varchar not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create trigger handle_updated_at before update on offers
  for each row execute procedure moddatetime (updated_at);

alter publication supabase_realtime add table offers;