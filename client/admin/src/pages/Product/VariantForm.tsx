import { TextField, InputAdornment, FormControlLabel, Checkbox, Box, CircularProgress } from '@mui/material';
import { ProductVariantsInterface } from '../../../../../_shared/types';
import { FormEvent, useContext, useEffect, useState } from 'react';
import { deepEqual, generateKey } from '../../../../../_shared/utils';
import { useSnackbar } from 'notistack';
import { Icon } from '@mdi/react';
import { mdiArrowUpDropCircle } from '@mdi/js';
import { RichTextEditor } from '../../../../_shared/components';
import { useEditor } from '@tiptap/react';
import { editorExtensions } from '../../../../_shared/constants';
import { SupabaseContext } from '../../../../_shared/components/SupabaseProvider/SupabaseProvider';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';

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
  const initialVariant = {
    id: generateKey(1),
    name: '',
    price: 0,
    ordinance: 0,
    description: null,
    featured: false,
    url: null,
    product_id: '',
    status: 'available',
    created_at: new Date().toISOString(),
    updated_at: null
  };
  const [initialState, setInitialState] = useState<ProductVariantsInterface>(initialVariant);
  const [form, setForm] = useState<ProductVariantsInterface>(initialVariant);
  const { enqueueSnackbar } = useSnackbar();
  const { supabase } = useContext(SupabaseContext);

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

    if (supabase) {
      setStatus('Loading');

      const response = await supabase.from('product_variants').upsert({
        id: form.id,
        name: form.name,
        price: form.price,
        description: form.description,
        featured: form.featured,
        product_id: productId
      });

      setStatus('');

      if (response.error) {
        return enqueueSnackbar('An error occurred', { variant: 'error' });
      }

      enqueueSnackbar(variant ? 'Variant updated' : 'Variant added', { variant: 'success' });

      if (!variant) {
        navigate(`/product/${productId}/variant/${form.id}`);
      }
    }
  };

  return (
    <Box component='form' onSubmit={handleSubmit}>
      <TextField
        label='Name'
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        value={form.name}
        autoFocus
      />

      <TextField
        label='Price'
        onChange={(e) => setForm({ ...form, price: e.target.value as unknown as number })}
        value={form.price}
        InputProps={{ startAdornment: <InputAdornment position='start'>$</InputAdornment> }}
      />

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
