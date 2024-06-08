import { mdiArrowUpDropCircle } from '@mdi/js';
import Icon from '@mdi/react';
import { LoadingButton } from '@mui/lab';
import { CircularProgress } from '@mui/material';
import { useEditor } from '@tiptap/react';
import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProductsInterface } from '../../../../../_shared/types';
import { generateKey, deepEqual } from '../../../../../_shared/utils';
import { retrieveProducts, useCreateProduct } from '../../../../_shared/api';
import { RichTextEditor } from '../../../../_shared/components';
import { editorExtensions } from '../../../../_shared/constants';

interface Props {
  field: keyof ProductsInterface;
}

const editorStyle = { mb: 1.5 };

const RichForm = ({ field }: Props) => {
  const params = useParams();
  const { id, productId } = params;
  const { data } = retrieveProducts({ id: productId || id, parentId: productId ? id : undefined });
  const { products } = data || {};
  const product = products?.[0];
  const initialProduct: ProductsInterface = {
    id: generateKey(1),
    name: '',
    description: null,
    about: null,
    parentId: null,
    review: null,
    featured: false,
    ordinance: null,
    details: null,
    categoryId: 0,
    brandId: '',
    excerpt: '',
    status: 'available',
    createdAt: '',
    updatedAt: ''
  };
  const [initialState, setInitialState] = useState<ProductsInterface>({
    ...initialProduct
  });
  const [form, setForm] = useState<ProductsInterface>({ ...initialProduct });
  const [status, setStatus] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (product) {
      setInitialState(JSON.parse(JSON.stringify(product)));

      setForm(JSON.parse(JSON.stringify(product)));
    }
  }, [product]);

  const editor = useEditor(
    {
      content: (product?.[field] as string) || undefined,
      extensions: editorExtensions,
      onUpdate: ({ editor }) => {
        setForm({ ...form, [field]: editor.getHTML() });
      }
    },
    [product]
  );

  const handleSuccess = () => {
    setStatus('');

    enqueueSnackbar('Product updated', { variant: 'success' });
  };

  const handleError = (err: any) => {
    setStatus('');

    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }
  };

  const createProduct = useCreateProduct(handleSuccess, handleError);

  const handleSubmit = () => {
    setStatus('Loading');

    createProduct.mutate({ product: form });
  };

  return (
    <>
      <RichTextEditor
        sx={editorStyle}
        editor={editor}
        onHtmlChange={(html) => setForm({ ...form, [field]: html })}
        rawHtml={(form[field] as string) || ''}
      />

      <LoadingButton
        variant='contained'
        fullWidth
        loading={status === 'loading'}
        startIcon={<Icon path={mdiArrowUpDropCircle} size={1} />}
        loadingIndicator={<CircularProgress size={20} />}
        loadingPosition='start'
        disabled={deepEqual(form, initialState)}
        onClick={handleSubmit}
      >
        Submit
      </LoadingButton>
    </>
  );
};

export default RichForm;
