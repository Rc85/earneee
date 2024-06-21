'use client';

import { mdiArrowUpDropCircle, mdiCheckCircleOutline, mdiEye, mdiEyeOff } from '@mdi/js';
import Icon from '@mdi/react';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { FormEvent, useState } from 'react';
import { useUpdatePassword } from '../../../../_shared/api';
import Link from 'next/link';

interface Props {
  params: { token: string };
}

const page = ({ params: { token } }: Props) => {
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [status, setStatus] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  const handleSuccess = (response: any) => {
    if (response.data.statusText) {
      enqueueSnackbar(response.data.statusText, { variant: 'success' });
    }

    setStatus('Success');
  };

  const handleError = (err: any) => {
    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }

    setStatus('');
  };

  const updatePassword = useUpdatePassword(handleSuccess, handleError);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return enqueueSnackbar('Passwords do not match', { variant: 'error' });
    } else if (form.password.length < 8) {
      return enqueueSnackbar('Password must be 8 characters or more', { variant: 'error' });
    }

    if (token) {
      setStatus('Loading');

      updatePassword.mutate({ ...form, token });
    }
  };

  return (
    <Container maxWidth='sm'>
      <Paper variant='outlined' sx={{ p: 2 }} component='form' onSubmit={handleSubmit}>
        {status === 'Success' ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Icon path={mdiCheckCircleOutline} size={3} color={theme.palette.success.main} />

            <Typography variant='h3' sx={{ textAlign: 'center' }}>
              Success
            </Typography>

            <Typography sx={{ mb: 3, textAlign: 'center' }}>Your password has been changed.</Typography>

            <Link href='/login'>
              <Typography sx={{ textAlign: 'center' }}>Login now</Typography>
            </Link>
          </Box>
        ) : (
          <>
            <Typography variant='h3'>Update Password</Typography>

            <TextField
              type={showPassword ? 'text' : 'password'}
              label='New Password'
              autoFocus
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <TextField
              type={showPassword ? 'text' : 'password'}
              label='Confirm Password'
              required
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1.25 }}>
              <Button
                color='inherit'
                startIcon={<Icon path={showPassword ? mdiEyeOff : mdiEye} size={1} />}
                onClick={() => setShowPassword(!showPassword)}
              >
                Show Password
              </Button>
            </Box>

            <LoadingButton
              type='submit'
              variant='contained'
              loading={status === 'Loading'}
              loadingIndicator={<CircularProgress size={20} />}
              loadingPosition='start'
              startIcon={<Icon path={mdiArrowUpDropCircle} size={1} />}
              fullWidth
              disabled={Boolean(!form.password && !form.confirmPassword)}
            >
              Submit
            </LoadingButton>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default page;
