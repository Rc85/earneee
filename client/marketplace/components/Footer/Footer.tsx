'use client';

import { Box, Container, Divider, Typography } from '@mui/material';
import { brandName } from '../../../_shared/constants';
import Icon from '@mdi/react';
import { mdiInstagram } from '@mdi/js';
import { retrieveStatuses } from '../../../_shared/api';
import Link from 'next/link';

const Footer = () => {
  const { data } = retrieveStatuses();
  const { statuses } = data || {};
  const loginStatus = statuses?.find((status) => status.name === 'login');
  const registrationStatus = statuses?.find((status) => status.name === 'registration');

  return (
    <Container maxWidth={false} sx={{ backgroundColor: 'black' }}>
      <Container maxWidth='xl'>
        <Box sx={{ display: 'flex' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              p: 2,
              width: '20%'
            }}
          >
            <Typography color='white' sx={{ fontWeight: 500, mb: 2 }}>
              Website
            </Typography>

            {registrationStatus?.online && (
              <Typography color='white' sx={{ mb: 2 }}>
                <Link href='/register'>Create Account</Link>
              </Typography>
            )}

            {loginStatus?.online && (
              <Typography color='white' sx={{ mb: 2 }}>
                <Link href='/login'>Login</Link>
              </Typography>
            )}

            <Typography color='white'>
              <Link href='/about'>About</Link>
            </Typography>
          </Box>

          {/* <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              p: 2,
              width: '20%'
            }}
          >
            <Typography color='white' sx={{ fontWeight: 500, mb: 2 }}>
              Partnership
            </Typography>

            <Typography color='white' sx={{ mb: 2 }}>
              Sell on {brandName}
            </Typography>

            <Typography color='white' sx={{ mb: 2 }}>
              Advertise on {brandName}
            </Typography> 

            <Typography color='white'>Affiliate With Us</Typography>
          </Box>*/}

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              p: 2,
              width: '20%'
            }}
          >
            <Typography color='white' sx={{ fontWeight: 500, mb: 2 }}>
              Support
            </Typography>

            {/* <Typography color='white' sx={{ mb: 2 }}>
              FAQ
            </Typography> */}

            <Typography color='white'>
              <Link href='/contact'>Contact Us</Link>
            </Typography>
          </Box>

          <Box sx={{ p: 2, width: '60%', display: 'flex', justifyContent: 'flex-end' }}>
            <Box>
              <Typography color='white' sx={{ fontWeight: 500, mb: 2 }}>
                Follow Us
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Link
                  href='https://www.instagram.com/official.earneee/'
                  target='_blank'
                  style={{ marginRight: '20px' }}
                >
                  <Icon path={mdiInstagram} size={1} />
                </Link>

                <Link href='https://x.com/OfficialEarneee' target='_blank'>
                  <img src='https://earneee.sfo3.cdn.digitaloceanspaces.com/images/x.jpg' />
                </Link>
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2 }}>
          <Typography color='white' variant='body2'>
            Copyright &copy; 2024 {brandName}.
          </Typography>

          <Box sx={{ display: 'flex' }}>
            <Typography color='white' sx={{ mr: 5 }}>
              <Link href='/tos'>Terms of Service</Link>
            </Typography>

            <Typography color='white'>
              <Link href='/privacy'>Privacy Policy</Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Container>
  );
};

export default Footer;
