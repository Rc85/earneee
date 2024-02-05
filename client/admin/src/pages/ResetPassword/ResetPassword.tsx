import { Alert, Box, CircularProgress, TextField } from '@mui/material';
import { Section } from '../../../../_shared/components';
import { ChangeEvent, FormEvent, useContext, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { Icon } from '@mdi/react';
import { mdiArrowUpDropCircle } from '@mdi/js';
import { SupabaseContext } from '../../../../_shared/components/SupabaseProvider/SupabaseProvider';
import { useSnackbar } from 'notistack';

const ResetPassword = () => {
  const [status, setStatus] = useState('');
  const [email, setEmail] = useState('');
  const { supabase } = useContext(SupabaseContext);
  const { enqueueSnackbar } = useSnackbar();

  const handleEmailChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setStatus('');

    setEmail(e.target.value);
  };

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();

    if (supabase) {
      setStatus('Loading');

      const response = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:5173/reset-password'
      });

      if (response.error) {
        setStatus('');

        return enqueueSnackbar(response.error.message, { variant: 'error' });
      }

      setStatus('Success');

      setEmail('');
    }
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
