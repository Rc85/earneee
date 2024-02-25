'use server';

import Section from '../../../_shared/components/Section/Section';
import { Box } from '@mui/material';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import Products from './Products';
import { ProductVariantsInterface } from '../../../../_shared/types';

interface Props {
  categoryId?: string;
  subcategoryId?: string;
  groupId?: string;
  type: 'new' | 'popular';
}

const ProductShowcase = async ({ categoryId, subcategoryId, groupId, type }: Props) => {
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/product/variant?type=${type}`;
  const queries = [];

  if (categoryId) {
    queries.push(`categoryId=${categoryId}`);
  } else if (subcategoryId) {
    queries.push(`subcategoryId=${subcategoryId}`);
  } else if (groupId) {
    queries.push(`groupId=${groupId}`);
  }

  const res = await fetch(url + queries.join('&'), { credentials: 'include', next: { revalidate: 300 } });
  const queryClient = new QueryClient();
  const data = await res.json();
  const variants: ProductVariantsInterface[] = data.variants;

  return variants.length > 0 ? (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Section
        title={type === 'new' ? 'NEW PRODUCTS' : 'POPULAR PRODUCTS'}
        titleVariant='h4'
        containerStyle={{ mb: 3 }}
      >
        <Box sx={{ display: 'flex', overflowX: 'auto', flexWrap: 'nowrap', py: 1 }}>
          <Products variants={variants} />
        </Box>
      </Section>
    </HydrationBoundary>
  ) : null;
};

export default ProductShowcase;
