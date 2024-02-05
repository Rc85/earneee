import { corsHeaders } from '../_shared/cors.ts';
import db from '../_shared/db.ts';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const { groupId, subcategoryId, categoryId, depth } = await req.json();
  const id = groupId || subcategoryId || categoryId;

  const categories = await db`with recursive
  d as (
    select
      c.id,
      c.name,
      c.parent_id,
      c.type,
      1 as depth
    from categories as c
    ${id ? db`where c.parent_id = ${id}` : db`where c.parent_id is null`}
    union all
    select
      c.id,
      c.name,
      c.parent_id,
      c.type,
      d.depth + 1 as depth
    from categories as c
    join d on d.id = c.parent_id
  )
  
  select
    d.id,
    d.name,
    d.type
  from d
  ${!groupId ? db`where d.depth = 1 or d.type is not null` : depth != null ? db`d.depth = ${depth}` : db``}`;

  return new Response(JSON.stringify({ categories }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});
