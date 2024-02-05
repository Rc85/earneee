'use client';
import { Avatar, Box, Button, Chip, Divider, Paper, Typography } from '@mui/material';
import Gallery from '../../../components/Gallery/Gallery';
import { ProductVariantsInterface, ProductsInterface } from '../../../../_shared/types';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface Props {
  product: ProductsInterface;
}

const Main = ({ product }: Props) => {
  const searchParams = useSearchParams();
  const variantId = searchParams.get('variant');
  const [selectedVariant, setSelectVariant] = useState<ProductVariantsInterface | undefined>(
    variantId ? product.variants?.find((variant) => variant.id === variantId) : product.variants?.[0]
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ flexGrow: 1 }}>
        <Gallery images={selectedVariant?.media || []} />

        <Divider sx={{ my: 1 }} />

        {product.description && (
          <div className='product-description' dangerouslySetInnerHTML={{ __html: product.description }} />
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
                    currency: 'CAD',
                    currencyDisplay: 'narrowSymbol'
                  }).format(variant.price)
                ) : (
                  <Chip size='small' color='error' label='Unavailable' />
                )}
              </Typography>
            </Box>
          </Paper>
        ))}

        {Boolean(product.affiliate && selectedVariant?.status === 'available') && (
          <Box>
            <Divider sx={{ my: 1 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography>Sold by</Typography>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {product.affiliate?.logo_url && (
                    <Avatar variant='square' src={product.affiliate.logo_url} />
                  )}

                  <Typography sx={{ ml: 1 }}>{product.affiliate?.name}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant='contained'
                  onClick={() =>
                    selectedVariant?.url ? window.open(selectedVariant.url, '_blank') : undefined
                  }
                >
                  Buy Now
                </Button>
              </Box>
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 1 }} />

        {selectedVariant?.description && (
          <div dangerouslySetInnerHTML={{ __html: selectedVariant.description }} />
        )}
      </Box>
    </Box>
  );
};

export default Main;
