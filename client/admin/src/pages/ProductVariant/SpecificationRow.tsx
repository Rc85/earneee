import {
  CircularProgress,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme
} from '@mui/material';
import { ProductSpecificationsInterface } from '../../../../../_shared/types';
import { Icon } from '@mdi/react';
import { mdiDragHorizontalVariant, mdiTrashCan } from '@mdi/js';
import { useState } from 'react';
import { Modal } from '../../../../_shared/components';
import AddSpecification from './AddSpecification';
import { useDeleteProductSpecification } from '../../../../_shared/api';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
  specification: ProductSpecificationsInterface;
}

const SpecificationRow = ({ specification }: Props) => {
  const [status, setStatus] = useState('');
  const theme = useTheme();
  const deleteProductSpecification = useDeleteProductSpecification(
    () => setStatus(''),
    () => setStatus('')
  );
  const { attributes, listeners, transform, transition, setNodeRef } = useSortable({ id: specification.id });

  const style = { transform: CSS.Transform.toString(transform), transition };

  const handleDelete = () => {
    setStatus('Deleting');

    deleteProductSpecification.mutate(specification.id);
  };

  return (
    <ListItem disableGutters disablePadding divider ref={setNodeRef} {...attributes} style={style}>
      <Modal
        open={status === 'Confirm Delete'}
        title='Are you sure you want to delete this spec?'
        submit={handleDelete}
        cancel={() => setStatus('')}
        submitText='Yes'
        cancelText='No'
      />

      {status === 'Edit' && <AddSpecification cancel={() => setStatus('')} specification={specification} />}

      <IconButton size='small' {...listeners}>
        <Icon path={mdiDragHorizontalVariant} size={1} />
      </IconButton>

      <ListItemButton onClick={() => setStatus('Edit')} sx={{ mr: 1 }}>
        <ListItemText primary={specification.name} />
      </ListItemButton>

      {status === 'Deleting' ? (
        <CircularProgress size={20} />
      ) : (
        <IconButton size='small' onClick={() => setStatus('Confirm Delete')}>
          <Icon path={mdiTrashCan} size={1} color={theme.palette.error.main} />
        </IconButton>
      )}
    </ListItem>
  );
};

export default SpecificationRow;
