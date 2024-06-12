'use client';

import { mdiAccountRemove, mdiArrowUpDropCircle } from '@mdi/js';
import { LoadingButton } from '@mui/lab';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import Icon from '@mdi/react';
import { FormEvent, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useChangePassword, useDeleteAccount } from '../../../../_shared/api';
import { Modal } from '../../../../_shared/components';
import { redirect } from 'next/navigation';

const page = () => {
  const [status, setStatus] = useState('');
  const [form, setForm] = useState({
    newPassword: '',
    password: '',
    confirmPassword: ''
  });
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

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();

    changePassword.mutate(form);
  };

  return (
    <>
      {status === 'Confirm Delete' && <DeleteAccount cancel={() => setStatus('')} />}

      <Box sx={{ px: 2, pb: 2, flexGrow: 1, height: '100%' }}>
        <Typography variant='h6'>Change Password</Typography>

        <Box component='form' onSubmit={handleSubmit}>
          <TextField
            label='Current Password'
            type='password'
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <TextField
            label='New Password'
            type='password'
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          />

          <TextField
            label='Confirm Password'
            type='password'
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          />

          <LoadingButton
            type='submit'
            variant='contained'
            loading={status === 'Loading'}
            loadingIndicator={<CircularProgress size={20} />}
            loadingPosition='start'
            startIcon={<Icon path={mdiArrowUpDropCircle} size={1} />}
            fullWidth
          >
            Submit
          </LoadingButton>
        </Box>
      </Box>

      <Button
        color='error'
        startIcon={<Icon path={mdiAccountRemove} size={1} />}
        sx={{ justifySelf: 'flex-end' }}
        onClick={() => setStatus('Confirm Delete')}
      >
        Delete Account
      </Button>
    </>
  );
};

const DeleteAccount = ({ cancel }: { cancel: () => void }) => {
  const [status, setStatus] = useState('');
  const [password, setPassword] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const handleSuccess = (response: any) => {
    if (response.data.statusText) {
      enqueueSnackbar(response.data.statusText, { variant: 'success' });
    }

    redirect('/');
  };

  const handleError = (err: any) => {
    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }

    setStatus('');
  };

  const deleteAccount = useDeleteAccount(handleSuccess, handleError);

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();

    if (password) {
      setStatus('Loading');

      deleteAccount.mutate(password);
    }
  };

  return (
    <Modal
      open
      title='Delete Account'
      submit={handleSubmit}
      cancel={cancel}
      disableBackdropClick
      component='form'
      loading={status === 'Loading'}
    >
      <Typography sx={{ mb: 2 }}>Please allow up to 30 days to complete erase all of your data.</Typography>

      <TextField
        label='Password'
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </Modal>
  );
};

export default page;
