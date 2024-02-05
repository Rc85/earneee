import { mdiDetails, mdiFormatListBulleted, mdiImage, mdiPencil } from '@mdi/js';
import { Icon } from '@mdi/react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Breadcrumbs,
  Typography,
  Link
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { ProductVariantsInterface, ProductsInterface } from '../../../../../_shared/types';
import { SupabaseContext } from '../../../../_shared/components/SupabaseProvider/SupabaseProvider';
import VariantMedia from './VariantMedia';
import EditVariant from './EditVariant';
import VariantOptions from './VariantOptions';
import Specifications from './Specifications';

const ProductVariant = () => {
  const params = useParams();
  const { productId, variantId } = params;
  const [product, setProduct] = useState<ProductsInterface>();
  const [variant, setVariant] = useState<ProductVariantsInterface>();
  const { supabase } = useContext(SupabaseContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (supabase) {
      (async () => {
        const product = await supabase.from('products').select().eq('id', productId);

        if (product.data) {
          setProduct(product.data[0]);
        }

        await retrieveVariant();

        const dbChanges = supabase
          .channel('schema-db-changes')
          .on('postgres_changes', { event: '*', schema: 'public' }, async (payload) => {
            if (payload.table === 'product_variants') {
              await retrieveVariant();
            }
          });

        dbChanges.subscribe();

        return () => {
          dbChanges.unsubscribe();
        };
      })();
    }
  }, []);

  const retrieveVariant = async () => {
    if (supabase) {
      const variant = await supabase.from('product_variants').select().eq('id', variantId);

      if (variant.data) {
        setVariant(variant.data[0]);
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
            <ListItemButton onClick={() => navigate(`/product/${productId}/variant/${variantId}`)}>
              <ListItemIcon>
                <Icon path={mdiPencil} size={1} />
              </ListItemIcon>

              <ListItemText primary='Edit' />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding disableGutters>
            <ListItemButton onClick={() => navigate(`/product/${productId}/variant/${variantId}/options`)}>
              <ListItemIcon>
                <Icon path={mdiFormatListBulleted} size={1} />
              </ListItemIcon>

              <ListItemText primary='Options' />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding disableGutters>
            <ListItemButton
              onClick={() => navigate(`/product/${productId}/variant/${variantId}/specifications`)}
            >
              <ListItemIcon>
                <Icon path={mdiDetails} size={1} />
              </ListItemIcon>

              <ListItemText primary='Specifications' />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding disableGutters>
            <ListItemButton onClick={() => navigate(`/product/${productId}/variant/${variantId}/media`)}>
              <ListItemIcon>
                <Icon path={mdiImage} size={1} />
              </ListItemIcon>

              <ListItemText primary='Media' />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      <Box sx={{ p: 2, flexGrow: 1 }}>
        <Breadcrumbs>
          <Link onClick={() => navigate('/products')}>Products</Link>

          <Link onClick={() => navigate(`/product/${productId}`)}>{product?.name}</Link>

          <Typography>{variant?.name}</Typography>
        </Breadcrumbs>

        <Outlet context={{ variant }} />
      </Box>
    </Box>
  );
};

ProductVariant.Edit = EditVariant;
ProductVariant.Media = VariantMedia;
ProductVariant.Options = VariantOptions;
ProductVariant.Specifications = Specifications;

export default ProductVariant;
