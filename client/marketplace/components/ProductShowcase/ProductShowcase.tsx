'use client';

import Section from '../../../_shared/components/Section/Section';
import { Box, Divider, IconButton, Paper, Typography } from '@mui/material';
import Link from 'next/link';
import { CategoriesInterface, ProductsInterface } from '../../../../_shared/types';
import { Fragment, UIEvent, useEffect, useRef, useState } from 'react';
import Icon from '@mdi/react';
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';
import { grey } from '@mui/material/colors';

interface Props {
  title: string;
  products: ProductsInterface[];
  actionUrl?: string;
  breadcrumbs?: CategoriesInterface[];
}

const ProductShowcase = ({ title, products, actionUrl, breadcrumbs }: Props) => {
  const productContainerRef = useRef<HTMLDivElement>(null);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [offsetWidth, setOffsetWidth] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollable = scrollWidth > offsetWidth;

  useEffect(() => {
    if (products.length > 0 && productContainerRef.current) {
      setScrollWidth(productContainerRef.current?.scrollWidth || 0);
      setOffsetWidth(productContainerRef.current?.offsetWidth || 0);
    }
  }, [products, productContainerRef.current]);

  const handleLeftClick = () => {
    if (productContainerRef.current) {
      const x = scrollLeft - offsetWidth / 2;

      productContainerRef.current.scroll(x, 0);
    }
  };

  const handleRightClick = () => {
    if (productContainerRef.current) {
      const x = scrollLeft + offsetWidth / 2;

      productContainerRef.current.scroll(x, 0);
    }
  };

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    setScrollLeft(e.currentTarget.scrollLeft);
  };

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
      <Box sx={{ display: 'flex', position: 'relative' }}>
        {scrollable && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: 'calc(100% - 50px)',
              position: 'absolute',
              left: 0,
              zIndex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.75)'
            }}
          >
            <IconButton size='small' disabled={scrollLeft === 0} onClick={handleLeftClick}>
              <Icon path={mdiChevronLeft} size={2} color={grey[500]} />
            </IconButton>
          </Box>
        )}

        <Box
          ref={productContainerRef}
          className='product-container'
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            flexWrap: 'nowrap',
            overflowX: 'auto',
            position: 'relative',
            left: 0
          }}
          onScroll={handleScroll}
        >
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
              <Paper
                key={product.id}
                variant='outlined'
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flexShrink: 0,
                  width: '25%',
                  maxWidth: '400px',
                  minWidth: '300px',
                  mr: 1
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
            );
          })}
        </Box>

        {scrollable && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: 'calc(100% - 50px)',
              position: 'absolute',
              right: 0,
              zIndex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.75)'
            }}
          >
            <IconButton
              size='small'
              onClick={handleRightClick}
              disabled={scrollLeft + offsetWidth >= scrollWidth}
            >
              <Icon path={mdiChevronRight} size={2} color={grey[500]} />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* <Grid2 container spacing={1}>
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
      </Grid2> */}
    </Section>
  ) : null;
};

export default ProductShowcase;
