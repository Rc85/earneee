'use client';

import { CircularProgress, TextField } from '@mui/material';
import { Section } from '../../../_shared/components';
import { LoadingButton } from '@mui/lab';
import Icon from '@mdi/react';
import { mdiArrowUpDropCircle } from '@mdi/js';
import { FormEvent, useRef, useState } from 'react';
import Recaptcha from 'react-google-recaptcha';
import { useSnackbar } from 'notistack';
import { useContact } from '../../../_shared/api';

const Contact = () => {
  const recaptchaRef = useRef<Recaptcha>(null);
  const [status, setStatus] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState<{
    name: string;
    email: string;
    message: string;
    key: string;
  }>({
    name: '',
    email: '',
    message: '',
    key: ''
  });

  const handleSuccess = (response: any) => {
    if (response.data.statusText) {
      enqueueSnackbar(response.data.statusText, { variant: 'success' });
    }

    setForm({
      name: '',
      email: '',
      message: '',
      key: ''
    });

    recaptchaRef.current?.reset();

    setStatus('');
  };

  const handleError = (err: any) => {
    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }

    recaptchaRef.current?.reset();

    setStatus('');
  };

  const contact = useContact(handleSuccess, handleError);

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();

    setStatus('Loading');

    const key = await recaptchaRef.current?.executeAsync();

    if (key) {
      form.key = key;

      contact.mutate(form);
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.value = e.target.value.substring(0, 5000);

    setForm({ ...form, message: e.target.value });
  };

  return (
    <Section
      title='Contact Us'
      titleVariant='h3'
      maxWidth='sm'
      position='center'
      component='form'
      onSubmit={handleSubmit}
    >
      <TextField
        label='Name'
        required
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        value={form.name}
      />

      <TextField
        label='Email'
        type='email'
        required
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        value={form.email}
      />

      <TextField
        label='Message'
        multiline
        rows={5}
        required
        onChange={handleMessageChange}
        value={form.message}
        helperText={`${form.message.length} / 5000`}
        inputProps={{ style: { resize: 'vertical' } }}
        FormHelperTextProps={{ sx: { display: 'flex', justifyContent: 'flex-end' } }}
      />

      <Recaptcha ref={recaptchaRef} sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY!} size='invisible' />

      <LoadingButton
        variant='contained'
        type='submit'
        startIcon={<Icon path={mdiArrowUpDropCircle} size={1} />}
        loading={status === 'Loading'}
        loadingIndicator={<CircularProgress size={20} />}
        loadingPosition='start'
        fullWidth
      >
        Submit
      </LoadingButton>
    </Section>
  );
};

export default Contact;
