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
import { mdiChevronRight, mdiDragHorizontalVariant, mdiTrashCan } from '@mdi/js';
import { useState } from 'react';
import { Modal } from '../../../../_shared/components';
import { useCreateProduct, useDeleteProduct } from '../../../../_shared/api';
import { useSnackbar } from 'notistack';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
  product: ProductsInterface;
  onClick: () => void;
  sortable?: boolean;
}

const ProductRow = ({ product, onClick, sortable }: Props) => {
  const theme = useTheme();
  const [status, setStatus] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: product.id });

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

    updateProduct.mutate({ product: { ...product, status } });
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

  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <ListItem disableGutters disablePadding divider {...attributes} style={style}>
      <Modal
        open={status === 'Confirm Delete'}
        title='Are you sure you want to delete this product?'
        subtitle={`This action cannot be reverted.`}
        submit={handleDelete}
        cancel={handleCancel}
        submitText='Yes'
        cancelText='No'
      />

      {sortable && (
        <IconButton size='small' ref={setNodeRef} {...listeners}>
          <Icon path={mdiDragHorizontalVariant} size={1} />
        </IconButton>
      )}

      <ListItemButton onClick={onClick}>
        <ListItemText primary={`${product.brand?.name ? `${product.brand?.name} ` : ''}${product.name}`} />
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
