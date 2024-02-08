'use client';

import { mdiFacebook, mdiLoginVariant, mdiTwitter } from '@mdi/js';
import Icon from '@mdi/react';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  Divider,
  FormControlLabel,
  Link,
  Paper,
  Snackbar,
  TextField,
  Typography
} from '@mui/material';
import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { useLogin } from '../../../_shared/api';

export default function Login() {
  const [status, setStatus] = useState('');
  const [form, setForm] = useState<{
    email: string;
    password: string;
    remember: boolean;
    application: 'admin' | 'marketplace';
  }>({
    email: '',
    password: '',
    remember: false,
    application: 'marketplace'
  });
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const handleSuccess = () => {
    router.push(redirect || '/');
  };

  const handleError = (err: any) => {
    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }

    setStatus('');
  };

  const login = useLogin(handleSuccess, handleError);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();

    if (!form.email) {
      return setError('Email required');
    } else if (!form.password) {
      return setError('Password required');
    }

    setStatus('Loading');

    login.mutate(form);
  };

  const handleSnackbarClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setError('');
  };

  return (
    <Container maxWidth='sm'>
      <Snackbar open={Boolean(error)} onClose={handleSnackbarClose} autoHideDuration={6000}>
        <Alert severity='error' variant='filled'>
          {error}
        </Alert>
      </Snackbar>

      <Paper variant='outlined' sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <Typography variant='h3'>Login</Typography>

        {/* <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            mb: 3
          }}
        >
          <Divider sx={{ width: '100%' }} />

          <Typography
            variant='caption'
            color='GrayText'
            sx={{ position: 'absolute', backgroundColor: 'white', px: 2 }}
          >
            With socials
          </Typography>
        </Box>

        <Button
          variant='outlined'
          color='inherit'
          startIcon={
            <img src={`${process.env.NEXT_PUBLIC_STORAGE_URL}images/google.png`} style={{ width: '20px' }} />
          }
          sx={{ mb: 1 }}
        >
          Google
        </Button>

        <Button
          variant='outlined'
          color='inherit'
          startIcon={<Icon path={mdiFacebook} size={1} color='#1877F2' />}
          sx={{ mb: 1 }}
        >
          Facebook
        </Button>

        <Button
          variant='outlined'
          color='inherit'
          startIcon={<Icon path={mdiTwitter} size={1} color='#1DA1F2' />}
        >
          Twitter
        </Button> */}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            my: 3
          }}
        >
          <Divider sx={{ width: '100%' }} />

          <Typography
            variant='caption'
            color='GrayText'
            sx={{ position: 'absolute', backgroundColor: 'white', px: 2 }}
          >
            With email
          </Typography>
        </Box>

        <Box component='form' onSubmit={handleLogin}>
          <TextField
            type='email'
            label='Email'
            required
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <TextField
            type='password'
            label='Password'
            required
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <FormControlLabel
            label='Remember me'
            control={<Checkbox color='info' />}
            onChange={() => setForm({ ...form, remember: !form.remember })}
          />

          <LoadingButton
            type='submit'
            variant='contained'
            fullWidth
            loading={status === 'Loading'}
            loadingIndicator={<CircularProgress size={20} />}
            loadingPosition='start'
            startIcon={<Icon path={mdiLoginVariant} size={1} />}
          >
            Login
          </LoadingButton>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant='body2' sx={{ textAlign: 'center' }}>
          Don't have an account? <Link href='/register'>Create one</Link>.
        </Typography>
      </Paper>
    </Container>
  );
}
