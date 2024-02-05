'use client';

import { mdiCheckCircle, mdiCloseCircle } from '@mdi/js';
import Icon from '@mdi/react';
import { Box, Container, Link, Paper, Typography, useTheme } from '@mui/material';
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
            <Typography variant='h3'>Unauthorized</Typography>

            <Icon path={mdiCloseCircle} size={5} color={theme.palette.error.main} />

            <Typography sx={{ textAlign: 'center' }}>{errorDescription}</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant='h3'>Email confirmed!</Typography>

            <Icon path={mdiCheckCircle} size={5} color={theme.palette.success.main} />

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
