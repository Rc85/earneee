'use client';

import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { authenticate, retrieveUserProfile, useUpdateProfile } from '../../../../_shared/api';
import { FormEvent, useEffect, useState } from 'react';
import { UserProfilesInterface } from '../../../../../_shared/types';
import { deepEqual } from '../../../../../_shared/utils';
import { countries } from '../../../../../_shared';
import { Loading } from '../../../../_shared/components';
import { LoadingButton } from '@mui/lab';
import Icon from '@mdi/react';
import { mdiArrowUpDropCircle, mdiRefresh } from '@mdi/js';
import { useSnackbar } from 'notistack';

const page = () => {
  const [status, setStatus] = useState('');
  const auth = authenticate('marketplace');
  const { user } = auth?.data || {};
  const { isLoading, data } = retrieveUserProfile(Boolean(user));
  const { userProfile } = data || {};
  const profile = {
    id: user?.id || '',
    firstName: null,
    lastName: null,
    phoneNumber: null,
    address: null,
    city: null,
    region: null,
    country: '',
    postalCode: null,
    logoPath: null,
    logoUrl: null,
    createdAt: '',
    updatedAt: null
  };
  const [initialState, setInitialState] = useState<UserProfilesInterface>(profile);
  const [form, setForm] = useState<UserProfilesInterface>(profile);
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

  const updateProfile = useUpdateProfile(handleSuccess, handleError);

  useEffect(() => {
    if (userProfile) {
      setForm({ ...userProfile });
      setInitialState({ ...userProfile });
    }
  }, [userProfile]);

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();

    updateProfile.mutate(form);
  };

  return isLoading ? (
    <Loading />
  ) : (
    <Box sx={{ px: 2, pb: 2, flexGrow: 1 }} component='form' onSubmit={handleSubmit}>
      <Typography variant='h6'>Profile</Typography>

      <TextField
        label='First Name'
        value={form.firstName || ''}
        onChange={(e) => setForm({ ...form, firstName: e.target.value || null })}
      />

      <TextField
        label='Last Name'
        value={form.lastName || ''}
        onChange={(e) => setForm({ ...form, lastName: e.target.value || null })}
      />

      <Typography variant='h6'>Shipping</Typography>

      <TextField
        label='Phone Number'
        type='tel'
        value={form.phoneNumber || ''}
        onChange={(e) => setForm({ ...form, phoneNumber: e.target.value || null })}
      />

      <TextField
        label='Address'
        value={form.address || ''}
        onChange={(e) => setForm({ ...form, address: e.target.value || null })}
      />

      <TextField
        label='City'
        value={form.city || ''}
        onChange={(e) => setForm({ ...form, city: e.target.value || null })}
      />

      <TextField
        label='State/Province'
        placeholder='Two letter code'
        value={form.region || ''}
        onChange={(e) => setForm({ ...form, region: e.target.value || null })}
      />

      <TextField
        label='Country'
        select
        SelectProps={{ native: true }}
        value={form.country || ''}
        onChange={(e) => setForm({ ...form, country: e.target.value })}
      >
        <option value=''></option>
        {countries.map((country) => (
          <option key={country.code} value={country.code || ''}>
            {country.name}
          </option>
        ))}
      </TextField>

      <TextField
        label='Zip/Postal Code'
        value={form.postalCode || ''}
        onChange={(e) => setForm({ ...form, postalCode: e.target.value || null })}
      />

      <LoadingButton
        type='submit'
        variant='contained'
        loading={status === 'Loading'}
        loadingIndicator={<CircularProgress size={20} />}
        loadingPosition='start'
        startIcon={<Icon path={mdiArrowUpDropCircle} size={1} />}
        fullWidth
        disabled={deepEqual(form, initialState)}
      >
        Submit
      </LoadingButton>

      <Button startIcon={<Icon path={mdiRefresh} size={1} />} sx={{ mt: 1 }} color='inherit' fullWidth>
        Reset
      </Button>
    </Box>
  );
};

export default page;
