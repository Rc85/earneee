import { corsHeaders } from '../_shared/cors.ts';
import db from '../_shared/db.ts';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const { productId } = await req.json();

  const product = await db`with recursive
  ac as (
    select
      c.id,
      c.name,
      1::int as depth,
      (array[]::jsonb[] || jsonb_build_object('id', c.id, 'name', c.name)) as ancestors
    from categories as c
    union all
    select
      c.id,
      c.name,
      ac.depth + 1 as depth,
      ac.ancestors || jsonb_build_object('id', c.id, 'name', c.name)
    from categories as c, ac
    where c.parent_id = ac.id
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
  ),
  os as (
    select
      os.id,
      os.name,
      os.price,
      os.option_id,
      os.status
    from option_selections as os
    order by os.ordinance
  ),
  po as (
    select
      po.id,
      po.name,
      po.variant_id
    from product_options as po
    order by po.name
  ),
  pv as (
    select
      pv.id,
      pv.name,
      pv.price,
      pv.description,
      pv.product_id,
      pv.status,
      coalesce(pm.media, '[]'::jsonb) as media,
      coalesce(po.options, '[]'::jsonb) as options,
      coalesce(ps.specifications, '[]'::jsonb) as specifications
    from product_variants as pv
    left join lateral (
      select jsonb_agg(pm.*) as media
      from pm
      where pm.variant_id = pv.id
    ) as pm on true
    left join lateral (
      select jsonb_agg(po.*) as options
      from po
      where po.variant_id = pv.id
    ) as po on true
    left join lateral (
      select jsonb_agg(ps.*) as specifications
      from ps
      where ps.variant_id = pv.id
    ) as ps on true
    order by pv.ordinance
  ),
  ps as (
    select
      ps.id,
      ps.name,
      ps.values,
      ps.variant_id
    from product_specifications as ps
    order by ps.ordinance
  )
  
  select
    p.id,
    p.name,
    p.description,
    p.excerpt,
    p.status,
    ac.ancestors,
    coalesce(pv.variants, '[]'::jsonb) as variants
  from products as p
  left join lateral (
    select ac.ancestors, ac.depth from ac
    where ac.id = p.category_id
  ) as ac on true
  left join lateral (
    select jsonb_agg(pv.*) as variants
    from pv
    where pv.product_id = p.id
  ) as pv on true
  where p.id = ${productId}
  order by ac.depth desc
  limit 1`;

  return new Response(JSON.stringify({ product }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});
