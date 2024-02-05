create table products (
  id varchar primary key,
  name varchar not null unique,
  category_id int not null references categories (id) on update cascade on delete cascade,
  brand_id varchar references product_brands (id) on update cascade on delete set null,
  description varchar,
  excerpt varchar,
  type varchar not null,
  affiliate_id varchar references affiliates (id) on update cascade on delete set null,
  status varchar not null default 'available',
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create trigger handle_updated_at before update on products
  for each row execute procedure moddatetime (updated_at);

alter publication supabase_realtime add table products;