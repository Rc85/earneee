'use client';

import { mdiCheckCircle, mdiPlusBox } from '@mdi/js';
import Icon from '@mdi/react';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  Paper,
  Snackbar,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { FormEvent, useState } from 'react';
import { createClient } from '../../utils/supabase/client';

const Register = () => {
  const [status, setStatus] = useState('');
  const [form, setForm] = useState({ email: '', password: '', confirm: '', agreed: false });
  const [error, setError] = useState('');
  const supabase = createClient();
  const theme = useTheme();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.email) {
      return setError('Email required');
    } else if (!form.password) {
      return setError('Password required');
    } else if (form.password !== form.confirm) {
      return setError('Passwords do not match');
    } else if (form.password.length < 8) {
      return setError('Password is too short');
    } else if (!form.agreed) {
      return setError('You must read and agree with our terms and policy');
    }

    setStatus('Loading');

    const response = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/register/success` }
    });

    if (response.error) {
      setStatus('');

      return setError(response.error.message);
    }

    setStatus('Success');
  };

  const handleOnClose = (_: any, reason: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setError('');
  };

  return (
    <Container maxWidth='sm'>
      <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={handleOnClose}>
        <Alert severity='error' variant='filled'>
          {error}
        </Alert>
      </Snackbar>

      <Paper variant='outlined' sx={{ p: 2 }}>
        {status === 'Success' ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant='h3'>Account created!</Typography>

            <Icon path={mdiCheckCircle} size={5} color={theme.palette.success.main} />

            <Typography sx={{ textAlign: 'center' }}>
              Check your email's inbox for a confirmation email to confirm your account.
            </Typography>
          </Box>
        ) : (
          <Box component='form' onSubmit={handleSubmit}>
            <Typography variant='h3'>Create Account</Typography>

            <TextField
              type='email'
              label='Email'
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <TextField
              type='password'
              label='Password'
              placeholder='At least 8 characters'
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <TextField
              type='password'
              label='Confirm Password'
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            />

            <FormControlLabel
              label='I have read and agree to the Terms of Service and Privacy Policy'
              control={<Checkbox color='info' />}
              onChange={() => setForm({ ...form, agreed: !form.agreed })}
              checked={form.agreed}
            />

            <LoadingButton
              type='submit'
              variant='contained'
              fullWidth
              loading={status === 'Loading'}
              loadingIndicator={<CircularProgress size={20} />}
              loadingPosition='start'
              startIcon={<Icon path={mdiPlusBox} size={1} />}
            >
              Submit
            </LoadingButton>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Register;
