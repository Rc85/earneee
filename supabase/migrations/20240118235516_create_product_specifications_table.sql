create table product_specifications (
  id varchar primary key,
  name varchar not null,
  values varchar not null,
  variant_id varchar not null references product_variants (id) on update cascade on delete cascade,
  ordinance int,
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  constraint uniq_name_variant_id unique (name, variant_id)
);

create trigger handle_updated_at before update on product_specifications
  for each row execute procedure moddatetime (updated_at);

alter publication supabase_realtime add table product_specifications;