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
    const urls = product.urls?.[0];

    if (urls?.type === 'affiliate') {
      if (urls) {
        const { url } = urls;

        if (url) {
          window.open(url, '_blank', 'noopener, noreferrer');
        }
      }
    } else {
      router.push(`/product/${product.id}`);
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
          const media = product.media?.[0];
          const mediaUrl = media?.url;
          const mediaWidth = media?.width || 0;
          const mediaHeight = media?.height || 0;
          const excerpt = product.excerpt;
          const urls = product?.urls || [];

          urls.sort((a, b) => (a.price < b.price ? -1 : 1));

          const lowestPrice = urls[0]?.price || 0;
          const highestPrice = urls.length > 1 ? urls[urls.length - 1]?.price : 0;
          const currency = urls[0]?.currency || 'cad';
          const affiliateName = urls[0]?.affiliate?.name;
          const discountTexts = [];
          const totalFixedDiscount = (
            product.discounts?.filter((discount) => discount.amountType === 'fixed') || []
          )
            .map((discount) => discount.amount)
            .reduce((acc, amount) => acc + amount, 0);
          const totalPercentageDiscount = (
            product.discounts?.filter((discount) => discount.amountType === 'percentage') || []
          )
            .map((discount) => discount.amount)
            .reduce((acc, amount) => acc + amount, 0);

          const discountedLowestPrice =
            lowestPrice -
            totalFixedDiscount -
            (lowestPrice - totalFixedDiscount) * (totalPercentageDiscount / 100);

          const discountedHighestPrice =
            highestPrice -
            totalFixedDiscount -
            (highestPrice - totalFixedDiscount) * (totalPercentageDiscount / 100);

          if (product.discounts) {
            for (const discount of product.discounts) {
              if (discount.amountType === 'percentage') {
                discountTexts.push(`${discount.amount}% off`);
              }

              if (discount.amountType === 'fixed') {
                discountTexts.push(`$${discount.amount} off`);
              }
            }
          }

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
                        ${discountedLowestPrice.toFixed(2)}
                        {discountedHighestPrice ? ` - $${discountedHighestPrice.toFixed(2)}` : ''}{' '}
                        {currency.toUpperCase()}
                      </Typography>

                      <Box sx={{ display: 'flex' }}>
                        {discountTexts.length > 0 && (
                          <Typography variant='body2' color='red' sx={{ textAlign: 'center' }}>
                            {discountTexts.join(', ')}
                          </Typography>
                        )}

                        {lowestPrice !== discountedLowestPrice && (
                          <Typography variant='body2' sx={{ textAlign: 'center', ml: 1 }} color='GrayText'>
                            Was ${lowestPrice.toFixed(2)}
                            {highestPrice ? ` - ${highestPrice.toFixed(2)}` : ''}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>

                  {Boolean(affiliateName) && (
                    <>
                      <Divider />

                      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <Typography variant='body2' sx={{ textAlign: 'center' }}>
                          Sold on {affiliateName}
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
