'use client';

import { mdiCheckCircleOutline, mdiCloseCircleOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { Box, Container, Paper, Typography, useTheme } from '@mui/material';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const Register = () => {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  return (
    <Container maxWidth='sm'>
      <Paper variant='outlined' sx={{ p: 2 }}>
        {error ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Icon path={mdiCloseCircleOutline} size={3} color={theme.palette.error.main} />

            <Typography variant='h3'>Unauthorized</Typography>

            <Typography sx={{ textAlign: 'center' }}>{errorDescription}</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Icon path={mdiCheckCircleOutline} size={3} color={theme.palette.success.main} />

            <Typography variant='h3'>Email confirmed!</Typography>

            <Typography sx={{ textAlign: 'center' }}>
              You can now <Link href='/login'>login</Link> to your account.
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Register;
