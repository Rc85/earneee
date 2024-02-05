import { Box, Button, Checkbox, FormControlLabel, Link, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setIsLoading } from '../../../../_shared/redux/app';
import { useDispatch } from 'react-redux';
import { Section } from '../../../../_shared/components';
import { useLogin } from '../../../../_shared/api/users/mutations';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<{
    email: string;
    password: string;
    remember: boolean;
    application: 'admin' | 'marketplace';
  }>({ email: '', password: '', remember: false, application: 'admin' });
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const handleError = (err: any) => {
    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }
  };

  const login = useLogin(undefined, handleError);

  const handleCreateAccountClick = () => {
    navigate('/register');
  };

  const handleLogin = async (e?: FormEvent) => {
    e?.preventDefault();

    dispatch(setIsLoading(true));

    login.mutate(form);
  };

  const handleResetPasswordClick = () => {
    navigate('/reset-password');
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      <Section
        title='Login'
        titleVariant='h3'
        variant='outlined'
        sx={{ p: 2 }}
        onSubmit={handleLogin}
        component='form'
        maxWidth='sm'
        position='center'
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <TextField
            label='Email'
            autoComplete='email'
            type='email'
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <TextField
            label='Password'
            type='password'
            autoComplete='current-password'
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormControlLabel
              label='Stay logged in'
              control={<Checkbox color='info' />}
              onChange={() => setForm({ ...form, remember: !form.remember })}
              checked={form.remember}
            />

            <Button color='inherit' sx={{ mb: 1, alignSelf: 'flex-end' }} onClick={handleResetPasswordClick}>
              Reset Password
            </Button>
          </Box>

          <Button variant='contained' type='submit' fullWidth sx={{ mb: 1 }}>
            Login
          </Button>

          <Typography sx={{ textAlign: 'center' }}>
            Don't have an account? <Link onClick={handleCreateAccountClick}>Create one</Link>.
          </Typography>
        </Box>
      </Section>
    </Box>
  );
};

export default Login;
