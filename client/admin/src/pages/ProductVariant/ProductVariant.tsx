import { mdiDetails, mdiFormatListBulleted, mdiImage, mdiPencil, mdiWeb } from '@mdi/js';
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
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import VariantMedia from './VariantMedia';
import EditVariant from './EditVariant';
import VariantOptions from './VariantOptions';
import Specifications from './Specifications';
import { retrieveProductVariants, retrieveProducts } from '../../../../_shared/api';
import ProductUrls from './ProductUrls';

const ProductVariant = () => {
  const params = useParams();
  const { productId, variantId } = params;
  const navigate = useNavigate();
  const { data: { data: { products } } = { data: {} } } = retrieveProducts({ productId });
  const { data: { data: { variants } } = { data: {} } } = retrieveProductVariants({ variantId });
  const product = products?.[0];
  const variant = variants?.[0];

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
            <ListItemButton onClick={() => navigate(`/product/${productId}/variant/${variantId}/urls`)}>
              <ListItemIcon>
                <Icon path={mdiWeb} size={1} />
              </ListItemIcon>

              <ListItemText primary='URLS' />
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

        <Outlet />
      </Box>
    </Box>
  );
};

ProductVariant.Edit = EditVariant;
ProductVariant.Media = VariantMedia;
ProductVariant.Options = VariantOptions;
ProductVariant.Specifications = Specifications;
ProductVariant.URLS = ProductUrls;

export default ProductVariant;
