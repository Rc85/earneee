import { Box, Button, List, Typography } from '@mui/material';
import { Section } from '../../../../_shared/components';
import { Icon } from '@mdi/react';
import { mdiPlusBox } from '@mdi/js';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import CreateProduct from './CreateProduct';
import { SupabaseContext } from '../../../../_shared/components/SupabaseProvider/SupabaseProvider';
import { ProductsInterface } from '../../../../../_shared/types';
import ProductRow from './ProductRow';
import SearchProducts from './SearchProducts';

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductsInterface[]>([]);
  const { supabase } = useContext(SupabaseContext);

  useEffect(() => {
    if (supabase) {
      (async () => {
        await retrieveProducts();
      })();

      const dbChanges = supabase
        .channel('schema-db-changes')
        .on('postgres_changes', { event: '*', schema: 'public' }, async (payload) => {
          if (payload.table === 'products') {
            await retrieveProducts();
          }
        });

      dbChanges.subscribe();

      return () => {
        dbChanges.unsubscribe();
      };
    }
  }, []);

  const retrieveProducts = async (filters?: { search?: string; filter?: string }) => {
    if (supabase) {
      const retrieve = supabase.from('products').select().order('name');

      if (filters?.search) {
        retrieve.ilike('name', `${filters.search}%`);
      }

      if (filters?.filter) {
        retrieve.eq('subcategory_id', filters.filter);
      }

      const products = await retrieve;

      if (products.data) {
        setProducts(products.data);
      }
    }
  };

  const handleCreateClick = () => {
    navigate('/products/create');
  };

  return (
    <Section
      title='Products'
      titleVariant='h3'
      position='center'
      actions={[
        <Button key='create' startIcon={<Icon path={mdiPlusBox} size={1} />} onClick={handleCreateClick}>
          Create
        </Button>
      ]}
      sx={{ p: 2, flex: 1 }}
    >
      <SearchProducts onChange={retrieveProducts} />

      {products.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <Typography>There are no products</Typography>
        </Box>
      ) : (
        <List disablePadding>
          {products.map((product) => (
            <ProductRow key={product.id} product={product} />
          ))}
        </List>
      )}
    </Section>
  );
};

Products.Create = CreateProduct;

export default Products;
