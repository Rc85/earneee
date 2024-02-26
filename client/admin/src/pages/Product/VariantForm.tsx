import {
  TextField,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Box,
  CircularProgress,
  Button,
  IconButton
} from '@mui/material';
import { ProductUrlsInterface, ProductVariantsInterface } from '../../../../../_shared/types';
import { FormEvent, useEffect, useState } from 'react';
import { deepEqual, generateKey } from '../../../../../_shared/utils';
import { useSnackbar } from 'notistack';
import { Icon } from '@mdi/react';
import { mdiArrowUpDropCircle, mdiPlusBox, mdiTrashCan } from '@mdi/js';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { useCreateProductVariant } from '../../../../_shared/api';
import { countries } from '../../../../../_shared';

interface Props {
  variant?: ProductVariantsInterface;
}

const VariantForm = ({ variant }: Props) => {
  const params = useParams();
  const { productId } = params;
  const navigate = useNavigate();
  const [status, setStatus] = useState('');
  const initialVariant: ProductVariantsInterface = {
    id: generateKey(1),
    name: '',
    price: 0,
    currency: 'cad',
    ordinance: 0,
    description: null,
    about: null,
    details: null,
    featured: false,
    productId: productId!,
    status: 'available',
    createdAt: new Date().toISOString(),
    updatedAt: null,
    urls: []
  };
  const [initialState, setInitialState] = useState<ProductVariantsInterface>(initialVariant);
  const [form, setForm] = useState<ProductVariantsInterface>(initialVariant);
  const { enqueueSnackbar } = useSnackbar();

  const handleSuccess = () => {
    setStatus('');

    if (variant) {
      return enqueueSnackbar('Variant updated', { variant: 'success' });
    }

    navigate(`/product/${productId}/variants`);
  };

  const handleError = (err: any) => {
    setStatus('');

    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }
  };

  const createVariant = useCreateProductVariant(handleSuccess, handleError);

  useEffect(() => {
    if (variant) {
      setInitialState(JSON.parse(JSON.stringify(variant)));

      setForm(JSON.parse(JSON.stringify(variant)));
    }
  }, [variant]);

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();

    if (!form.name) {
      return enqueueSnackbar('Name required', { variant: 'error' });
    }

    setStatus('Loading');

    createVariant.mutate(form);
  };

  const handleAddUrlClick = () => {
    const urls = form.urls || [];

    urls.push({
      id: generateKey(1),
      url: '',
      country: 'CA',
      variantId: form.id,
      createdAt: new Date().toISOString(),
      updatedAt: null
    });

    setForm({ ...form, urls });
  };

  const handleUrlChange = (value: string, key: keyof ProductUrlsInterface, index: number) => {
    const urls = form.urls || [];

    urls[index][key] = value;

    setForm({ ...form, urls });
  };

  const handleDeleteUrl = (index: number) => {
    const urls = form.urls || [];

    if (index >= 0) {
      urls.splice(index, 1);
    }

    setForm({ ...form, urls });
  };

  return (
    <Box component='form' onSubmit={handleSubmit}>
      <TextField
        label='Name'
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        value={form.name}
        autoFocus
      />

      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
        <TextField
          label='Price'
          onChange={(e) => setForm({ ...form, price: e.target.value as unknown as number })}
          value={form.price}
          InputProps={{ startAdornment: <InputAdornment position='start'>$</InputAdornment> }}
          sx={{ mr: 1 }}
        />

        <TextField
          label='Currency'
          select
          SelectProps={{ native: true }}
          sx={{ minWidth: '25%' }}
          onChange={(e) => setForm({ ...form, currency: e.target.value })}
          value={form.currency}
          fullWidth={false}
        >
          <option value='aud'>Australian Dollar</option>
          <option value='cad'>Canadian Dollar</option>
          <option value='eur'>Euro</option>
          <option value='gbp'>Pound</option>
          <option value='usd'>US Dollar</option>
        </TextField>
      </Box>

      <TextField
        label='Description'
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        value={form.description || ''}
        multiline
        rows={4}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <FormControlLabel
          label='Feature on main page'
          control={<Checkbox color='info' />}
          checked={form.featured}
          onChange={() => setForm({ ...form, featured: !form.featured })}
        />

        <Button startIcon={<Icon path={mdiPlusBox} size={1} />} onClick={handleAddUrlClick}>
          Add URL
        </Button>
      </Box>

      {form.urls?.map((url, i) => (
        <Box key={url.id} sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            type='url'
            label='URL'
            value={url.url}
            onChange={(e) => handleUrlChange(e.target.value, 'url', i)}
            sx={{ mr: 1, mb: '0 !important' }}
          />

          <TextField
            label='Country'
            select
            SelectProps={{ native: true }}
            value={url.country}
            onChange={(e) => handleUrlChange(e.target.value, 'country', i)}
            sx={{ mb: '0 !important' }}
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </TextField>

          <IconButton size='small' sx={{ ml: 1 }} onClick={() => handleDeleteUrl(i)}>
            <Icon path={mdiTrashCan} size={1} />
          </IconButton>
        </Box>
      ))}

      <LoadingButton
        variant='contained'
        type='submit'
        fullWidth
        loading={status === 'Loading'}
        loadingIndicator={<CircularProgress size={20} />}
        loadingPosition='start'
        startIcon={<Icon path={mdiArrowUpDropCircle} size={1} />}
        sx={{ mt: 1 }}
        onClick={handleSubmit}
        disabled={deepEqual(initialState, form)}
      >
        Submit
      </LoadingButton>
    </Box>
  );
};

export default VariantForm;
