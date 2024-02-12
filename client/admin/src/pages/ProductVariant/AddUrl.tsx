import { TextField } from '@mui/material';
import { Modal } from '../../../../_shared/components';
import { countries } from '../../../../../_shared';
import { FormEvent, useState } from 'react';
import { generateKey } from '../../../../../_shared/utils';
import { ProductUrlsInterface } from '../../../../../_shared/types';
import { useSnackbar } from 'notistack';
import { useCreateProductUrl } from '../../../../_shared/api';

interface Props {
  variantId: string;
  url?: ProductUrlsInterface;
  cancel: () => void;
}

const AddUrl = ({ cancel, url, variantId }: Props) => {
  const [status, setStatus] = useState('');
  const [form, setForm] = useState<ProductUrlsInterface>(
    url || { id: generateKey(1), url: '', country: 'CA', variantId, createdAt: '', updatedAt: '' }
  );
  const { enqueueSnackbar } = useSnackbar();

  const handleSuccess = () => {
    cancel();
  };

  const handleError = (err: any) => {
    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }

    setStatus('');
  };

  const createProductUrl = useCreateProductUrl(handleSuccess, handleError);

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();

    setStatus('Loading');

    createProductUrl.mutate(form);
  };

  return (
    <Modal
      open
      title='Add URL'
      cancel={cancel}
      component='form'
      submit={handleSubmit}
      loading={status === 'Loading'}
    >
      <TextField
        type='url'
        label='URL'
        value={form.url}
        onChange={(e) => setForm({ ...form, url: e.target.value })}
      />

      <TextField
        label='Country'
        select
        SelectProps={{ native: true }}
        value={form.country}
        onChange={(e) => setForm({ ...form, country: e.target.value })}
      >
        {countries.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name}
          </option>
        ))}
      </TextField>
    </Modal>
  );
};

export default AddUrl;
