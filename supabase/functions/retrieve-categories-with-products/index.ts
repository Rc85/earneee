import { corsHeaders } from '../_shared/cors.ts';
import db from '../_shared/db.ts';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const { groupId, subcategoryId, categoryId, offset } = await req.json();

  const products = await db`with recursive
  p as (
    select * from categories
    where ${
      groupId ? db`id = ${groupId}` : subcategoryId ? db`id = ${subcategoryId}` : db`id = ${categoryId}`
    }
    union all
    select c.*
    from categories as c
    join p on p.id = c.parent_id
  )
  
  select
    pv.id,
    pv.name,
    pv.price,
    pv.description,
    pv.url,
    pv.product_id,
    pv.status,
    pr.product
  from product_variants as pv
  left join lateral (
    select to_jsonb(p.*) as product
    from products as p
    where p.id = pv.product_id
  ) as pr on true
  where (pr.product->>'category_id')::int in (select id from p)
  offset ${offset}
  limit 30`;

  const count = await db`with recursive
  p as (
    select * from categories
    where ${
      groupId ? db`id = ${groupId}` : subcategoryId ? db`id = ${subcategoryId}` : db`id = ${categoryId}`
    }
    union all
    select c.*
    from categories as c
    join p on p.id = c.parent_id
  )
  
  select
    pv.id,
    pv.name,
    pv.price,
    pv.description,
    pv.url,
    pv.product_id,
    pv.status,
    pr.product
  from product_variants as pv
  left join lateral (
    select to_jsonb(p.*) as product
    from products as p
    where p.id = pv.product_id
  ) as pr on true
  where (pr.product->>'category_id')::int in (select id from p)`;

  return new Response(JSON.stringify({ products, count: count.length }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});
