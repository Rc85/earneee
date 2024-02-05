import postgres from 'https://deno.land/x/postgresjs@v3.4.3/mod.js';

const db = postgres(Deno.env.get('SUPABASE_DB_URL') ?? '');

export default db;
