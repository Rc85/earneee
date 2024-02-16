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
import { grey } from '@mui/material/colors';
import { Icon } from '@mdi/react';
import { mdiPencil, mdiPlusBox, mdiViewGridPlus } from '@mdi/js';
import EditProduct from './EditProduct';
import ProductVariants from './ProductVariants';
import AddVariant from './AddVariant';
import { retrieveProducts } from '../../../../_shared/api';
import { Loading } from '../../../../_shared/components';

const Product = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { productId } = params;
  const { isLoading, data } = retrieveProducts({ productId });
  const { products } = data || {};
  const product = products?.[0];

  return isLoading ? (
    <Loading />
  ) : (
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
