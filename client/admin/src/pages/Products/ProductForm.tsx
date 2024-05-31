import { Box, Chip, CircularProgress, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Icon } from '@mdi/react';
import { mdiArrowUpDropCircle, mdiTrashCan } from '@mdi/js';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { CategoriesInterface, ProductsInterface } from '../../../../../_shared/types';
import { useNavigate } from 'react-router-dom';
import { retrieveCategories, retrieveProductBrands, useCreateProduct } from '../../../../_shared/api';
import { generateKey } from '../../../../../_shared/utils';
import { RichTextEditor } from '../../../../_shared/components';
import { editorExtensions } from '../../../../_shared/constants';
import { useEditor } from '@tiptap/react';

interface Props {
  product?: ProductsInterface;
}

const editorStyle = { mb: 1.5 };

const ProductForm = ({ product }: Props) => {
  const [status, setStatus] = useState('');
  const [form, setForm] = useState<ProductsInterface>({
    id: generateKey(1),
    name: '',
    type: 'affiliate',
    description: null,
    about: null,
    details: null,
    categoryId: 0,
    brandId: '',
    excerpt: '',
    status: 'available',
    createdAt: '',
    updatedAt: ''
  });
  const { enqueueSnackbar } = useSnackbar();
  const [selectedCategories, setSelectedCategories] = useState<CategoriesInterface[]>([]);
  const navigate = useNavigate();
  const b = retrieveProductBrands();
  const c = retrieveCategories({
    parentId: selectedCategories[selectedCategories.length - 1]?.id || null
  });
  const { brands } = b.data || {};
  const { categories } = c.data || {};
  const editor = useEditor(
    {
      content: product?.description || undefined,
      extensions: editorExtensions,
      onUpdate: ({ editor }) => {
        setForm({ ...form, description: editor.getHTML() });
      }
    },
    [product]
  );

  useEffect(() => {
    if (product) {
      setForm({ ...product });

      if (product.category) {
        const exists = selectedCategories.find((category) => category.id === product.category?.id);

        if (!exists) {
          setSelectedCategories([...selectedCategories, product.category]);
        }
      }
    }
  }, [product]);

  const handleSuccess = () => {
    setStatus('');

    if (product) {
      return enqueueSnackbar('Product updated', { variant: 'success' });
    }

    navigate(-1);
  };

  const handleError = (err: any) => {
    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }

    setStatus('');
  };

  const createProduct = useCreateProduct(handleSuccess, handleError);

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();

    const categoryId = selectedCategories[selectedCategories.length - 1]?.id;

    if (!form.name) {
      return enqueueSnackbar('Name required', { variant: 'error' });
    } else if (!categoryId) {
      return enqueueSnackbar('Category required', { variant: 'error' });
    }

    if (selectedCategories.length) {
      setStatus('Loading');

      createProduct.mutate({ ...form, categoryId: selectedCategories[selectedCategories.length - 1].id });
    }
  };

  const handleCategoryChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const category = categories?.find((category) => category.id === parseInt(e.target.value));

    if (category) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleDeleteSelectedCategory = (index: number) => {
    const categories = [...selectedCategories];
    const category = categories[index];

    if (category && product && product.categoryId === category.id) {
      setForm({ ...form, categoryId: 0 });
    }

    const selected = categories.slice(0, index);

    setSelectedCategories(selected);
  };

  return (
    <Box component='form' onSubmit={handleSubmit}>
      <TextField
        label='Name'
        required
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        value={form.name}
      />

      <TextField
        select
        SelectProps={{ native: true }}
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
      >
        <option value='affiliate'>Affiliate Product</option>
        <option value='dropship'>Dropship Product</option>
        <option value='direct'>Direct Sale Product</option>
      </TextField>

      {form.type !== 'affiliate' && (
        <>
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
          />{' '}
        </>
      )}

      {selectedCategories.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant='body2' color='GrayText'>
            Selected category
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {selectedCategories.map((category, i) => (
              <Box key={category.id} sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip
                  label={category.name}
                  color={i === selectedCategories.length - 1 ? 'success' : undefined}
                  sx={{ mr: 1 }}
                  deleteIcon={<Icon path={mdiTrashCan} size={1} />}
                  onDelete={() => handleDeleteSelectedCategory(i)}
                />

                {i !== selectedCategories.length - 1 ? <Typography sx={{ mr: 1 }}>/</Typography> : null}
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {categories && categories.length > 0 && (
        <TextField
          select
          label='Category'
          SelectProps={{ native: true }}
          onChange={handleCategoryChange}
          value={form.categoryId || ''}
        >
          <option value=''></option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </TextField>
      )}

      <TextField
        select
        label='Brand'
        SelectProps={{ native: true }}
        onChange={(e) => setForm({ ...form, brandId: e.target.value })}
        value={form.brandId || ''}
      >
        <option value=''></option>
        {brands?.map((brand) => (
          <option key={brand.id} value={brand.id}>
            {brand.name}
          </option>
        ))}
      </TextField>

      <LoadingButton
        type='submit'
        onClick={handleSubmit}
        variant='contained'
        fullWidth
        loading={status === 'Loading'}
        loadingIndicator={<CircularProgress size={20} />}
        loadingPosition='start'
        startIcon={<Icon path={mdiArrowUpDropCircle} size={1} />}
      >
        Submit
      </LoadingButton>
    </Box>
  );
};

export default ProductForm;
