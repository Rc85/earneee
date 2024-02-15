import { TextField, InputAdornment, FormControlLabel, Checkbox, Box, CircularProgress } from '@mui/material';
import { ProductVariantsInterface } from '../../../../../_shared/types';
import { FormEvent, useEffect, useState } from 'react';
import { deepEqual, generateKey } from '../../../../../_shared/utils';
import { useSnackbar } from 'notistack';
import { Icon } from '@mdi/react';
import { mdiArrowUpDropCircle } from '@mdi/js';
import { RichTextEditor } from '../../../../_shared/components';
import { useEditor } from '@tiptap/react';
import { editorExtensions } from '../../../../_shared/constants';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { useCreateProductVariant } from '../../../../_shared/api';

interface Props {
  variant?: ProductVariantsInterface;
}

const editorStyle = { mb: 1.5 };

const VariantForm = ({ variant }: Props) => {
  const [content, setContent] = useState('');
  const params = useParams();
  const { productId } = params;
  const navigate = useNavigate();
  const editor = useEditor(
    {
      content: variant?.description || undefined,
      extensions: editorExtensions,
      onUpdate: ({ editor }) => {
        setContent(editor.getHTML());
      }
    },
    [variant]
  );
  const [status, setStatus] = useState('');
  const initialVariant: ProductVariantsInterface = {
    id: generateKey(1),
    name: '',
    price: 0,
    currency: 'cad',
    ordinance: 0,
    description: null,
    featured: false,
    productId: productId!,
    status: 'available',
    createdAt: new Date().toISOString(),
    updatedAt: null
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

    if (content) {
      form.description = content;
    }

    setStatus('Loading');

    createVariant.mutate(form);
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

      <RichTextEditor editor={editor} sx={editorStyle} />

      <FormControlLabel
        sx={{ display: 'block' }}
        label='Feature on main page'
        control={<Checkbox color='info' />}
        checked={form.featured}
        onChange={() => setForm({ ...form, featured: !form.featured })}
      />

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
        disabled={deepEqual(initialState, form) && form.description === content}
      >
        Submit
      </LoadingButton>
    </Box>
  );
};

export default VariantForm;
