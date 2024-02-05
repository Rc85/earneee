create table user_profiles (
  id uuid primary key references auth.users (id) on update cascade on delete cascade,
  first_name varchar,
  last_name varchar,
  phone_number varchar,
  address varchar,
  city varchar,
  region varchar,
  country varchar,
  postal_code varchar,
  logo_url varchar,
  logo_path varchar,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create trigger handle_updated_at before update on user_profiles
  for each row execute procedure moddatetime (updated_at);

alter publication supabase_realtime add table user_profiles;

create or replace function create_user_profile() returns trigger as
$body$
begin
  insert into public.user_profiles (id) values (new.id);

  return null;
end;
$body$
language plpgsql security definer;

create trigger handle_new_user after insert on auth.users
  for each row execute procedure create_user_profile();