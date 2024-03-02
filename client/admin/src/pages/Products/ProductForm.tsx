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

interface Props {
  product?: ProductsInterface;
}

const ProductForm = ({ product }: Props) => {
  const [status, setStatus] = useState('');
  const [form, setForm] = useState<ProductsInterface>({
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

  const handleChange = (key: keyof ProductsInterface, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleCategoryChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const category = categories?.find((category) => category.id === parseInt(e.target.value));

    if (category) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleDeleteSelectedCategory = (index: number) => {
    const categories = [...selectedCategories];

    const selected = categories.slice(0, index);

    setSelectedCategories(selected);
  };

  return (
    <Box component='form' onSubmit={handleSubmit}>
      <TextField
        label='Name'
        required
        onChange={(e) => handleChange('name', e.target.value)}
        value={form.name}
      />

      <TextField
        label='Excerpt'
        onChange={(e) => handleChange('excerpt', e.target.value)}
        value={form.excerpt || ''}
      />

      <TextField
        label='Description'
        onChange={(e) => handleChange('description', e.target.value)}
        value={form.description || ''}
        multiline
        rows={4}
      />

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
        onChange={(e) => handleChange('brandId', e.target.value)}
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
