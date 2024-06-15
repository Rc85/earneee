import {
  Box,
  Breadcrumbs,
  Chip,
  CircularProgress,
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
  mdiImage,
  mdiImageText,
  mdiInformation,
  mdiMessageDraw,
  mdiPencil,
  mdiPlusBox,
  mdiPublish,
  mdiPublishOff,
  mdiViewGridPlus,
  mdiViewList
} from '@mdi/js';
import EditProduct from './EditProduct';
import ProductVariants from './ProductVariants';
import AddVariant from './AddVariant';
import { retrieveProducts, useCreateProduct } from '../../../../_shared/api';
import { Loading } from '../../../../_shared/components';
import Media from './Media';
import Specifications from './Specifications';
import Options from './Options';
import RichFormPage from './RichFormPage';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';

const Product = () => {
  const [status, setStatus] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const params = useParams();
  const { id, productId } = params;
  const { isLoading, data } = retrieveProducts({ parentId: productId ? id : undefined, id: productId || id });
  const { products } = data || {};
  const product = products?.[0];
  const published = product?.product ? product.product.published : product?.published;

  const handleSuccess = () => {
    enqueueSnackbar(published ? 'Product published' : 'Product unpublished', { variant: 'success' });

    setStatus('');
  };

  const handleError = (err: any) => {
    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }

    setStatus('');
  };

  const publishProduct = useCreateProduct(handleSuccess, handleError);

  const handlePublishClick = () => {
    if (product) {
      publishProduct.mutate({
        product: { ...product, id: product.parentId || product.id, published: !product.published }
      });
    }
  };

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
        <Box sx={{ p: 1 }}>
          <LoadingButton
            fullWidth
            variant='contained'
            color={!published ? 'success' : 'inherit'}
            startIcon={<Icon path={!published ? mdiPublish : mdiPublishOff} size={1} />}
            loading={status === 'Loading'}
            loadingPosition='start'
            loadingIndicator={<CircularProgress size={20} />}
            onClick={handlePublishClick}
          >
            {!published ? 'Publish' : 'Unpublish'}
          </LoadingButton>
        </Box>

        <List disablePadding>
          <ListItem disablePadding disableGutters>
            <ListItemButton
              onClick={() => navigate(`/product/${id}${productId ? `/variant/${productId}` : ''}`)}
            >
              <ListItemIcon>
                <Icon path={mdiPencil} size={1} />
              </ListItemIcon>

              <ListItemText primary='Edit' />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding disableGutters>
            <ListItemButton
              onClick={() => navigate(`/product/${id}${productId ? `/variant/${productId}` : ''}/about`)}
            >
              <ListItemIcon>
                <Icon path={mdiInformation} size={1} />
              </ListItemIcon>

              <ListItemText primary='About' />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding disableGutters>
            <ListItemButton
              onClick={() => navigate(`/product/${id}${productId ? `/variant/${productId}` : ''}/details`)}
            >
              <ListItemIcon>
                <Icon path={mdiImageText} size={1} />
              </ListItemIcon>

              <ListItemText primary='Main Details' />
            </ListItemButton>
          </ListItem>

          {!productId && (
            <ListItem disablePadding disableGutters>
              <ListItemButton
                onClick={() => navigate(`/product/${id}${productId ? `/variant/${productId}` : ''}/review`)}
              >
                <ListItemIcon>
                  <Icon path={mdiMessageDraw} size={1} />
                </ListItemIcon>

                <ListItemText primary='Review' />
              </ListItemButton>
            </ListItem>
          )}

          <ListItem disablePadding disableGutters>
            <ListItemButton
              onClick={() =>
                navigate(`/product/${id}${productId ? `/variant/${productId}` : ''}/specifications`)
              }
            >
              <ListItemIcon>
                <Icon path={mdiDetails} size={1} />
              </ListItemIcon>

              <ListItemText primary='Specifications' />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding disableGutters>
            <ListItemButton
              onClick={() => navigate(`/product/${id}${productId ? `/variant/${productId}` : ''}/options`)}
            >
              <ListItemIcon>
                <Icon path={mdiViewList} size={1} />
              </ListItemIcon>

              <ListItemText primary='Options' />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding disableGutters>
            <ListItemButton
              onClick={() => navigate(`/product/${id}${productId ? `/variant/${productId}` : ''}/media`)}
            >
              <ListItemIcon>
                <Icon path={mdiImage} size={1} />
              </ListItemIcon>

              <ListItemText primary='Media' />
            </ListItemButton>
          </ListItem>

          {!productId && (
            <ListItem disablePadding disableGutters>
              <ListItemButton onClick={() => navigate(`/product/${id}/variants`)}>
                <ListItemIcon>
                  <Icon path={mdiViewGridPlus} size={1} />
                </ListItemIcon>

                <ListItemText primary='Variants' />
              </ListItemButton>
            </ListItem>
          )}

          {!productId && (
            <ListItem disablePadding disableGutters>
              <ListItemButton onClick={() => navigate(`/product/${id}/variants/add`)}>
                <ListItemIcon>
                  <Icon path={mdiPlusBox} size={1} />
                </ListItemIcon>

                <ListItemText primary='Add Variant' />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Box>

      <Box sx={{ p: 2, flexGrow: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Breadcrumbs>
            <Link onClick={() => navigate('/products')}>Products</Link>

            {product?.product ? (
              <Link onClick={() => navigate(`/product/${product.product?.id}`)}>{product.product?.name}</Link>
            ) : (
              <Typography>{product?.name}</Typography>
            )}

            {product?.product && <Typography>{product.name}</Typography>}
          </Breadcrumbs>

          {Boolean(product?.status && ['available', 'unavailable'].includes(product.status)) && (
            <Chip
              size='small'
              label={product?.status}
              color={product?.status === 'available' ? 'success' : 'error'}
            />
          )}
        </Box>

        <Outlet context={{ product }} />
      </Box>
    </Box>
  );
};

Product.Edit = EditProduct;
Product.Variants = ProductVariants;
Product.AddVariant = AddVariant;
Product.About = RichFormPage;
Product.Media = Media;
Product.Specifications = Specifications;
Product.Details = RichFormPage;
Product.Options = Options;
Product.Review = RichFormPage;

export default Product;
