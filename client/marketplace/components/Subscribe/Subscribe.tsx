'use client';

import { mdiSend } from '@mdi/js';
import Icon from '@mdi/react';
import { LoadingButton } from '@mui/lab';
import { Box, Typography, TextField, useTheme, CircularProgress } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useRef, useState } from 'react';
import Recaptcha from 'react-google-recaptcha';
import { useSubscribe } from '../../../_shared/api';

const Subscribe = () => {
  const recaptchaRef = useRef<Recaptcha>(null);
  const [status, setStatus] = useState('');
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [email, setEmail] = useState('');

  const handleSuccess = (response: any) => {
    recaptchaRef.current?.reset();

    if (response.data.statusText) {
      enqueueSnackbar(response.data.statusText, { variant: 'success' });
    }

    setEmail('');

    setStatus('Success');
  };

  const handleError = (err: any) => {
    recaptchaRef.current?.reset();

    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }

    setStatus('');
  };

  const subscribe = useSubscribe(handleSuccess, handleError);

  const handleSubmit = async (e?: any) => {
    e?.preventDefault();

    setStatus('Loading');

    const key = await recaptchaRef.current?.executeAsync();

    if (key) {
      subscribe.mutate({ key, email });
    }
  };

  return (
    <Box
      sx={{
        borderRadius: '5px',
        backgroundImage: `linear-gradient(270deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
        width: '100%',
        p: 5,
        display: 'flex',
        alignItems: 'center',
        my: 3
      }}
    >
      <img
        src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/images/subscribe.png`}
        style={{ width: 300, maxWidth: '100%' }}
      />

      <Box sx={{ pl: 10 }}>
        {status === 'Success' ? (
          <>
            <Typography variant='h4'>Thank you for subscribing to our newsletter!</Typography>

            <Typography>You can unsubscribe any time using the link you receive in your emails.</Typography>
          </>
        ) : (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant='h4'>
                Subscribe to our newsletter to get updates on trending products, latest discounts, and more.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex' }} component='form' onSubmit={handleSubmit}>
              <TextField
                label='Email'
                type='email'
                autoComplete='email'
                required
                color='info'
                sx={{ mr: 1, mb: '0px !important' }}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />

              <Recaptcha
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY!}
                size='invisible'
              />

              <LoadingButton
                type='submit'
                color='info'
                variant='contained'
                startIcon={<Icon path={mdiSend} size={1} />}
                loading={status === 'Loading'}
                loadingPosition='start'
                loadingIndicator={<CircularProgress size={20} />}
              >
                Subscribe
              </LoadingButton>
            </Box>

            <Typography variant='caption'>
              Upon subscribing, you agree on allowing us to send you emails regarding news and updates.
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Subscribe;
