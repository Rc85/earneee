'use client';

import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Link,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography
} from '@mui/material';
import Gallery from '../../../components/Gallery/Gallery';
import { ProductVariantsInterface, ProductsInterface } from '../../../../../_shared/types';
import { Fragment, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

interface Props {
  product: ProductsInterface;
}

const Main = ({ product }: Props) => {
  const searchParams = useSearchParams();
  const variantId = searchParams.get('variant');
  const [selectedVariant, setSelectVariant] = useState<ProductVariantsInterface | undefined>(
    variantId ? product.variants?.find((variant) => variant.id === variantId) : product.variants?.[0]
  );
  const specifications = selectedVariant?.specifications || [];
  const options = selectedVariant?.options || [];
  const hasSpecifications = Boolean(specifications.length);

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ flexGrow: 1 }}>
        <Gallery media={selectedVariant?.media || []} />

        {Boolean(selectedVariant?.description) && (
          <>
            <Divider sx={{ my: 1 }} />

            <Typography variant='h6'>Description</Typography>

            {selectedVariant?.description && (
              <div
                className='product-description'
                dangerouslySetInnerHTML={{ __html: selectedVariant?.description }}
              />
            )}
          </>
        )}

        {Boolean(selectedVariant?.details) && (
          <>
            <Divider sx={{ my: 1 }} />

            <Typography variant='h6'>Details</Typography>

            {selectedVariant?.details && (
              <div
                className='product-description'
                dangerouslySetInnerHTML={{ __html: selectedVariant?.details }}
              />
            )}
          </>
        )}

        {hasSpecifications && (
          <>
            <Divider sx={{ my: 1 }} />

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
                    <div
                      style={{ margin: '16px' }}
                      dangerouslySetInnerHTML={{ __html: specification.value }}
                    />
                  </Grid2>
                </Fragment>
              ))}
            </Grid2>
          </>
        )}
      </Box>

      <Box sx={{ width: '25%', minWidth: '400px', maxWidth: '400px', ml: 2 }}>
        {product.variants?.map((variant) => (
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
                backgroundImage: variant.media?.[0]?.url ? `url('${variant.media[0].url}')` : undefined,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center center'
              }}
            />

            <Box sx={{ flexGrow: 1, p: 1 }}>
              <Typography>{variant.name}</Typography>
            </Box>
          </Paper>
        ))}

        {selectedVariant?.status === 'available' && (
          <>
            {selectedVariant.urls && selectedVariant.urls.length > 1 && (
              <List disablePadding>
                {selectedVariant.urls?.map((url) => (
                  <ListItem
                    disableGutters
                    divider
                    key={url.id}
                    sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}
                  >
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <img
                          src={`${
                            process.env.NEXT_PUBLIC_STORAGE_URL
                          }/images/countries/${url.country.toLowerCase()}.png`}
                        />

                        <Typography sx={{ fontWeight: 500, ml: 1 }}>
                          ${url.price.toFixed(2)} {url.currency.toUpperCase()}
                        </Typography>
                      </Box>

                      {product.type === 'dropship'
                        ? options.map((option) => (
                            <Box key={option.id}>
                              <Typography variant='h6'>
                                {option.name}{' '}
                                {option.required && <Typography color='red'>Required</Typography>}
                              </Typography>

                              {option.selections?.map((selection) => (
                                <Box key={selection.id}>
                                  {product?.type === 'affiliate' ? (
                                    <ListItemText
                                      primary={selection.name}
                                      secondary={`+$${url.price.toFixed(2)} ${url.currency.toUpperCase()}`}
                                    />
                                  ) : (
                                    <FormControlLabel
                                      label={
                                        <ListItemText
                                          primary={selection.name}
                                          secondary={`+$${url.price.toFixed(
                                            2
                                          )} ${url.currency.toUpperCase()}`}
                                        />
                                      }
                                      control={<Checkbox color='info' />}
                                    />
                                  )}
                                </Box>
                              ))}
                            </Box>
                          ))
                        : url.affiliate && (
                            <Typography>
                              Sold by{' '}
                              {Boolean(url.affiliate.url) ? (
                                <Link href={url.affiliate.url!} target='_blank'>
                                  {url.affiliate.name}
                                </Link>
                              ) : (
                                url.affiliate.name
                              )}
                            </Typography>
                          )}
                    </Box>

                    <Button variant='contained' onClick={() => window.open(url.url, '_blank')}>
                      Buy Now
                    </Button>
                  </ListItem>
                ))}
              </List>
            )}
          </>
        )}

        {Boolean(selectedVariant?.about) && (
          <>
            <Typography variant='h6'>About this item</Typography>

            <div dangerouslySetInnerHTML={{ __html: selectedVariant?.about! }} />
          </>
        )}
      </Box>
    </Box>
  );
};

export default Main;
