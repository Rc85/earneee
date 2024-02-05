import { Box, Chip, CircularProgress, TextField, Typography } from '@mui/material';
import { RichTextEditor } from '../../../../_shared/components';
import { LoadingButton } from '@mui/lab';
import { Icon } from '@mdi/react';
import { mdiArrowUpDropCircle, mdiTrashCan } from '@mdi/js';
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import { useEditor } from '@tiptap/react';
import { editorExtensions } from '../../../../_shared/constants';
import { SupabaseContext } from '../../../../_shared/components/SupabaseProvider/SupabaseProvider';
import { generateKey } from '../../../../../_shared/utils';
import { useSnackbar } from 'notistack';
import {
  AffiliatesInterface,
  CategoriesInterface,
  ProductBrandsInterface,
  ProductsInterface
} from '../../../../../_shared/types';
import { useNavigate } from 'react-router-dom';

interface Props {
  product?: ProductsInterface;
}

const editorStyle = { mb: 1.5 };

const ProductForm = ({ product }: Props) => {
  const [status, setStatus] = useState('');
  const [form, setForm] = useState<ProductsInterface>({
    id: '',
    name: '',
    description: '',
    type: '',
    affiliate_id: '',
    category_id: 0,
    brand_id: '',
    excerpt: '',
    status: 'available',
    created_at: '',
    updated_at: ''
  });
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
  const { supabase } = useContext(SupabaseContext);
  const { enqueueSnackbar } = useSnackbar();
  const [selectedCategories, setSelectedCategories] = useState<CategoriesInterface[]>([]);
  const [categories, setCategories] = useState<CategoriesInterface[]>([]);
  const navigate = useNavigate();
  const [affiliates, setAffiliates] = useState<AffiliatesInterface[]>([]);
  const [brands, setBrands] = useState<ProductBrandsInterface[]>([]);

  useEffect(() => {
    if (supabase) {
      (async () => {
        const affiliates = await supabase
          .from('affiliates')
          .select()
          .order('name')
          .returns<AffiliatesInterface[]>();

        if (affiliates.data) {
          setAffiliates(affiliates.data);
        }

        const brands = await supabase
          .from('product_brands')
          .select('id, name')
          .eq('status', 'active')
          .returns<ProductBrandsInterface[]>();

        if (brands.data) {
          setBrands(brands.data);
        }

        if (product) {
          setForm(product);

          const exists = selectedCategories.find((category) => category.id === product.category_id);

          if (!exists) {
            const category = await supabase
              .from('categories')
              .select()
              .eq('id', product.category_id)
              .returns<CategoriesInterface[]>();

            if (category.data?.[0]) {
              setSelectedCategories([...selectedCategories, category.data[0]]);
            }
          }
        }
      })();
    }
  }, [product]);

  useEffect(() => {
    (async () => {
      if (supabase) {
        let parentId: number | undefined = selectedCategories[selectedCategories.length - 1]?.id;

        const select = supabase.from('categories').select();

        if (parentId == null) {
          select.is('parent_id', null);
        } else {
          select.eq('parent_id', parentId);
        }

        const response = await select.order('ordinance, name');

        if (response.data) {
          setCategories(response.data);
        }
      }
    })();
  }, [selectedCategories.length]);

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();

    const categoryId = selectedCategories[selectedCategories.length - 1]?.id;

    if (!form.name) {
      return enqueueSnackbar('Name required', { variant: 'error' });
    } else if (!form.type) {
      return enqueueSnackbar('Type required', { variant: 'error' });
    } else if (!categoryId) {
      return enqueueSnackbar('Category required', { variant: 'error' });
    }

    if (supabase) {
      setStatus('Loading');

      const id = product?.id || generateKey(1);

      const response = await supabase.from('products').upsert({
        id,
        name: form.name,
        type: form.type,
        affiliate_id: form.affiliate_id || null,
        brand_id: form.brand_id || null,
        excerpt: form.excerpt || null,
        category_id: categoryId,
        description: form.description || null
      });

      setStatus('');

      if (response.error) {
        const message = response.error.code === '23505' ? 'Name already exist' : response.error.message;

        return enqueueSnackbar(message, { variant: 'error' });
      }

      enqueueSnackbar(product ? 'Updated' : 'Created', {
        variant: 'success'
      });

      if (!product) {
        navigate(`/product/${id}`);
      }
    }
  };

  const handleChange = (key: keyof ProductsInterface, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleCategoryChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (supabase) {
      const selectedCategory = categories.find((category) => category.id === parseInt(e.target.value));

      if (selectedCategory) {
        setSelectedCategories([...selectedCategories, selectedCategory]);
      }
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

      {categories.length > 0 && (
        <TextField
          select
          label='Category'
          SelectProps={{ native: true }}
          onChange={handleCategoryChange}
          value={form.category_id || ''}
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
        label='Type'
        required
        SelectProps={{ native: true }}
        onChange={(e) => handleChange('type', e.target.value)}
        value={form.type || ''}
      >
        <option value=''></option>
        <option value='affiliate'>Affiliate</option>
        <option value='dropship'>Dropship</option>
      </TextField>

      <TextField
        select
        label='Affiliate'
        SelectProps={{ native: true }}
        onChange={(e) => handleChange('affiliate_id', e.target.value)}
        value={form.affiliate_id || ''}
      >
        <option value=''></option>
        {affiliates.map((affiliate) => (
          <option key={affiliate.id} value={affiliate.id}>
            {affiliate.name}
          </option>
        ))}
      </TextField>

      <TextField
        select
        label='Brand'
        SelectProps={{ native: true }}
        onChange={(e) => handleChange('brand_id', e.target.value)}
        value={form.brand_id || ''}
      >
        <option value=''></option>
        {brands.map((brand) => (
          <option key={brand.id} value={brand.id}>
            {brand.name}
          </option>
        ))}
      </TextField>

      <RichTextEditor editor={editor} sx={editorStyle} />

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
