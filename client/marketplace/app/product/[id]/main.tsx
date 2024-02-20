'use client';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
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
  const isAvailable = selectedVariant?.status === 'available';
  const mediaLink = selectedVariant?.urls?.[0]?.url;

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ flexGrow: 1 }}>
        <Gallery media={selectedVariant?.media || []} />

        <Divider sx={{ my: 1 }} />

        {product.description && (
          <div className='product-description' dangerouslySetInnerHTML={{ __html: product.description }} />
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

              <Typography variant='h6' sx={{ mb: 0, textAlign: 'right' }}>
                {variant.status === 'available' ? (
                  Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: variant.currency,
                    currencyDisplay: 'code'
                  }).format(variant.price)
                ) : (
                  <Chip size='small' color='error' label='Unavailable' />
                )}
              </Typography>
            </Box>
          </Paper>
        ))}

        {Boolean(isAvailable && mediaLink) && (
          <>
            {isAvailable && (
              <Box>
                <Divider sx={{ my: 1 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    {Boolean(product.affiliate) && (
                      <>
                        <Typography>Sold by</Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {product.affiliate?.logoUrl && (
                            <Avatar variant='square' src={product.affiliate.logoUrl} />
                          )}

                          <Typography sx={{ ml: 1 }}>{product.affiliate?.name}</Typography>
                        </Box>
                      </>
                    )}
                  </Box>

                  {Boolean(mediaLink) && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button variant='contained' onClick={() => window.open(mediaLink, '_blank')}>
                        Buy Now
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>
            )}

            <Divider sx={{ my: 1 }} />
          </>
        )}

        {selectedVariant?.description && (
          <div dangerouslySetInnerHTML={{ __html: selectedVariant?.description }} />
        )}

        {options.length > 0 &&
          options.map((option) => (
            <Box key={option.id}>
              <Typography variant='h6'>
                {option.name} {option.required && <Typography color='red'>Required</Typography>}
              </Typography>

              {option.selections?.map((selection) => (
                <Box key={selection.id}>
                  {product?.type === 'affiliate' ? (
                    <ListItemText
                      primary={selection.name}
                      secondary={`+${Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: selectedVariant?.currency,
                        currencyDisplay: 'code'
                      }).format(selection.price)}`}
                    />
                  ) : (
                    <FormControlLabel
                      label={
                        <ListItemText
                          primary={selection.name}
                          secondary={`+${Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: selectedVariant?.currency,
                            currencyDisplay: 'code'
                          }).format(selection.price)}`}
                        />
                      }
                      control={<Checkbox color='info' />}
                    />
                  )}
                </Box>
              ))}
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default Main;
