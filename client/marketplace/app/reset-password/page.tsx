'use client';

import { mdiArrowUpDropCircle, mdiCheckCircleOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { LoadingButton } from '@mui/lab';
import { Box, CircularProgress, Container, Paper, TextField, Typography, useTheme } from '@mui/material';
import { useSnackbar } from 'notistack';
import { FormEvent, useRef, useState } from 'react';
import Recaptcha from 'react-google-recaptcha';
import { useResetPassword } from '../../../_shared/api';

const ResetPassword = () => {
  const recaptchaRef = useRef<Recaptcha>(null);
  const [status, setStatus] = useState('');
  const [email, setEmail] = useState('');
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

  const resetPassword = useResetPassword(handleSuccess, handleError);

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();

    if (email) {
      setStatus('Loading');

      resetPassword.mutate({ email });
    }
  };

  return (
    <Container maxWidth='sm'>
      <Paper
        variant='outlined'
        sx={{ p: 2, display: 'flex', flexDirection: 'column' }}
        component='form'
        onSubmit={handleSubmit}
      >
        {status === 'Success' ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center ' }}>
            <Icon path={mdiCheckCircleOutline} size={3} color={theme.palette.success.main} />

            <Typography variant='h3' sx={{ textAlign: 'center' }}>
              Success
            </Typography>

            <Typography sx={{ mb: 3, textAlign: 'center' }}>
              Check your email for a link to reset your password
            </Typography>
          </Box>
        ) : (
          <>
            <Typography variant='h3'>Reset Password</Typography>

            <TextField
              label='Email'
              type='email'
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Recaptcha ref={recaptchaRef} sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY!} size='invisible' />

            <LoadingButton
              loading={status === 'Loading'}
              variant='contained'
              type='submit'
              loadingIndicator={<CircularProgress size={20} />}
              loadingPosition='start'
              startIcon={<Icon path={mdiArrowUpDropCircle} size={1} />}
            >
              Submit
            </LoadingButton>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default ResetPassword;
