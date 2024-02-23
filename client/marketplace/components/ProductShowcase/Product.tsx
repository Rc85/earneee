'use client';

import { useRouter } from 'next/navigation';
import { ProductVariantsInterface } from '../../../../_shared/types';
import { Paper, Box, Typography, Divider } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

interface Props {
  variant: ProductVariantsInterface;
  isLast: boolean;
}

const Product = ({ variant, isLast }: Props) => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<any>(null);

  useEffect(() => {
    if (containerRef.current) {
      setLoaded(true);
    }
  }, [containerRef.current]);

  const handleProductClick = (url: string) => {
    router.push(url);
  };

  return (
    <Paper
      key={variant.id}
      variant='outlined'
      sx={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        mr: !isLast ? 1 : 0,
        width: '400px',
        flexShrink: 0
      }}
      className='product-card'
    >
      <Box onClick={() => handleProductClick(`/product/${variant.product?.id}?variant=${variant.id}`)}>
        <Box
          ref={containerRef}
          sx={{
            borderTopRightRadius: 4,
            borderTopLeftRadius: 4,
            backgroundImage: loaded && variant.media?.[0]?.url ? `url('${variant.media[0].url}')` : undefined,
            backgroundSize:
              (variant.media?.[0]?.width || 0) / (variant.media?.[0]?.height || 0) > 1.5
                ? 'cover'
                : 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center top',
            height: '200px'
          }}
        />

        <Box sx={{ p: 2, flexGrow: 1 }}>
          <Typography variant='h6' sx={{ mb: 0 }}>
            {variant.product?.name}
          </Typography>

          <Typography>{variant.name}</Typography>

          {Boolean(variant.product?.excerpt) && (
            <>
              <Divider sx={{ my: 1 }} />

              <Typography>{variant.product?.excerpt}</Typography>
            </>
          )}
        </Box>

        <Divider />

        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Typography variant='h6' sx={{ mb: 0 }}>
            {Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: variant.currency
            }).format(variant.price)}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default Product;
