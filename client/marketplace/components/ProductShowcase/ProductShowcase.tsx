'use client';

import Section from '../../../_shared/components/Section/Section';
import { Box, Divider, Paper, Typography } from '@mui/material';
import { retrieveProductShowcase } from '../../../_shared/api';
import { useAppSelector } from '../../../_shared/redux/store';
import { useRouter } from 'next/navigation';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { ProductsInterface } from '../../../../_shared/types';

interface Props {
  type: 'new' | 'popular';
}

const ProductShowcase = ({ type }: Props) => {
  const { country } = useAppSelector((state) => state.App);
  const { data } = retrieveProductShowcase({ type, country });
  const { products } = data || {};
  const router = useRouter();

  const handleProductClick = (product: ProductsInterface) => {
    if (product.type === 'affiliate') {
      const urls = product.variants?.[0].urls?.[0];

      if (urls) {
        const { url } = urls;

        if (url) {
          window.open(url, '_blank');
        }
      }
    } else {
      router.push(`/product/${product.id}?variant=${product.variants?.[0]?.id}`);
    }
  };

  return products && products.length > 0 ? (
    <Section
      title={type === 'new' ? 'RECENTLY ADDED' : 'POPULAR PRODUCTS'}
      titleVariant='h4'
      containerStyle={{ mb: 3 }}
    >
      <Grid2 container spacing={1}>
        {products?.map((product) => {
          const variant = product.variants?.[0];
          const media = product.media?.[0] || variant?.media?.[0];
          const mediaUrl = media?.url;
          const mediaWidth = media?.width || 0;
          const mediaHeight = media?.height || 0;
          const excerpt = product.excerpt || variant?.excerpt;
          const urls = variant?.urls || [];

          urls.sort((a, b) => (a.price < b.price ? -1 : 1));

          const lowestPrice = urls[0]?.price || 0;
          const highestPrice = urls.length > 1 ? urls[urls.length - 1]?.price : 0;
          const currency = urls[0]?.currency || 'cad';
          const affiliateName = urls[0]?.affiliate?.name;

          return (
            <Grid2 key={product.id} xs={12} sm={4}>
              <Paper
                variant='outlined'
                sx={{
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  flexShrink: 0
                }}
                className='product-card'
              >
                <Box onClick={() => handleProductClick(product)}>
                  <Box
                    sx={{
                      borderTopRightRadius: 4,
                      borderTopLeftRadius: 4,
                      backgroundImage: mediaUrl ? `url('${mediaUrl}')` : undefined,
                      backgroundSize: mediaWidth / mediaHeight > 1.5 ? 'cover' : 'contain',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center top',
                      height: '200px'
                    }}
                  />

                  <Box sx={{ p: 2, flexGrow: 1 }}>
                    <Typography variant='h6' sx={{ mb: 0 }}>
                      {product.name} {variant?.name ? `- ${variant?.name}` : ''}
                    </Typography>

                    {Boolean(excerpt) && (
                      <>
                        <Divider sx={{ my: 1 }} />

                        <Typography
                          sx={{
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            WebkitLineClamp: 3
                          }}
                        >
                          {excerpt}
                        </Typography>
                      </>
                    )}
                  </Box>

                  <Divider />

                  <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Typography variant='h6' sx={{ mb: 0 }}>
                      ${lowestPrice.toFixed(2)}
                      {highestPrice ? ` - ${highestPrice.toFixed(2)}` : ''} {currency.toUpperCase()}
                    </Typography>

                    {Boolean(affiliateName) && (
                      <Typography variant='body2' sx={{ textAlign: 'center' }}>
                        Sold on {affiliateName}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Paper>
            </Grid2>
          );
        })}
      </Grid2>
    </Section>
  ) : null;
};

export default ProductShowcase;
