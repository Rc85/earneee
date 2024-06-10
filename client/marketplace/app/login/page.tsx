'use client';

import { mdiLoginVariant } from '@mdi/js';
import Icon from '@mdi/react';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Checkbox,
  CircularProgress,
  Container,
  Divider,
  FormControlLabel,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { useLogin } from '../../../_shared/api';
import Link from 'next/link';
import { StatusesInterface } from '../../../../_shared/types';
import Loading from './loading';

export default function Login() {
  const [status, setStatus] = useState('Loading');
  const [online, setOnline] = useState(false);
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
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    (async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/v1/statuses`, {
        next: { revalidate: 5 }
      });
      const data = await res.json();
      const { statuses }: { statuses: StatusesInterface[] } = data;
      const online = statuses?.find((status) => status.name === 'login')?.online;

      setOnline(Boolean(online));
      setStatus('');
    })();
  }, []);

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
      return enqueueSnackbar('Email required', { variant: 'error' });
    } else if (!form.password) {
      return enqueueSnackbar('Password required', { variant: 'error' });
    }

    setStatus('Loading');

    login.mutate(form);
  };

  return status === 'Loading' ? (
    <Loading />
  ) : !online ? (
    <Container
      maxWidth='md'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1
      }}
    >
      <Typography variant='h3'>Offline</Typography>

      <Typography>The login server is currently offline. Please check back later.</Typography>
    </Container>
  ) : (
    <Container maxWidth='sm'>
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

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <FormControlLabel
              label='Remember me'
              control={<Checkbox color='info' />}
              onChange={() => setForm({ ...form, remember: !form.remember })}
            />

            <Typography variant='button'>
              <Link color='error' href='/reset-password'>
                Reset Password
              </Link>
            </Typography>
          </Box>

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
