'use client';

import Section from '../../../_shared/components/Section/Section';
import { Box, Divider, Paper, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import Link from 'next/link';
import { CategoriesInterface, ProductsInterface } from '../../../../_shared/types';
import { Fragment } from 'react';

interface Props {
  title: string;
  products: ProductsInterface[];
  actionUrl?: string;
  breadcrumbs?: CategoriesInterface[];
}

const ProductShowcase = ({ title, products, actionUrl, breadcrumbs }: Props) => {
  return products && products.length > 0 ? (
    <Section
      title={title}
      supertitle={
        <Box sx={{ display: 'flex' }}>
          {breadcrumbs?.map((category, i) => (
            <Fragment key={category.id}>
              <Link href={`/products/${category.id}`}>
                <Typography variant='body2'>{category.name}</Typography>
              </Link>

              {i + 1 !== breadcrumbs.length && (
                <Typography variant='body2' sx={{ mx: 1 }}>
                  /
                </Typography>
              )}
            </Fragment>
          ))}
        </Box>
      }
      titleVariant='h4'
      actions={
        Boolean(actionUrl)
          ? [
              <Link key='url' href={actionUrl!}>
                View All
              </Link>
            ]
          : undefined
      }
      containerStyle={{ mb: 3 }}
    >
      <Grid2 container spacing={1}>
        {products?.map((product) => {
          const productMedia = product?.media || [];
          const variants = product?.variants || [];
          const variant = variants.find((variant) => variant.media?.find((media) => media.useAsThumbnail));
          const media =
            productMedia.find((media) => media.useAsThumbnail) ||
            variant?.media?.[0] ||
            productMedia[0] ||
            variants?.[0]?.media?.[0];
          const mediaUrl = media?.url;
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
                className='product'
              >
                <Box>
                  <Link href={`/product/${product.id}`}>
                    <Box
                      sx={{
                        borderTopRightRadius: 4,
                        borderTopLeftRadius: 4,
                        backgroundImage: mediaUrl ? `url('${mediaUrl}')` : undefined,
                        backgroundSize: media?.sizing || 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: media?.sizing === 'contain' ? 'center top' : 'center',
                        height: '200px'
                      }}
                    />

                    <Box sx={{ p: 2, flexGrow: 1 }}>
                      <Typography variant='h6' sx={{ mb: 0 }}>
                        {product?.brand?.name ? `${product?.brand?.name} ` : ''}
                        {product.name}
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
                  </Link>

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
