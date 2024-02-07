import { Alert, Box, CircularProgress, TextField } from '@mui/material';
import { Section } from '../../../../_shared/components';
import { ChangeEvent, FormEvent, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { Icon } from '@mdi/react';
import { mdiArrowUpDropCircle } from '@mdi/js';
import { useSnackbar } from 'notistack';
import { useResetPassword } from '../../../../_shared/api';

const ResetPassword = () => {
  const [status, setStatus] = useState('');
  const [email, setEmail] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const handleSuccess = () => {
    setStatus('Success');

    setEmail('');
  };

  const handleError = (err: any) => {
    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }
  };

  const resetPassword = useResetPassword(handleSuccess, handleError);

  const handleEmailChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setStatus('');

    setEmail(e.target.value);
  };

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();

    resetPassword.mutate({ email });
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      <Section
        title='Reset password'
        titleVariant='h3'
        variant='outlined'
        component='form'
        onSubmit={handleSubmit}
        sx={{ p: 2 }}
        maxWidth='sm'
      >
        {status === 'Success' && (
          <Alert variant='filled' severity='success' sx={{ mb: 2 }}>
            A password recovery email has been sent. Check your inbox.
          </Alert>
        )}

        <TextField
          label='Email'
          type='email'
          autoComplete='email'
          onChange={handleEmailChange}
          value={email}
        />

        <LoadingButton
          type='submit'
          variant='contained'
          fullWidth
          loading={status === 'Loading'}
          loadingIndicator={<CircularProgress size={20} />}
          loadingPosition='start'
          startIcon={<Icon path={mdiArrowUpDropCircle} size={1} />}
          onClick={handleSubmit}
        >
          Submit
        </LoadingButton>
      </Section>
    </Box>
  );
};

export default ResetPassword;
