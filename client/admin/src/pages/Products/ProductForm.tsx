import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  FormControlLabel,
  IconButton,
  List,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Icon } from '@mdi/react';
import { mdiArrowUpDropCircle, mdiPencil, mdiPlusBox, mdiTrashCan } from '@mdi/js';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import {
  CategoriesInterface,
  ProductBrandsInterface,
  ProductUrlsInterface,
  ProductsInterface
} from '../../../../../_shared/types';
import { useNavigate, useParams } from 'react-router-dom';
import { retrieveCategories, retrieveProductBrands, useCreateProduct } from '../../../../_shared/api';
import { RichTextEditor } from '../../../../_shared/components';
import { editorExtensions } from '../../../../_shared/constants';
import { useEditor } from '@tiptap/react';
import CreateBrand from './CreateBrand';
import UrlRow from '../Product/UrlRow';
import AddUrl from '../Product/AddUrl';

interface Props {
  product?: ProductsInterface;
  variant?: boolean;
}

const editorStyle = { mb: 1.5 };

const ProductForm = ({ product, variant }: Props) => {
  const [status, setStatus] = useState('');
  const params = useParams();
  const { id, productId } = params;
  const [form, setForm] = useState<ProductsInterface>({
    id: '',
    name: '',
    description: null,
    parentId: productId || id!,
    about: null,
    ordinance: null,
    details: null,
    review: null,
    featured: false,
    categoryId: 0,
    brandId: '',
    excerpt: '',
    status: 'available',
    createdAt: '',
    updatedAt: '',
    urls: []
  });
  const [brand, setBrand] = useState<ProductBrandsInterface>();
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

      console.log(product.category);

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

    setStatus('Loading');

    const product = { ...form, categoryId: selectedCategories[selectedCategories.length - 1]?.id };

    createProduct.mutate({ product, brand });
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

  const handleCreateBrand = (brand: ProductBrandsInterface) => {
    setBrand(brand);

    setStatus('');
  };

  const handleCancelCreateBrand = () => {
    setBrand(undefined);

    setStatus('');
  };

  const handleAddUrl = (url: ProductUrlsInterface) => {
    const urls = form.urls || [];
    const index = urls.findIndex((u) => u.id === url.id);

    url.productId = form.id;

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

  console.log(variant, form.urls);

  return (
    <>
      {status === 'Create Brand' && (
        <CreateBrand submit={handleCreateBrand} cancel={handleCancelCreateBrand} brand={brand} />
      )}

      {status === 'Add URL' && <AddUrl cancel={() => setStatus('')} submit={handleAddUrl} />}

      <Box component='form' onSubmit={handleSubmit}>
        <TextField
          label='Name'
          required
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          value={form.name}
        />

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

        {!variant && (
          <>
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
          </>
        )}

        {Boolean(form.urls && form.urls.length > 0) && (
          <>
            <Box sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {!variant ? (
                  <FormControlLabel
                    label='Featured'
                    control={<Checkbox color='info' />}
                    checked={form.featured}
                    onChange={() => setForm({ ...form, featured: !form.featured })}
                  />
                ) : (
                  <Box></Box>
                )}

                <Button startIcon={<Icon path={mdiPlusBox} size={1} />} onClick={() => setStatus('Add URL')}>
                  Add URL
                </Button>
              </Box>
            </Box>

            <List disablePadding>
              {form.urls?.map((url, i) => (
                <UrlRow key={url.id} url={url} onDelete={() => handleDeleteUrl(i)} submit={handleAddUrl} />
              ))}
            </List>
          </>
        )}

        {!variant && (
          <>
            {brand ? (
              <Paper variant='outlined' sx={{ p: 2, mb: 1, display: 'flex', alignItems: 'flex-start' }}>
                {brand.logoUrl && (
                  <Box
                    sx={{
                      width: '100px',
                      height: '100px',
                      backgroundImage: `url(${brand.logoUrl})`,
                      backgroundSize: 'contain',
                      backgroundPosition: 'center top',
                      backgroundRepeat: 'no-repeat'
                    }}
                  />
                )}

                <Box sx={{ ml: 1, flexGrow: 1 }}>
                  <Typography>{brand.name}</Typography>
                  <Typography>{brand.owner}</Typography>
                  <Typography>{brand.url}</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton size='small' onClick={() => setStatus('Create Brand')} sx={{ mr: 1 }}>
                    <Icon path={mdiPencil} size={1} />
                  </IconButton>

                  <IconButton size='small' color='error' onClick={() => setBrand(undefined)}>
                    <Icon path={mdiTrashCan} size={1} />
                  </IconButton>
                </Box>
              </Paper>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.25 }}>
                <TextField
                  select
                  label='Brand'
                  SelectProps={{ native: true }}
                  onChange={(e) => setForm({ ...form, brandId: e.target.value })}
                  value={form.brandId || ''}
                  sx={{ mb: '0 !important', mr: 1 }}
                >
                  <option value=''></option>
                  {brands?.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </TextField>

                <Button
                  startIcon={<Icon path={mdiPlusBox} size={1} />}
                  onClick={() => setStatus('Create Brand')}
                >
                  Create
                </Button>
              </Box>
            )}
          </>
        )}

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
    </>
  );
};

export default ProductForm;
