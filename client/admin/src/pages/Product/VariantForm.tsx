import { TextField, FormControlLabel, Checkbox, Box, CircularProgress, Button, List } from '@mui/material';
import { ProductUrlsInterface, ProductVariantsInterface } from '../../../../../_shared/types';
import { FormEvent, useEffect, useState } from 'react';
import { deepEqual, generateKey } from '../../../../../_shared/utils';
import { useSnackbar } from 'notistack';
import { Icon } from '@mdi/react';
import { mdiArrowUpDropCircle, mdiPlusBox, mdiRefresh } from '@mdi/js';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { retrieveAffiliates, useCreateProductVariant } from '../../../../_shared/api';
import AddUrl from './AddUrl';
import UrlRow from './UrlRow';

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
    ordinance: 0,
    excerpt: null,
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
  const { data } = retrieveAffiliates();
  const { affiliates } = data || {};

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
      console.log('variant', variant);

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

  const handleAddUrl = (url: ProductUrlsInterface) => {
    const urls = form.urls || [];
    const index = urls.findIndex((u) => u.id === url.id);

    if (index >= 0) {
      urls[index] = url;
    } else {
      urls.push(url);
    }

    setForm({ ...form, urls });

    setStatus('');
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
      {status === 'Add URL' && (
        <AddUrl
          cancel={() => setStatus('')}
          submit={handleAddUrl}
          variantId={form.id}
          affiliates={affiliates || []}
        />
      )}

      <TextField
        label='Name'
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        value={form.name}
        autoFocus
      />

      <TextField
        label='Excerpt'
        onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
        value={form.excerpt || ''}
      />

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

        <Button startIcon={<Icon path={mdiPlusBox} size={1} />} onClick={() => setStatus('Add URL')}>
          Add URL
        </Button>
      </Box>

      {Boolean(form.urls && form.urls.length > 0) && (
        <List disablePadding>
          {form.urls?.map((url, i) => (
            <UrlRow
              key={url.id}
              url={url}
              onDelete={() => handleDeleteUrl(i)}
              affiliates={affiliates || []}
              submit={handleAddUrl}
            />
          ))}
        </List>
      )}

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

      <Button
        color='inherit'
        sx={{ mt: 1 }}
        fullWidth
        startIcon={<Icon path={mdiRefresh} size={1} />}
        onClick={() => setForm(JSON.parse(JSON.stringify(initialState)))}
      >
        Reset
      </Button>
    </Box>
  );
};

export default VariantForm;
