import { useParams } from 'react-router-dom';
import { RichTextEditor, Section } from '../../../../_shared/components';
import {
  retrieveProductVariants,
  retrieveProducts,
  useCreateProduct,
  useCreateProductVariant
} from '../../../../_shared/api';
import { useEditor } from '@tiptap/react';
import { editorExtensions } from '../../../../_shared/constants';
import { useEffect, useState } from 'react';
import { ProductVariantsInterface, ProductsInterface } from '../../../../../_shared/types';
import { deepEqual, generateKey } from '../../../../../_shared/utils';
import { LoadingButton } from '@mui/lab';
import Icon from '@mdi/react';
import { mdiArrowUpDropCircle } from '@mdi/js';
import { CircularProgress } from '@mui/material';
import { useSnackbar } from 'notistack';

const editorStyle = { mb: 1.5 };

const Details = () => {
  const params = useParams();
  const { variantId, productId } = params;
  const v = variantId ? retrieveProductVariants({ variantId }) : undefined;
  const { variants } = v?.data || {};
  const variant = variants?.[0];
  const p = productId && !variantId ? retrieveProducts({ productId }) : undefined;
  const { products } = p?.data || {};
  const product = products?.[0];
  const initialVariant: ProductVariantsInterface = {
    id: generateKey(1),
    name: '',
    ordinance: 0,
    description: null,
    excerpt: null,
    about: null,
    details: null,
    featured: false,
    productId: productId!,
    status: 'available',
    createdAt: new Date().toISOString(),
    updatedAt: null,
    urls: []
  };
  const initialProduct: ProductsInterface = {
    id: generateKey(1),
    name: '',
    description: null,
    about: null,
    details: null,
    categoryId: 0,
    brandId: '',
    excerpt: '',
    status: 'available',
    createdAt: '',
    updatedAt: ''
  };
  const [initialState, setInitialState] = useState<ProductsInterface | ProductVariantsInterface>(
    productId && !variantId ? initialProduct : initialVariant
  );
  const [form, setForm] = useState<ProductsInterface | ProductVariantsInterface>(
    productId && !variantId ? initialProduct : initialVariant
  );
  const [status, setStatus] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (productId && !variantId && product) {
      setInitialState(JSON.parse(JSON.stringify(product)));

      setForm(JSON.parse(JSON.stringify(product)));
    } else if (variant) {
      setInitialState(JSON.parse(JSON.stringify(variant)));

      setForm(JSON.parse(JSON.stringify(variant)));
    }
  }, [variant, product]);

  const editor = useEditor(
    {
      content: productId && !variantId ? product?.details : variant?.details || undefined,
      extensions: editorExtensions,
      onUpdate: ({ editor }) => {
        setForm({ ...form, details: editor.getHTML() });
      }
    },
    [variant]
  );

  const handleSuccess = () => {
    setStatus('');

    if (productId && !variantId) {
      enqueueSnackbar('Product updated', { variant: 'success' });
    } else if (variant) {
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
  const createProduct = useCreateProduct(handleSuccess, handleError);

  const handleSubmit = (e?: any) => {
    e?.preventDefault();

    setStatus('Loading');

    if (productId && !variantId) {
      createProduct.mutate(form);
    } else {
      createVariant.mutate(form);
    }
  };

  return (
    <Section title='Main Details' titleVariant='h3' component='form' onSubmit={handleSubmit}>
      <RichTextEditor
        sx={editorStyle}
        editor={editor}
        onHtmlChange={(html) => setForm({ ...form, details: html })}
        rawHtml={form.details || ''}
      />

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

export default Details;
