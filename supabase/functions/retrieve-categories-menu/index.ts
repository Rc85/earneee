import { corsHeaders } from '../_shared/cors.ts';
import db from '../_shared/db.ts';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const categories = await db`with
  c2 as (
    select
      c.id,
      c.name,
      c.parent_id
    from categories as c
    left join lateral (
      select count(p.*) as product
      from products as p
      where p.category_id = c.id
    ) as p on true
    where p.product > 0
  ),
  c1 as (
    select
      c.id,
      c.name,
      c.parent_id,
      coalesce(c2.subcategories, '[]'::jsonb) as subcategories
    from categories as c
    left join lateral (
      select jsonb_agg(c2.*) as subcategories
      from c2
      where c2.parent_id = c.id
    ) as c2 on true
    where jsonb_array_length(c2.subcategories) > 0
  )
  
  select
    c.id,
    c.name,
    coalesce(c1.subcategories, '[]'::jsonb) as subcategories
  from categories as c
  left join lateral (
    select jsonb_agg(c1.*) as subcategories
    from c1
    where c1.parent_id = c.id
  ) as c1 on true
  where jsonb_array_length(c1.subcategories) > 0
  and c.parent_id is null`;

  return new Response(JSON.stringify({ categories }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});
