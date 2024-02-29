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
import {
  mdiDetails,
  mdiFormatListBulleted,
  mdiImage,
  mdiImageText,
  mdiInformation,
  mdiPencil,
  mdiPlusBox,
  mdiViewGridPlus
} from '@mdi/js';
import EditProduct from './EditProduct';
import ProductVariants from './ProductVariants';
import AddVariant from './AddVariant';
import { retrieveProducts } from '../../../../_shared/api';
import { Loading } from '../../../../_shared/components';
import About from './About';
import Media from './Media';
import Options from './Options';
import Specifications from './Specifications';
import Details from './Details';

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
            <ListItemButton onClick={() => navigate(`/product/${productId}/about`)}>
              <ListItemIcon>
                <Icon path={mdiInformation} size={1} />
              </ListItemIcon>

              <ListItemText primary='About' />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding disableGutters>
            <ListItemButton onClick={() => navigate(`/product/${productId}/details`)}>
              <ListItemIcon>
                <Icon path={mdiImageText} size={1} />
              </ListItemIcon>

              <ListItemText primary='Main Details' />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding disableGutters>
            <ListItemButton onClick={() => navigate(`/product/${productId}/options`)}>
              <ListItemIcon>
                <Icon path={mdiFormatListBulleted} size={1} />
              </ListItemIcon>

              <ListItemText primary='Options' />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding disableGutters>
            <ListItemButton onClick={() => navigate(`/product/${productId}/specifications`)}>
              <ListItemIcon>
                <Icon path={mdiDetails} size={1} />
              </ListItemIcon>

              <ListItemText primary='Specifications' />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding disableGutters>
            <ListItemButton onClick={() => navigate(`/product/${productId}/media`)}>
              <ListItemIcon>
                <Icon path={mdiImage} size={1} />
              </ListItemIcon>

              <ListItemText primary='Media' />
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
Product.About = About;
Product.Media = Media;
Product.Options = Options;
Product.Specifications = Specifications;
Product.Details = Details;

export default Product;
