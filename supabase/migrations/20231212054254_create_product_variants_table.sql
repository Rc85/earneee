create table product_variants (
  id varchar primary key,
  name varchar not null,
  price double precision not null default 0,
  description varchar,
  featured boolean not null default false,
  url varchar,
  product_id varchar not null references products (id) on update cascade on delete cascade,
  ordinance int not null default 0,
  status varchar not null default 'available',
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  constraint unique_name_product_id unique(name, product_id)
);

create trigger handle_updated_at before update on product_variants
  for each row execute procedure moddatetime (updated_at);

  alter publication supabase_realtime add table product_variants;