'use client';

import { ProductVariantsInterface } from '../../../../_shared/types';
import { Paper, Box, Typography, Divider, Button } from '@mui/material';

interface Props {
  variant: ProductVariantsInterface;
  isLast: boolean;
}

const Product = ({ variant, isLast }: Props) => {
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
      <Box component='a' href={`/product/${variant.product?.id}?variant=${variant.id}`}>
        <Box
          sx={{
            borderTopRightRadius: 4,
            borderTopLeftRadius: 4,
            backgroundImage: variant.media?.[0]?.url ? `url('${variant.media[0].url}')` : undefined,
            backgroundSize: 'cover',
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

          <Divider sx={{ my: 1 }} />

          <Typography>{variant.product?.excerpt}</Typography>
        </Box>

        <Divider />

        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant='h6' sx={{ mb: 0 }}>
            {Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'CAD',
              currencyDisplay: 'narrowSymbol'
            }).format(variant.price)}
          </Typography>

          <Button>Buy Now</Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default Product;
