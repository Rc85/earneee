'use client';

import { mdiArrowUpDropCircle } from '@mdi/js';
import Icon from '@mdi/react';
import { LoadingButton } from '@mui/lab';
import { CircularProgress, Container, Paper, TextField, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import Recaptcha from 'react-google-recaptcha';

const ResetPassword = () => {
  const recaptchaRef = useRef<Recaptcha>(null);
  const [status, _setStatus] = useState('');
  const [_email, setEmail] = useState('');

  return (
    <Container maxWidth='sm'>
      <Paper variant='outlined' sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <Typography variant='h3'>Reset Password</Typography>

        <TextField label='Email' type='email' required onChange={(e) => setEmail(e.target.value)} />

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
      </Paper>
    </Container>
  );
};

export default ResetPassword;
