create table option_selections (
  id varchar primary key,
  name varchar not null,
  price double precision not null default 0,
  option_id varchar not null references product_options (id) on update cascade on delete cascade,
  ordinance int not null default 1,
  status varchar not null default 'available',
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  constraint unique_name_option_id unique(name, option_id)
);

create trigger handle_updated_at before update on option_selections
  for each row execute procedure moddatetime (updated_at);

alter publication supabase_realtime add table option_selections;