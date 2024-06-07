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
    router.push(`/product/${product.id}`);
  };

  return products && products.length > 0 ? (
    <Section
      title={type === 'new' ? 'RECENTLY ADDED' : 'POPULAR PRODUCTS'}
      titleVariant='h4'
      containerStyle={{ mb: 3 }}
    >
      <Grid2 container spacing={1}>
        {products?.map((product) => {
          const media = product.media?.[0];
          const mediaUrl = media?.url;
          const mediaWidth = media?.width || 0;
          const mediaHeight = media?.height || 0;
          const excerpt = product.excerpt;
          const price = product.url?.price || 0;
          const currency = product.url?.currency || 'CAD';
          const discount = product.url?.discount;

          let discountAmount = 0;

          if (discount) {
            if (discount.amountType === 'fixed') {
              discountAmount = discount.amount;
            } else if (discount.amountType === 'percentage') {
              discountAmount = price * (discount.amount / 100);
            }
          }

          const finalPrice = price - discountAmount;

          return (
            <Grid2 key={product.id} xs={12} sm={4}>
              <Paper
                variant='outlined'
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flexShrink: 0
                }}
                className='product-card'
              >
                <Box>
                  <Box sx={{ cursor: 'pointer' }} onClick={() => handleProductClick(product)}>
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
                        {product.brand?.name} {product.name}
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
                        ${finalPrice.toFixed(2)} {currency.toUpperCase()}
                      </Typography>

                      <Box sx={{ display: 'flex' }}>
                        {discount && (
                          <Typography
                            variant='body2'
                            sx={{ textAlign: 'center', fontWeight: 500, color: 'success.main' }}
                          >
                            {discount.amountType === 'fixed'
                              ? `$${discount.amount.toFixed(2)} off`
                              : `${discount.amount}% off`}
                          </Typography>
                        )}

                        {price !== finalPrice && (
                          <Typography variant='body2' sx={{ textAlign: 'center', ml: 1 }} color='GrayText'>
                            Was ${price.toFixed(2)}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>

                  {product.url?.affiliate && (
                    <>
                      <Divider />

                      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <Typography variant='body2' sx={{ textAlign: 'center' }}>
                          Sold on {product.url.affiliate.name}
                        </Typography>
                      </Box>
                    </>
                  )}
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
