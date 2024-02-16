'use client';

import { mdiSend } from '@mdi/js';
import Icon from '@mdi/react';
import { Box, Typography, TextField, Button, useTheme } from '@mui/material';

const Subscribe = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        borderRadius: '5px',
        backgroundImage: `linear-gradient(270deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
        width: '100%',
        p: 5,
        display: 'flex',
        alignItems: 'center',
        mb: 3
      }}
    >
      <img
        src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/images/subscribe.png`}
        style={{ width: 300, maxWidth: '100%' }}
      />

      <Box sx={{ pl: 10 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant='h4' color='white'>
            Subscribe to our newsletter to get updates on trending products, latest discounts, and more.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex' }}>
          <TextField label='Email' required color='info' sx={{ mr: 1, mb: '0px !important' }} />

          <Button color='info' variant='contained' startIcon={<Icon path={mdiSend} size={1} />}>
            Subscribe
          </Button>
        </Box>

        <Typography variant='caption' color='GrayText'>
          Upon subscribing, you agree to us sending you emails regarding news and updates. You may unsubscribe
          anytime.
        </Typography>
      </Box>
    </Box>
  );
};

export default Subscribe;
