import { useParams } from 'react-router-dom';
import { RichTextEditor, Section } from '../../../../_shared/components';
import { retrieveProductVariants, useCreateProductVariant } from '../../../../_shared/api';
import { useEditor } from '@tiptap/react';
import { editorExtensions } from '../../../../_shared/constants';
import { useEffect, useState } from 'react';
import { ProductVariantsInterface } from '../../../../../_shared/types';
import { deepEqual, generateKey } from '../../../../../_shared/utils';
import { LoadingButton } from '@mui/lab';
import Icon from '@mdi/react';
import { mdiArrowUpDropCircle } from '@mdi/js';
import { CircularProgress } from '@mui/material';
import { useSnackbar } from 'notistack';

const editorStyle = { mb: 1.5 };

const About = () => {
  const params = useParams();
  const { variantId, productId } = params;
  const { data } = retrieveProductVariants({ variantId });
  const { variants } = data || {};
  const variant = variants?.[0];
  const initialVariant = {
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
  const [status, setStatus] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (variant) {
      setInitialState(JSON.parse(JSON.stringify(variant)));

      setForm(JSON.parse(JSON.stringify(variant)));
    }
  }, [variant]);

  const editor = useEditor(
    {
      content: variant?.about || undefined,
      extensions: editorExtensions,
      onUpdate: ({ editor }) => {
        setForm({ ...form, about: editor.getHTML() });
      }
    },
    [variant]
  );

  const handleSuccess = () => {
    setStatus('');

    if (variant) {
      enqueueSnackbar('Variant updated', { variant: 'success' });
    }
  };

  const handleError = (err: any) => {
    setStatus('');

    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }
  };

  const createVariant = useCreateProductVariant(handleSuccess, handleError);

  const handleSubmit = (e?: any) => {
    e?.preventDefault();

    setStatus('Loading');

    createVariant.mutate(form);
  };

  return (
    <Section title='About' titleVariant='h3' component='form' onSubmit={handleSubmit}>
      <RichTextEditor sx={editorStyle} editor={editor} />

      <LoadingButton
        variant='contained'
        fullWidth
        type='submit'
        loading={status === 'loading'}
        startIcon={<Icon path={mdiArrowUpDropCircle} size={1} />}
        loadingIndicator={<CircularProgress size={20} />}
        loadingPosition='start'
        disabled={deepEqual(form, initialState)}
      >
        Submit
      </LoadingButton>
    </Section>
  );
};

export default About;
