'use client';

import Section from '../../../../_shared/components/Section/Section';
import { Box, Breadcrumbs, Button, Divider, Paper, Typography } from '@mui/material';
import Link from 'next/link';
import { Loading } from '../../../../_shared/components';
import { retrieveMarketplaceProduct } from '../../../../_shared/api';
import Grid2 from '@mui/material/Unstable_Grid2';
import { useState, Fragment, useEffect } from 'react';
import { Gallery } from '../../../components';
import { useAppSelector } from '../../../../_shared/redux/store';
import { ProductsInterface } from '../../../../../_shared/types';
import { grey } from '@mui/material/colors';
import Icon from '@mdi/react';
import { mdiImageOff } from '@mdi/js';

interface Props {
  params: { id: string };
}

const Product = ({ params: { id } }: Props) => {
  const { country } = useAppSelector((state) => state.App);
  const { isLoading, data } = retrieveMarketplaceProduct({ productId: id, country });
  const product = data?.product;
  const [selectedVariant, setSelectVariant] = useState<ProductsInterface | undefined>();
  const selectedVariantSpecifications = selectedVariant?.specifications || [];
  const productSpecifications = product?.specifications || [];
  const allSpecifications = [...selectedVariantSpecifications, ...productSpecifications];
  //const options = selectedVariant?.options || [];
  const selectedVariantMedia = selectedVariant?.media || [];
  const productMedia = product?.media || [];
  const media = [...productMedia, ...selectedVariantMedia];
  const excerpt = product?.excerpt || '';
  const about = selectedVariant?.about || product?.about;
  const details = selectedVariant?.details || product?.details;
  const description = selectedVariant?.description || product?.description;
  const specifications: { name: string; value: string[] }[] = [];
  const price = product?.url?.price || 0;
  const currency = product?.url?.currency || 'CAD';
  const discount = product?.url?.discount;

  let discountAmount = 0;

  if (discount) {
    if (discount.amountType === 'fixed') {
      discountAmount = discount.amount;
    } else if (discount.amountType === 'percentage') {
      discountAmount = price * (discount.amount / 100);
    }
  }

  const finalPrice = price - discountAmount;

  useEffect(() => {
    if (product?.variants?.[0]) {
      setSelectVariant(product?.variants?.[0]);
    }
  }, [product?.variants]);

  for (const specification of allSpecifications) {
    const index = specifications.findIndex((s) => s.name === specification.name);

    if (index >= 0) {
      specifications[index].value.push(specification.value);
    } else {
      specifications.push({ name: specification.name, value: [specification.value] });
    }
  }

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

      <Section
        title={`${product?.brand?.name} ${product?.name}`}
        subtitle={excerpt}
        titleVariant='h3'
        maxWidth='xl'
        disableGutters
      >
        {isLoading ? (
          <Loading />
        ) : (
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ flexGrow: 1 }}>
              <Gallery media={media} />

              {Boolean(details) && (
                <Box sx={{ mb: 3 }}>
                  <Divider sx={{ mb: 1 }} />

                  <Typography variant='h6'>Details</Typography>

                  {selectedVariant?.details ? (
                    <div
                      className='product-description'
                      dangerouslySetInnerHTML={{ __html: selectedVariant?.details }}
                    />
                  ) : (
                    product?.details && (
                      <div
                        className='product-description'
                        dangerouslySetInnerHTML={{ __html: product.details }}
                      />
                    )
                  )}
                </Box>
              )}

              {specifications.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Divider sx={{ mb: 1 }} />

                  <Typography variant='h6'>Specifications</Typography>

                  <Grid2
                    container
                    sx={{
                      '--Grid-borderWidth': '1px',
                      borderTop: 'var(--Grid-borderWidth) solid',
                      borderLeft: 'var(--Grid-borderWidth) solid',
                      borderColor: 'divider',
                      '& > div': {
                        borderRight: 'var(--Grid-borderWidth) solid',
                        borderBottom: 'var(--Grid-borderWidth) solid',
                        borderColor: 'divider'
                      },
                      mb: 3
                    }}
                  >
                    {specifications.map((specification) => (
                      <Fragment key={specification.name}>
                        <Grid2 xs={4}>
                          <Typography sx={{ margin: 2 }}>{specification.name}</Typography>
                        </Grid2>

                        <Grid2 xs={8}>
                          <Typography sx={{ margin: 2 }}>{specification.value.join(', ')}</Typography>
                        </Grid2>
                      </Fragment>
                    ))}
                  </Grid2>
                </Box>
              )}

              {Boolean(description) && (
                <Box sx={{ mb: 3 }}>
                  <Divider sx={{ mb: 1 }} />

                  <Typography variant='h6'>Description</Typography>

                  {selectedVariant?.description ? (
                    <div
                      className='product-description'
                      dangerouslySetInnerHTML={{ __html: selectedVariant?.description }}
                    />
                  ) : (
                    product?.description && (
                      <div
                        className='product-description'
                        dangerouslySetInnerHTML={{ __html: product.description }}
                      />
                    )
                  )}
                </Box>
              )}
            </Box>
            <Box sx={{ width: '25%', minWidth: '400px', maxWidth: '400px', ml: 2 }}>
              {product?.variants?.map((variant) => {
                const media = variant.media?.[0];
                const mediaUrl = media?.url;

                return (
                  <Paper
                    key={variant.id}
                    onClick={() => setSelectVariant(variant)}
                    variant='outlined'
                    sx={{
                      display: 'flex',
                      opacity: selectedVariant?.id === variant.id ? 1 : 0.5,
                      mb: 1,
                      cursor: 'pointer'
                    }}
                  >
                    <Box
                      sx={{
                        width: '75px',
                        height: '75px',
                        flexShrink: 0,
                        backgroundImage: mediaUrl ? `url('${mediaUrl}')` : undefined,
                        backgroundColor: grey[300],
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center center',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      {!mediaUrl && <Icon path={mdiImageOff} size={1} color={grey[600]} />}
                    </Box>

                    <Box sx={{ flexGrow: 1, p: 1 }}>
                      <Typography>{variant.name}</Typography>
                    </Box>
                  </Paper>
                );
              })}

              {selectedVariant?.status === 'available' && (
                <>
                  {/* options.map((option) => (
                      <Box key={option.id}>
                        <Typography variant='h6'>
                          {option.name} {option.required && <Typography color='red'>Required</Typography>}
                        </Typography>

                        {option.selections?.map((selection) => (
                          <FormControlLabel
                            key={selection.id}
                            label={
                              <ListItemText
                                primary={selection.name}
                                secondary={`+$${selection.price?.toFixed(
                                  2
                                )} ${selectedVariant.currency?.toUpperCase()}`}
                              />
                            }
                            control={<Checkbox color='info' />}
                            onChange={(e) => {
                              
                            }}
                          />
                        ))}
                      </Box>
                    )) */}
                </>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant='h6' sx={{ mb: 0 }}>
                    ${finalPrice.toFixed(2)} {currency.toUpperCase()}
                  </Typography>

                  <Box sx={{ display: 'flex' }}>
                    {discount && (
                      <Typography variant='body2' color='red'>
                        {discount.amountType === 'fixed'
                          ? `$${discount.amount.toFixed(2)} off`
                          : `${discount.amount}% off`}
                      </Typography>
                    )}

                    {price !== finalPrice && (
                      <Typography variant='body2' sx={{ ml: 1 }} color='GrayText'>
                        Was ${price.toFixed(2)}
                      </Typography>
                    )}
                  </Box>

                  {product?.url?.affiliate && (
                    <Typography variant='body2'>Sold on {product.url.affiliate.name}</Typography>
                  )}
                </Box>

                <Button
                  variant='contained'
                  onClick={() => {
                    /* TODO */
                  }}
                >
                  Buy Now
                </Button>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box>
                {Boolean(selectedVariant?.excerpt) && (
                  <Typography sx={{ mb: 2 }}>{selectedVariant?.excerpt}</Typography>
                )}

                {Boolean(selectedVariant?.about || product?.about) && (
                  <>
                    <Typography variant='h6'>About this item</Typography>

                    <div dangerouslySetInnerHTML={{ __html: product?.about! }} />

                    <div dangerouslySetInnerHTML={{ __html: about! }} />
                  </>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </Section>
    </Box>
  );
};

export default Product;
