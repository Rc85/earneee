'use client';

import Section from '../../../_shared/components/Section/Section';
import { Box, Divider, Paper, Typography } from '@mui/material';
import { retrieveProductVariants } from '../../../_shared/api';
import { useState, useRef, useEffect } from 'react';
import { useAppSelector } from '../../../_shared/redux/store';
import { useRouter } from 'next/navigation';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

interface Props {
  categoryId?: number;
  subcategoryId?: number;
  groupId?: number;
  type: 'new' | 'popular';
}

const ProductShowcase = ({ categoryId, subcategoryId, groupId, type }: Props) => {
  const { country } = useAppSelector((state) => state.App);
  const { data } = retrieveProductVariants({ type, categoryId, subcategoryId, groupId, country });
  const { variants } = data || {};
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

  return variants && variants.length > 0 ? (
    <Section
      title={type === 'new' ? 'RECENTLY ADDED' : 'POPULAR PRODUCTS'}
      titleVariant='h4'
      containerStyle={{ mb: 3 }}
    >
      <Grid2 container spacing={1}>
        {variants?.map((variant, i) => (
          <Grid2 key={variant.id} xs={12} sm={4}>
            <Paper
              variant='outlined'
              sx={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0
              }}
              className='product-card'
            >
              <Box
                onClick={() => handleProductClick(`/product/${variant.product?.id}?variant=${variant.id}`)}
              >
                <Box
                  ref={containerRef}
                  sx={{
                    borderTopRightRadius: 4,
                    borderTopLeftRadius: 4,
                    backgroundImage:
                      loaded && variant.media?.[0]?.url ? `url('${variant.media[0].url}')` : undefined,
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

                {variant.price != null && (
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Typography variant='h6' sx={{ mb: 0 }}>
                      ${variant.price.toFixed(2)} {variant.currency?.toUpperCase()}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid2>
        ))}
      </Grid2>
    </Section>
  ) : null;
};

export default ProductShowcase;
