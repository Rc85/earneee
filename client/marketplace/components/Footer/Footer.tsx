'use client';

import { Box, Button, Container, Divider, Link, TextField, Typography, useTheme } from '@mui/material';
import { brandName } from '../../../_shared/constants';
import Icon from '@mdi/react';
import { mdiFacebook, mdiInstagram, mdiSend, mdiTwitter } from '@mdi/js';

const Footer = () => {
  const theme = useTheme();

  return (
    <Container maxWidth='xl'>
      <Box
        sx={{
          borderRadius: '5px',
          backgroundImage: `linear-gradient(270deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
          width: '100%',
          p: 5,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <img
          src={`${process.env.NEXT_PUBLIC_STORAGE_URL}images/subscribe.png`}
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
            Upon subscribing, you agree to us sending you emails regarding news and updates. You may
            unsubscribe anytime.
          </Typography>
        </Box>
      </Box>

      <Box maxWidth='xl' sx={{ display: 'flex' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            p: 2,
            width: '20%'
          }}
        >
          <Typography sx={{ fontWeight: 500, mb: 2 }}>Website</Typography>

          <Typography sx={{ mb: 2 }}>Create Account</Typography>

          <Typography sx={{ mb: 2 }}>Login</Typography>

          <Typography>About</Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            p: 2,
            width: '20%'
          }}
        >
          <Typography sx={{ fontWeight: 500, mb: 2 }}>Partnership</Typography>

          <Typography sx={{ mb: 2 }}>Sell on {brandName}</Typography>

          <Typography sx={{ mb: 2 }}>Advertise on {brandName}</Typography>

          <Typography>Affiliate With Us</Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            p: 2,
            width: '20%'
          }}
        >
          <Typography sx={{ fontWeight: 500, mb: 2 }}>Support</Typography>

          <Typography sx={{ mb: 2 }}>FAQ</Typography>

          <Typography>Contact Us</Typography>
        </Box>

        <Box sx={{ p: 2, width: '40%', display: 'flex', justifyContent: 'flex-end' }}>
          <Box>
            <Typography sx={{ fontWeight: 500, mb: 2 }}>Follow Us</Typography>

            <Box sx={{ display: 'flex' }}>
              <Link href='https://facebook.com' sx={{ mr: 4 }}>
                <Icon path={mdiFacebook} size={1} color='#1877F2' />
              </Link>

              <Link href='https://twitter.com' sx={{ mr: 4 }}>
                <Icon path={mdiTwitter} size={1} color='#1DA1F2' />
              </Link>

              <Link href='https://instagram.com'>
                <Icon path={mdiInstagram} size={1} />
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2 }}>
        <Typography variant='body2'>Copyright &copy; 2004 {brandName}. All rights reserved.</Typography>

        <Box sx={{ display: 'flex' }}>
          <Typography sx={{ mr: 5 }}>Terms of Service</Typography>

          <Typography>Privacy Policy</Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Footer;
