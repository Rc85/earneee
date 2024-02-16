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
import { FormEvent, useRef, useState } from 'react';
import { retrieveStatuses, useCreateUser } from '../../../_shared/api';
import { useSnackbar } from 'notistack';
import Recaptcha from 'react-google-recaptcha';
import { countries } from '../../../../_shared';
import { Loading } from '../../../_shared/components';

const Register = () => {
  const [status, setStatus] = useState('');
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    agreed: false,
    country: 'CA',
    key: ''
  });
  const [error, setError] = useState('');
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const recaptchaRef = useRef<Recaptcha>(null);
  const { isLoading, data } = retrieveStatuses();
  const { statuses } = data || {};
  const registrationStatus = statuses?.find((status) => status.name === 'registration');

  const handleSuccess = () => {
    setStatus('Success');
  };

  const handleError = (err: any) => {
    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }

    setStatus('');
  };

  const createUser = useCreateUser(handleSuccess, handleError);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.email) {
      return setError('Email required');
    } else if (!form.password) {
      return setError('Password required');
    } else if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match');
    } else if (form.password.length < 8) {
      return setError('Password is too short');
    } else if (!form.agreed) {
      return setError('You must read and agree with our terms and policy');
    }

    setStatus('Loading');

    const key = await recaptchaRef.current?.executeAsync();

    if (key) {
      form.key = key;

      createUser.mutate(form);
    }
  };

  const handleOnClose = (_: any, reason: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setError('');
  };

  return isLoading ? (
    <Loading />
  ) : !registrationStatus?.online ? (
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
      <Typography variant='h3'>Disabled</Typography>

      <Typography>Registration is currently disabled. Please check back later.</Typography>
    </Container>
  ) : (
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
              required
            />

            <TextField
              type='password'
              label='Password'
              placeholder='At least 8 characters'
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            <TextField
              type='password'
              label='Confirm Password'
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              required
            />

            <TextField
              label='Country'
              required
              select
              SelectProps={{ native: true }}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              value={form.country}
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </TextField>

            <FormControlLabel
              label='I have read and agree to the Terms of Service and Privacy Policy'
              control={<Checkbox color='info' />}
              onChange={() => setForm({ ...form, agreed: !form.agreed })}
              checked={form.agreed}
            />

            <Recaptcha ref={recaptchaRef} sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY!} size='invisible' />

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
