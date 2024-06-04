import { TextField, FormControlLabel, Checkbox, Box, CircularProgress, Button, List } from '@mui/material';
import { ProductUrlsInterface, ProductVariantsInterface } from '../../../../../_shared/types';
import { FormEvent, useEffect, useState } from 'react';
import { deepEqual, generateKey } from '../../../../../_shared/utils';
import { useSnackbar } from 'notistack';
import { Icon } from '@mdi/react';
import { mdiArrowUpDropCircle, mdiPlusBox, mdiRefresh } from '@mdi/js';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { retrieveAffiliates, retrieveProducts, useCreateProductVariant } from '../../../../_shared/api';
import AddUrl from './AddUrl';
import UrlRow from './UrlRow';
import { useEditor } from '@tiptap/react';
import { editorExtensions } from '../../../../_shared/constants';
import { Loading, RichTextEditor } from '../../../../_shared/components';

interface Props {
  variant?: ProductVariantsInterface;
}

const editorStyle = { mb: 1.5 };

const VariantForm = ({ variant }: Props) => {
  const params = useParams();
  const { productId } = params;
  const productData = retrieveProducts({ productId });
  const { products } = productData?.data || {};
  const product = products?.[0];
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
    currency: 'cad',
    status: 'available',
    createdAt: new Date().toISOString(),
    updatedAt: null,
    urls: []
  };
  const [initialState, setInitialState] = useState<ProductVariantsInterface>(
    variant || JSON.parse(JSON.stringify(initialVariant))
  );
  const [form, setForm] = useState<ProductVariantsInterface>(
    variant || JSON.parse(JSON.stringify(initialVariant))
  );
  const { enqueueSnackbar } = useSnackbar();
  const { data } = retrieveAffiliates();
  const { affiliates } = data || {};
  const editor = useEditor(
    {
      content: variant?.description || undefined,
      extensions: editorExtensions,
      onUpdate: ({ editor }) => {
        setForm({ ...form, description: editor.getHTML() });
      }
    },
    [variant]
  );

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

  return productData.isLoading ? (
    <Loading />
  ) : (
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

      {product?.type !== 'affiliate' && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.25 }}>
          <TextField
            label='Price'
            onChange={(e) => setForm({ ...form, price: e.target.value as unknown as number })}
            value={form.price}
            sx={{ mb: '0 !important', mr: 1 }}
          />

          <TextField
            label='Currency'
            select
            SelectProps={{ native: true }}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
            value={form.currency}
            sx={{ mb: '0 !important' }}
          >
            <option value='cad'>CAD</option>
            <option value='usd'>USD</option>
          </TextField>
        </Box>
      )}

      <TextField
        label='Excerpt'
        onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
        value={form.excerpt || ''}
      />

      <RichTextEditor
        sx={editorStyle}
        editor={editor}
        onHtmlChange={(html) => setForm({ ...form, details: html })}
        rawHtml={form.details || ''}
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
