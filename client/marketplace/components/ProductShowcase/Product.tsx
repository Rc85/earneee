'use client';

import { useRouter } from 'next/navigation';
import { ProductVariantsInterface } from '../../../../_shared/types';
import { Paper, Box, Typography, Divider } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../../_shared/redux/store';

interface Props {
  variant: ProductVariantsInterface;
  isLast: boolean;
}

const Product = ({ variant, isLast }: Props) => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<any>(null);
  const { country } = useAppSelector((state) => state.App);
  const urls = variant.urls && variant.urls.length > 0 ? variant.urls : variant.product?.urls || [];
  const countryCode = country || 'ca';
  const url = urls.find((url) => url.country.toLowerCase() === countryCode.toLowerCase()) || urls[0];
  const media = variant.media?.[0] || variant.product?.media?.[0];
  const mediaUrl = media?.url;

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
            backgroundImage: loaded && mediaUrl ? `url('${mediaUrl}')` : undefined,
            backgroundSize: (media?.width || 0) / (media?.height || 0) > 1.5 ? 'cover' : 'contain',
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

          {Boolean(variant.excerpt || variant.product?.excerpt) && (
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
                {variant.excerpt || variant.product?.excerpt}
              </Typography>
            </>
          )}
        </Box>

        <Divider />

        {url && (
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Typography variant='h6' sx={{ mb: 0 }}>
              ${url.price.toFixed(2)} {url.currency.toUpperCase()}
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default Product;
