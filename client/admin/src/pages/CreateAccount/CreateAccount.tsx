import { Box, Button, Container, Link, Paper, TextField, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FormEvent, useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Icon } from '@mdi/react';
import { mdiCheckCircle } from '@mdi/js';
import { Section } from '../../../../_shared/components';
import Recaptcha from 'react-google-recaptcha';
import { useCreateUser } from '../../../../_shared/api';
import { setIsLoading } from '../../../../_shared/redux/app';
import { useDispatch } from 'react-redux';
import { countries } from '../../../../../_shared';

const CreateAccount = () => {
  const theme = useTheme();
  const [status, setStatus] = useState('');
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    agreed: true,
    country: 'CA',
    key: ''
  });
  const { enqueueSnackbar } = useSnackbar();
  const recaptchaRef = useRef<Recaptcha>(null);
  const dispatch = useDispatch();

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

    recaptchaRef.current?.reset();
  };

  const createUser = useCreateUser(handleSuccess, handleError);

  const handleLoginNowClick = () => {
    navigate('/');
  };

  const handleCreateAccount = async (e?: FormEvent) => {
    e?.preventDefault();

    if (!form.email) {
      return enqueueSnackbar('Email required', { variant: 'error' });
    } else if (!form.password) {
      return enqueueSnackbar('Password required', { variant: 'error' });
    } else if (form.password.length < 8) {
      return enqueueSnackbar('Password must be 8 characters or more', { variant: 'error' });
    } else if (form.password !== form.confirmPassword) {
      return enqueueSnackbar('Passwords do not match', { variant: 'error' });
    }

    const key = await recaptchaRef.current?.executeAsync();

    if (key) {
      form.key = key;

      dispatch(setIsLoading(true));

      createUser.mutate(form);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      {status === 'Success' ? (
        <Container maxWidth='sm' disableGutters>
          <Paper
            variant='outlined'
            sx={{ p: 2, display: 'flex', alignItems: 'center', flexDirection: 'column' }}
          >
            <Icon path={mdiCheckCircle} size={5} color={theme.palette.success.main} />

            <Typography variant='h3'>Account created!</Typography>

            <Typography sx={{ textAlign: 'center', mb: 3 }}>
              A confirmation email as been sent. Please check your inbox and confirm your account.
            </Typography>

            <Button onClick={handleLoginNowClick}>Login now</Button>
          </Paper>
        </Container>
      ) : (
        <Section
          title='Create Account'
          position='center'
          variant='outlined'
          titleVariant='h3'
          maxWidth='sm'
          component='form'
          onSubmit={handleCreateAccount}
          sx={{ p: 2 }}
        >
          <TextField
            label='Email'
            type='email'
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <TextField
            label='Password'
            type='password'
            placeholder='Minimum 8 characters'
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <TextField
            label='Confirm Password'
            type='password'
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

          <Recaptcha ref={recaptchaRef} sitekey={import.meta.env.VITE_RECAPTCHA_KEY} size='invisible' />

          <Button variant='contained' type='submit' fullWidth sx={{ mb: 1 }}>
            Submit
          </Button>

          <Typography sx={{ textAlign: 'center' }}>
            Already have an account? <Link onClick={handleLoginNowClick}>Login now</Link>.
          </Typography>
        </Section>
      )}
    </Box>
  );
};

export default CreateAccount;
