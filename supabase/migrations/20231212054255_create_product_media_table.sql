create table product_media (
  id varchar primary key,
  url varchar not null,
  path varchar,
  type varchar not null,
  width int not null,
  height int not null,
  variant_id varchar not null references product_variants (id) on update cascade on delete cascade,
  ordinance int,
  status varchar not null default 'enabled',
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  constraint unique_url_path_variant_id unique (url, path, variant_id)
);

create trigger handle_updated_at before update on product_media
  for each row execute procedure moddatetime (updated_at);

  alter publication supabase_realtime add table product_media;