import {
  Box,
  Breadcrumbs,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { SupabaseContext } from '../../../../_shared/components/SupabaseProvider/SupabaseProvider';
import { ProductsInterface } from '../../../../_shared/types';
import { grey } from '@mui/material/colors';
import { Icon } from '@mdi/react';
import { mdiPencil, mdiPlusBox, mdiViewGridPlus } from '@mdi/js';
import EditProduct from './EditProduct';
import ProductVariants from './ProductVariants';
import AddVariant from './AddVariant';

const Product = () => {
  const params = useParams();
  const { productId } = params;
  const { supabase } = useContext(SupabaseContext);
  const [product, setProduct] = useState<ProductsInterface>();
  const navigate = useNavigate();

  useEffect(() => {
    if (supabase) {
      (async () => {
        await retrieveProduct();

        const dbChanges = supabase
          .channel('schema-db-changes')
          .on('postgres_changes', { event: '*', schema: 'public' }, async (payload) => {
            if (payload.table === 'products') {
              await retrieveProduct();
            }
          });

        dbChanges.subscribe();

        return () => {
          dbChanges.unsubscribe();
        };
      })();
    }
  }, []);

  const retrieveProduct = async () => {
    if (supabase) {
      const product = await supabase.from('products').select().eq('id', productId);

      if (product.data) {
        setProduct(product.data[0]);
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', flexGrow: 1 }}>
      <Box
        sx={{
          minWidth: '200px',
          borderRightWidth: 1,
          borderRightColor: grey[600],
          borderRightStyle: 'solid'
        }}
      >
        <List disablePadding>
          <ListItem disablePadding disableGutters>
            <ListItemButton onClick={() => navigate(`/product/${product?.id}`)}>
              <ListItemIcon>
                <Icon path={mdiPencil} size={1} />
              </ListItemIcon>

              <ListItemText primary='Edit' />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding disableGutters>
            <ListItemButton onClick={() => navigate(`/product/${product?.id}/variants`)}>
              <ListItemIcon>
                <Icon path={mdiViewGridPlus} size={1} />
              </ListItemIcon>

              <ListItemText primary='Variants' />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding disableGutters>
            <ListItemButton onClick={() => navigate(`/product/${product?.id}/variants/add`)}>
              <ListItemIcon>
                <Icon path={mdiPlusBox} size={1} />
              </ListItemIcon>

              <ListItemText primary='Add Variant' />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      <Box sx={{ p: 2, flexGrow: 1 }}>
        <Breadcrumbs>
          <Link onClick={() => navigate('/products')}>Products</Link>

          <Typography>{product?.name}</Typography>
        </Breadcrumbs>

        <Outlet context={{ product }} />
      </Box>
    </Box>
  );
};

Product.Edit = EditProduct;
Product.Variants = ProductVariants;
Product.AddVariant = AddVariant;

export default Product;
