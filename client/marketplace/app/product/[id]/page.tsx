'use client';

import Section from '../../../../_shared/components/Section/Section';
import { Box, Breadcrumbs, Button, Chip, Divider, Paper, Typography } from '@mui/material';
import Link from 'next/link';
import {
  authenticate,
  retrieveCart,
  retrieveMarketplaceProduct,
  useAddProduct
} from '../../../../_shared/api';
import Grid2 from '@mui/material/Unstable_Grid2';
import { useState, Fragment, useEffect } from 'react';
import { Gallery, ProductConfigurator } from '../../../components';
import { useAppSelector } from '../../../../_shared/redux/store';
import { ProductsInterface } from '../../../../../_shared/types';
import { grey } from '@mui/material/colors';
import Icon from '@mdi/react';
import { mdiCartPlus, mdiImageOff, mdiOpenInNew } from '@mdi/js';
import dayjs from 'dayjs';
import Loading from './loading';
import { useSnackbar } from 'notistack';

const Product = ({ params: { id } }: { params: { id: string } }) => {
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
  const details = selectedVariant?.details || product?.details;
  const description = selectedVariant?.description || product?.description;
  const specifications: { name: string; value: string[] }[] = [];

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
      {isLoading ? (
        <Loading />
      ) : (
        <>
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
            title={`${product?.brand?.name ? `${product?.brand?.name} ` : ''}${product?.name}`}
            subtitle={excerpt}
            titleVariant='h3'
            maxWidth='xl'
            disableGutters
          >
            <Box sx={{ display: 'flex' }}>
              <Box sx={{ flexGrow: 1 }}>
                <Gallery media={media} />

                {Boolean(product?.review) && (
                  <Box sx={{ mb: 3 }}>
                    <Divider sx={{ mb: 1 }} />

                    <Typography variant='h6'>Our Review</Typography>

                    <div className='product-review' dangerouslySetInnerHTML={{ __html: product?.review! }} />
                  </Box>
                )}

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

              <Box sx={{ width: '35%', minWidth: '400px', maxWidth: '400px', ml: 2 }}>
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

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          {variant?.url ? (
                            <Typography variant='body2' color='GrayText'>
                              +${variant.url?.price.toFixed(2)}
                            </Typography>
                          ) : (
                            <Box />
                          )}

                          {variant.status === 'unavailable' && (
                            <Chip size='small' color='error' label='Unavailable' />
                          )}
                        </Box>
                      </Box>
                    </Paper>
                  );
                })}

                {product && <ProductActions product={product} selectedVariant={selectedVariant} />}

                {Boolean(product?.about || selectedVariant?.excerpt || selectedVariant?.about) && (
                  <Box>
                    <Divider sx={{ my: 2 }} />

                    {Boolean(selectedVariant?.excerpt) && (
                      <Typography sx={{ mb: 2 }}>{selectedVariant?.excerpt}</Typography>
                    )}

                    {Boolean(selectedVariant?.about || product?.about) && (
                      <>
                        <Typography variant='h6'>About this item</Typography>

                        <div dangerouslySetInnerHTML={{ __html: product?.about! }} />

                        <div dangerouslySetInnerHTML={{ __html: selectedVariant?.about! }} />
                      </>
                    )}
                  </Box>
                )}

                {specifications.length > 0 && (
                  <Box sx={{ my: 3 }}>
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
              </Box>
            </Box>
          </Section>
        </>
      )}
    </Box>
  );
};

interface Props {
  product: ProductsInterface;
  selectedVariant: ProductsInterface | undefined;
}

const ProductActions = ({ product, selectedVariant }: Props) => {
  const [status, setStatus] = useState('');
  const auth = authenticate('marketplace');
  const { user } = auth.data || {};
  const price = product.url?.price || 0;
  const currency = product.url?.currency || 'CAD';
  const discount = product.url?.discount;
  const unavailableVariants = product.variants?.filter((variant) => variant.status === 'unavailable') || [];
  const unavailable =
    (unavailableVariants.length > 0 && unavailableVariants.length === (product.variants?.length || 0)) ||
    product.status === 'unavailable';
  const { data } = retrieveCart({ userId: user?.id });
  const { order } = data || {};
  const { country } = useAppSelector((state) => state.App);
  const refundTimeChunks = product.url?.refundTime ? product.url.refundTime.split(' ') : [];
  const { enqueueSnackbar } = useSnackbar();

  if (refundTimeChunks.length && parseInt(refundTimeChunks[0]) > 1) {
    refundTimeChunks[1] = refundTimeChunks[1] + 's';
  }

  const handleSuccess = () => {
    setStatus('');
  };

  const handleError = (err: any) => {
    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }
  };

  const addProduct = useAddProduct(handleSuccess, handleError);

  let discountAmount = 0;

  if (discount) {
    if (discount.amountType === 'fixed') {
      discountAmount = discount.amount;
    } else if (discount.amountType === 'percentage') {
      discountAmount = price * (discount.amount / 100);
    }
  }

  const finalPrice = price - discountAmount;

  const handleBuyNowClick = () => {
    if (product?.url?.url) {
      window.open(product.url.url, '_blank', 'noopener, noreferrer');
    }
  };

  const handleAddToCartClick = () => {
    setStatus('Add Item');
  };

  const handleAddProduct = (product: ProductsInterface, quantity: string) => {
    if (product && order) {
      addProduct.mutate({ product, quantity: parseInt(quantity), orderId: order.id, country });
    }
  };

  return (
    <>
      {status === 'Add Item' && product && (
        <ProductConfigurator
          product={product}
          variant={selectedVariant}
          cancel={() => setStatus('')}
          submit={handleAddProduct}
        />
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {price !== finalPrice && (
              <Typography sx={{ mr: 1, fontWeight: 'bold', textDecoration: 'line-through' }}>
                ${price.toFixed(2)}
              </Typography>
            )}

            <Typography variant='h6' sx={{ mb: 0 }}>
              ${finalPrice.toFixed(2)} {currency.toUpperCase()}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex' }}>
            {discount && (
              <Typography variant='body2' sx={{ color: 'success.main', fontWeight: 500 }}>
                {discount.amountType === 'fixed'
                  ? `$${discount.amount.toFixed(2)} off`
                  : `${discount.amount}% off`}
              </Typography>
            )}

            {discount?.limitedTimeOnly ? (
              <Typography variant='body2' sx={{ ml: 1, fontWeight: 500, color: 'error.main' }}>
                Limited Time Only
              </Typography>
            ) : (
              discount?.startsAt &&
              discount?.endsAt && (
                <Typography variant='body2' sx={{ ml: 1, fontWeight: 500, color: 'error.main' }}>
                  {dayjs(discount?.startsAt).format('MMM DD')} - {dayjs(discount?.endsAt).format('MMM DD')}
                </Typography>
              )
            )}
          </Box>

          {product?.url?.affiliate && (
            <Typography variant='body2'>Sold on {product.url.affiliate.name}</Typography>
          )}
        </Box>

        {unavailable ? (
          <Chip size='small' color='error' label='Unavailable' />
        ) : product?.url?.type === 'affiliate' ? (
          <Button
            variant='contained'
            onClick={handleBuyNowClick}
            startIcon={<Icon path={mdiOpenInNew} size={1} />}
          >
            Buy Now
          </Button>
        ) : (
          <Button
            variant='contained'
            onClick={handleAddToCartClick}
            startIcon={<Icon path={mdiCartPlus} size={1} />}
            disabled={!Boolean(user)}
          >
            Add to Cart
          </Button>
        )}
      </Box>

      {product.url?.type !== 'affiliate' && (
        <>
          <Divider sx={{ my: 2 }} />

          <Typography variant='h6'>Shipping and Refund</Typography>

          <Box>
            <Typography variant='caption' color='GrayText'>
              {product.url?.shippingTime
                ? `\u2022 Please allow ${product.url.shippingTime} for shipping.`
                : `\u2022 Product will be shipped as soon as payment is received. Shipping time is currently unknown.`}
            </Typography>
          </Box>

          <Box>
            <Typography variant='caption' color='GrayText'>
              {product.url?.refundTime
                ? `\u2022 Eligible for refund within ${refundTimeChunks.join(' ')} of receipt.`
                : `\u2022 This product is not eligible for refund.`}
            </Typography>
          </Box>
        </>
      )}
    </>
  );
};

export default Product;
