create table product_brands (
  id varchar primary key,
  name varchar not null,
  url varchar,
  logo_url varchar,
  logo_path varchar,
  owner uuid references auth.users (id) on update cascade on delete set null,
  status varchar not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create unique index unique_name_owner on product_brands (name, owner) where owner is not null;

create trigger handle_updated_at before update on product_brands
  for each row execute procedure moddatetime (updated_at);

alter publication supabase_realtime add table product_brands;