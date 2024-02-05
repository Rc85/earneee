import { cookies } from 'next/headers';
import Section from '../../../../_shared/components/Section/Section';
import { createClient } from '../../../utils/supabase/server';
import { Box, Breadcrumbs, CircularProgress } from '@mui/material';
import Link from 'next/link';
import { ProductsInterface } from '../../../../_shared/types';
import Main from './main';

interface Props {
  params: { id: string };
}

const Product = async ({ params: { id } }: Props) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const response = await supabase.functions.invoke('retrieve-product', { body: { productId: id } });
  const product: ProductsInterface = response.data?.product?.[0];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Breadcrumbs>
        {product?.ancestors?.map((ancestor, i, arr) => {
          const paths = arr.slice(0, i + 1);

          return (
            <Link key={ancestor.id} href={`/products/${paths.map((path) => path.id).join('/')}`}>
              {ancestor.name}
            </Link>
          );
        })}
      </Breadcrumbs>

      <Section title={product?.name} titleVariant='h3' maxWidth='xl' disableGutters>
        {product ? (
          <Main product={product} />
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress sx={{ mx: 'auto' }} />
          </Box>
        )}
      </Section>
    </Box>
  );
};

export default Product;
