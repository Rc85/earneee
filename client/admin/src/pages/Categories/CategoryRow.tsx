import {
  CircularProgress,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  Switch,
  useTheme
} from '@mui/material';
import { CategoriesInterface } from '../../../../../_shared/types';
import { mdiChevronRight, mdiPencil, mdiTrashCan } from '@mdi/js';
import { Icon } from '@mdi/react';
import { grey } from '@mui/material/colors';
import { useState } from 'react';
import CreateCategory from './CreateCategory';
import { Modal } from '../../../../_shared/components';
import { useNavigate } from 'react-router-dom';
import { useCreateCategory, useDeleteCategory } from '../../../../_shared/api';

interface Props {
  category: CategoriesInterface;
}

const CategoryRow = ({ category }: Props) => {
  const theme = useTheme();
  const [status, setStatus] = useState('');
  const navigate = useNavigate();
  //const { attributes, setNodeRef, transform, transition, listeners } = useSortable({ id: category.id });
  const updateCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory(
    () => setStatus(''),
    () => setStatus('')
  );

  //const style = { transform: CSS.Transform.toString(transform), transition };

  const handleEditClick = () => {
    setStatus('Edit');
  };

  const handleCancel = () => {
    setStatus('');
  };

  const handleDeleteClick = () => {
    setStatus('Confirm Delete');
  };

  const handleDelete = () => {
    setStatus('Deleting');

    deleteCategory.mutate(category.id);
  };

  const handleToggle = () => {
    const status = category.status === 'available' ? 'unavailable' : 'available';

    updateCategory.mutate({ ...category, status });
  };

  const handleClick = () => {
    navigate(`/categories/${category.id}`);
  };

  return (
    <ListItem disableGutters divider /* {...attributes} sx={style} ref={setNodeRef} */>
      {status === 'Edit' && <CreateCategory cancel={handleCancel} category={category} />}

      <Modal
        open={status === 'Confirm Delete'}
        title='Are you sure you want to delete this category?'
        subtitle='All products under this category will be deleted. This action cannot be reverted.'
        submit={handleDelete}
        cancel={handleCancel}
        submitText='Yes'
        cancelText='No'
      />

      {/* <IconButton size='small' sx={{ mr: 1 }} {...listeners}>
        <Icon path={mdiDragHorizontalVariant} size={1} />
      </IconButton> */}

      <ListItemButton sx={{ mr: 1 }} onClick={handleClick}>
        <ListItemText primary={category.name} />
      </ListItemButton>

      <IconButton size='small' sx={{ mr: 1 }} onClick={handleEditClick}>
        <Icon path={mdiPencil} size={1} color={theme.palette.info.main} />
      </IconButton>

      <Switch
        color='success'
        sx={{ mr: 1 }}
        checked={category.status === 'available'}
        onChange={handleToggle}
      />

      {status === 'Deleting' ? (
        <CircularProgress size={20} sx={{ mr: 1 }} />
      ) : (
        <IconButton size='small' sx={{ mr: 1 }} onClick={handleDeleteClick}>
          <Icon path={mdiTrashCan} size={1} color={theme.palette.error.main} />
        </IconButton>
      )}

      <Icon path={mdiChevronRight} size={1} color={grey[600]} />
    </ListItem>
  );
};

export default CategoryRow;
