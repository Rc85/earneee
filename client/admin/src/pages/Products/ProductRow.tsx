import {
  CircularProgress,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  Switch,
  useTheme
} from '@mui/material';
import { ProductsInterface } from '../../../../../_shared/types';
import { Icon } from '@mdi/react';
import { mdiChevronRight, mdiTrashCan } from '@mdi/js';
import { useState } from 'react';
import { Modal } from '../../../../_shared/components';
import { useNavigate } from 'react-router-dom';
import { useCreateProduct, useDeleteProduct } from '../../../../_shared/api';
import { useSnackbar } from 'notistack';

interface Props {
  product: ProductsInterface;
}

const ProductRow = ({ product }: Props) => {
  const theme = useTheme();
  const [status, setStatus] = useState('');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSuccess = (response: any) => {
    if (response.data.statusText) {
      enqueueSnackbar(response.data.statusText, { variant: 'success' });
    }

    setStatus('');
  };

  const handleError = (err: any) => {
    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }

    setStatus('');
  };

  const updateProduct = useCreateProduct(handleSuccess, handleError);
  const deleteProduct = useDeleteProduct(handleSuccess, handleError);

  const handleToggle = () => {
    const status = product.status === 'available' ? 'unavailable' : 'available';

    updateProduct.mutate({ ...product, status });
  };

  const handleDeleteClick = () => {
    setStatus('Confirm Delete');
  };

  const handleDelete = () => {
    setStatus('Deleting');

    deleteProduct.mutate(product.id);
  };

  const handleCancel = () => {
    setStatus('');
  };

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <ListItem disableGutters disablePadding divider>
      <Modal
        open={status === 'Confirm Delete'}
        title='Are you sure you want to delete this product?'
        subtitle={`This action cannot be reverted.`}
        submit={handleDelete}
        cancel={handleCancel}
        submitText='Yes'
        cancelText='No'
      />

      <ListItemButton onClick={handleClick}>
        <ListItemText primary={product.name} />
      </ListItemButton>

      <Switch
        sx={{ mx: 1 }}
        color='success'
        onChange={handleToggle}
        checked={product.status === 'available'}
      />

      {status === 'Deleting' ? (
        <CircularProgress size={20} />
      ) : (
        <IconButton size='small' onClick={handleDeleteClick} sx={{ mr: 1 }}>
          <Icon path={mdiTrashCan} size={1} color={theme.palette.error.main} />
        </IconButton>
      )}

      <Icon path={mdiChevronRight} size={1} />
    </ListItem>
  );
};

export default ProductRow;
