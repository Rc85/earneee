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

const About = () => {
  const params = useParams();
  const { variantId, productId } = params;
  const v = variantId ? retrieveProductVariants({ variantId }) : undefined;
  const { variants } = v?.data || {};
  const variant = variants?.[0];
  const p = productId && !variantId ? retrieveProducts({ productId }) : undefined;
  const { products } = p?.data || {};
  const product = products?.[0];
  const initialProduct: ProductsInterface = {
    id: generateKey(1),
    name: '',
    price: null,
    currency: null,
    description: null,
    about: null,
    details: null,
    categoryId: 0,
    brandId: '',
    excerpt: '',
    status: 'available',
    createdAt: '',
    updatedAt: '',
    urls: []
  };
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
  const [initialState, setInitialState] = useState<ProductVariantsInterface | ProductsInterface>(
    productId && !variantId ? initialProduct : initialVariant
  );
  const [form, setForm] = useState<ProductVariantsInterface | ProductsInterface>(
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
  }, [product, variant]);

  const editor = useEditor(
    {
      content: productId && !variantId ? product?.about : variant?.about || undefined,
      extensions: editorExtensions,
      onUpdate: ({ editor }) => {
        setForm({ ...form, about: editor.getHTML() });
      }
    },
    [variant]
  );

  const handleSuccess = () => {
    setStatus('');

    if (productId && !variantId) {
      enqueueSnackbar('Product updated', { variant: 'success' });
    } else {
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
