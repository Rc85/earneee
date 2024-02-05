import { CircularProgress, TextField } from '@mui/material';
import { Section } from '../../../../_shared/components';
import { LoadingButton } from '@mui/lab';
import { Icon } from '@mdi/react';
import { mdiArrowUpDropCircle } from '@mdi/js';
import { FormEvent, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useChangePassword } from '../../../../_shared/api';

const Account = () => {
  const [form, setForm] = useState({ password: '', newPassword: '', confirmPassword: '', admin: true });
  const [status, setStatus] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const handleSuccess = (response: any) => {
    if (response.data.statusText) {
      enqueueSnackbar(response.data.statusText, { variant: 'success' });
    }

    setStatus('');
  };

  const handleError = (err: any) => {
    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }

    setStatus('');
  };

  const changePassword = useChangePassword(handleSuccess, handleError);

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();

    if (!form.newPassword) {
      return enqueueSnackbar('Password required', { variant: 'error' });
    } else if (form.newPassword.length < 8) {
      return enqueueSnackbar('Password must be 8 characters or more', { variant: 'error' });
    } else if (form.newPassword !== form.confirmPassword) {
      return enqueueSnackbar('Passwords do not match', { variant: 'error' });
    }

    setStatus('Loading');

    changePassword.mutate(form);
  };

  return (
    <Section title='ACCOUNT' position='center' titleVariant='h3' sx={{ p: 2 }}>
      <Section
        title='Change password'
        subtitle='You will need to log in again'
        titleVariant='h6'
        variant='outlined'
        sx={{ p: 2 }}
      >
        <TextField
          label='Current Password'
          type='password'
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          value={form.password}
        />

        <TextField
          label='New Password'
          type='password'
          placeholder='Minimum 8 characters'
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          value={form.newPassword}
        />

        <TextField
          label='Confirm Password'
          type='password'
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          value={form.confirmPassword}
        />

        <LoadingButton
          type='submit'
          variant='contained'
          fullWidth
          loading={status === 'Loading'}
          loadingPosition='start'
          loadingIndicator={<CircularProgress size={20} />}
          startIcon={<Icon path={mdiArrowUpDropCircle} size={1} />}
          onClick={handleSubmit}
        >
          Submit
        </LoadingButton>
      </Section>
    </Section>
  );
};

export default Account;
