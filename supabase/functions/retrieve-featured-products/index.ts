import { corsHeaders } from '../_shared/cors.ts';
import db from '../_shared/db.ts';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const { categoryId, groupId, subcategoryId, type, featured } = await req.json();

  const products = await db`
  with
  p as (
    select
      p.id,
      p.name,
      p.description,
      p.category_id,
      p.excerpt,
      p.type,
      p.status
    from products as p
  ),
  pm as (
    select
      pm.id,
      pm.url,
      pm.width,
      pm.height,
      pm.variant_id
    from product_media as pm
    where pm.status = 'enabled'
  )
  
  select
    pv.id,
    pv.name,
    pv.price,
    pv.description,
    pv.status,
    pv.url,
    p.product,
    coalesce(pm.media, '[]'::jsonb) as media
  from product_variants as pv
  left join lateral (
    select jsonb_agg(pm.*) as media
    from pm
    where pm.variant_id = pv.id
  ) as pm on true
  left join lateral (
    select to_jsonb(p.*) as product
    from p
    where p.id = pv.product_id
  ) as p on true
  ${
    categoryId
      ? db` where p.product->>'category_id' = ${categoryId}`
      : subcategoryId
      ? db`where p.product->>'category_id' = ${subcategoryId}`
      : groupId
      ? db`where p.product->>'category_id' = ${groupId}`
      : db``
  } ${
    featured
      ? db`${
          !groupId && !subcategoryId && !categoryId ? db`where featured is true` : db`and featured is true`
        }`
      : db``
  }
  ${type === 'new' ? db`order by created_at desc` : db``}
  `;

  return new Response(JSON.stringify({ products }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200
  });
});
