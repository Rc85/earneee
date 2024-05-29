'use client';

import Section from '../../../../_shared/components/Section/Section';
import {
  Box,
  Breadcrumbs,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  ListItemText,
  Paper,
  Typography
} from '@mui/material';
import Link from 'next/link';
import { ProductVariantsInterface } from '../../../../../_shared/types';
import { Loading } from '../../../../_shared/components';
import { retrieveMarketplaceProduct } from '../../../../_shared/api';
import Grid2 from '@mui/material/Unstable_Grid2';
import { useState, Fragment, useEffect } from 'react';
import { Gallery } from '../../../components';
import { useSearchParams } from 'next/navigation';
import { useAppSelector } from '../../../../_shared/redux/store';

interface Props {
  params: { id: string };
}

const Product = ({ params: { id } }: Props) => {
  const searchParams = useSearchParams();
  const variantId = searchParams.get('variant');
  const { country } = useAppSelector((state) => state.App);
  const { isLoading, data } = retrieveMarketplaceProduct({ productId: id, country });
  const product = data?.product;
  const [selectedVariant, setSelectVariant] = useState<ProductVariantsInterface | undefined>(
    variantId ? product?.variants?.find((variant) => variant.id === variantId) : product?.variants?.[0]
  );
  const selectedVariantSpecifications = selectedVariant?.specifications || [];
  const productSpecifications = product?.specifications || [];
  const allSpecifications = [...selectedVariantSpecifications, ...productSpecifications];
  const options = selectedVariant?.options || [];
  const selectedVariantMedia = selectedVariant?.media || [];
  const productMedia = product?.media || [];
  const media = [...selectedVariantMedia, ...productMedia];
  const excerpt = selectedVariant?.excerpt || product?.excerpt || '';
  const about = selectedVariant?.about || product?.about;
  const details = selectedVariant?.details || product?.details;
  const description = selectedVariant?.description || product?.description;
  const specifications: { name: string; value: string[] }[] = [];

  for (const specification of allSpecifications) {
    const index = specifications.findIndex((s) => s.name === specification.name);

    if (index >= 0) {
      specifications[index].value.push(specification.value);
    } else {
      specifications.push({ name: specification.name, value: [specification.value] });
    }
  }

  useEffect(() => {
    if (variantId) {
      setSelectVariant(product?.variants?.find((variant) => variant.id === variantId));
    } else {
      setSelectVariant(product?.variants?.[0]);
    }
  }, [product]);

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
                const media = variant.media?.[0] || product?.media?.[0];
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
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center center'
                      }}
                    />

                    <Box sx={{ flexGrow: 1, p: 1 }}>
                      <Typography>{variant.name}</Typography>
                    </Box>
                  </Paper>
                );
              })}

              {selectedVariant?.status === 'available' && selectedVariant.price != null && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <img
                        src={`${
                          process.env.NEXT_PUBLIC_STORAGE_URL
                        }/images/countries/${selectedVariant.country?.toLowerCase()}.png`}
                      />

                      <Typography sx={{ fontWeight: 500, ml: 1 }}>
                        ${selectedVariant.price.toFixed(2)} {selectedVariant.currency?.toUpperCase()}
                      </Typography>
                    </Box>

                    {selectedVariant.type === 'dropship'
                      ? options.map((option) => (
                          <Box key={option.id}>
                            <Typography variant='h6'>
                              {option.name} {option.required && <Typography color='red'>Required</Typography>}
                            </Typography>

                            {option.selections?.map((selection) => (
                              <Box key={selection.id}>
                                {selectedVariant.type === 'affiliate' ? (
                                  <ListItemText
                                    primary={selection.name}
                                    secondary={`+$${selectedVariant.price?.toFixed(
                                      2
                                    )} ${selectedVariant.currency?.toUpperCase()}`}
                                  />
                                ) : (
                                  <FormControlLabel
                                    label={
                                      <ListItemText
                                        primary={selection.name}
                                        secondary={`+$${selection.price?.toFixed(
                                          2
                                        )} ${selectedVariant.currency?.toUpperCase()}`}
                                      />
                                    }
                                    control={<Checkbox color='info' />}
                                  />
                                )}
                              </Box>
                            ))}
                          </Box>
                        ))
                      : selectedVariant.affiliate && (
                          <Typography>
                            Sold on{' '}
                            {Boolean(selectedVariant.affiliate.url) ? (
                              <Link href={selectedVariant.affiliate.url!} target='_blank'>
                                {selectedVariant.affiliate.name}
                              </Link>
                            ) : (
                              selectedVariant.affiliate.name
                            )}
                          </Typography>
                        )}
                  </Box>

                  {selectedVariant.url && (
                    <Button variant='contained' onClick={() => window.open(selectedVariant.url!, '_blank')}>
                      Buy Now
                    </Button>
                  )}
                </Box>
              )}

              <Box sx={{ mt: 3 }}>
                {Boolean(excerpt) && <Typography>{excerpt}</Typography>}

                {Boolean(about) && (
                  <>
                    <Typography variant='h6'>About this item</Typography>

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
