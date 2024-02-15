import Section from '../../../../_shared/components/Section/Section';
import { Box, Breadcrumbs, CircularProgress, Typography } from '@mui/material';
import Link from 'next/link';
import { ProductsInterface } from '../../../../../_shared/types';
import Main from './main';

interface Props {
  params: { id: string };
}

const Product = async ({ params: { id } }: Props) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/auth/marketplace/product/${id}`, {
    next: { revalidate: 300, tags: ['product', id] },
    credentials: 'include'
  });
  const data = await res.json();
  const product: ProductsInterface = data.product;

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

        <Typography>{product?.name}</Typography>
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
