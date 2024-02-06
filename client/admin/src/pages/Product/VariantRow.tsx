import {
  CircularProgress,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  Switch,
  useTheme
} from '@mui/material';
import { ProductVariantsInterface } from '../../../../../_shared/types';
import { Icon } from '@mdi/react';
import { mdiDragHorizontalVariant, mdiTrashCan } from '@mdi/js';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { Modal } from '../../../../_shared/components';
import { useNavigate } from 'react-router-dom';
import { useCreateProductVariant, useDeleteProductVariant } from '../../../../_shared/api';

interface Props {
  variant: ProductVariantsInterface;
}

const VariantRow = ({ variant }: Props) => {
  const [status, setStatus] = useState('');
  const theme = useTheme();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: variant.id });
  const navigate = useNavigate();
  const updateVariant = useCreateProductVariant();
  const deleteVariant = useDeleteProductVariant(
    () => setStatus(''),
    () => setStatus('')
  );

  const style = { transform: CSS.Transform.toString(transform), transition };

  const handleToggle = () => {
    const status = variant.status === 'available' ? 'unavailable' : 'available';

    updateVariant.mutate({ ...variant, status });
  };

  const handleDelete = () => {
    setStatus('Deleting');

    deleteVariant.mutate(variant.id);
  };

  return (
    <>
      <Modal
        open={status === 'Confirm Delete'}
        title='Are you sure you want to delete this variant?'
        subtitle={`All options in this variant will also be deleted. This action cannot be reverted.`}
        submit={handleDelete}
        cancel={() => setStatus('')}
        submitText='Yes'
        cancelText='No'
      />

      <ListItem disableGutters disablePadding divider style={style} {...attributes} ref={setNodeRef}>
        <IconButton {...listeners} size='small'>
          <Icon path={mdiDragHorizontalVariant} size={1} />
        </IconButton>

        <ListItemButton onClick={() => navigate(`/product/${variant.productId}/variant/${variant.id}`)}>
          <ListItemText primary={variant.name} />
        </ListItemButton>

        <Switch
          color='success'
          checked={variant.status === 'available'}
          sx={{ mx: 1 }}
          onChange={handleToggle}
        />

        {status === 'Deleting' ? (
          <CircularProgress size={20} />
        ) : (
          <IconButton size='small' onClick={() => setStatus('Confirm Delete')}>
            <Icon path={mdiTrashCan} size={1} color={theme.palette.error.main} />
          </IconButton>
        )}
      </ListItem>
    </>
  );
};

export default VariantRow;
