'use server';

import Section from '../../../_shared/components/Section/Section';
import { ProductVariantsInterface } from '../../../../_shared/types';
import { createClient } from '../../utils/supabase/server';
import { Box } from '@mui/material';
import { cookies } from 'next/headers';
import Product from './Product';

interface Props {
  categoryId?: string;
  subcategoryId?: string;
  groupId?: string;
  type: 'new' | 'popular';
}

const FeaturedProducts = async ({ categoryId, subcategoryId, groupId, type }: Props) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const response = await supabase.functions.invoke('retrieve-featured-products', {
    body: { categoryId, groupId, subcategoryId, type }
  });

  const variants: ProductVariantsInterface[] = response.data?.products || [];

  return (
    <Section
      title={type === 'new' ? 'NEW PRODUCTS' : 'POPULAR PRODUCTS'}
      titleVariant='h4'
      containerStyle={{ mb: 3 }}
    >
      <Box sx={{ display: 'flex', overflowX: 'auto', flexWrap: 'nowrap', py: 1 }}>
        {variants?.map((variant, i) => (
          <Product key={variant.id} variant={variant} isLast={i === variants.length - 1} />
        ))}
      </Box>
    </Section>
  );
};

export default FeaturedProducts;
