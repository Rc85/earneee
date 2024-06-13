import { IconButton, ListItem, ListItemButton, ListItemText, Switch } from '@mui/material';
import { ProductOptionsInterface } from '../../../../../_shared/types';
import { Icon } from '@mdi/react';
import { mdiTrashCan } from '@mdi/js';
import { useState } from 'react';
import { Modal } from '../../../../_shared/components';
import { useSnackbar } from 'notistack';
import { useCreateProductOption, useDeleteProductOption } from '../../../../_shared/api';
import AddOption from './AddOption';

interface Props {
  option: ProductOptionsInterface;
}

const OptionRow = ({ option }: Props) => {
  const [status, setStatus] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const handleSuccess = () => {
    setStatus('');
  };

  const handleError = (err: any) => {
    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }

    setStatus('');
  };

  const toggleProductOption = useCreateProductOption();
  const deleteProductOption = useDeleteProductOption(handleSuccess, handleError);

  const handleToggle = () => {
    const status = option.status === 'available' ? 'unavailable' : 'available';

    toggleProductOption.mutate({ ...option, status });
  };

  const handleDelete = () => {
    setStatus('Deleting');

    deleteProductOption.mutate(option.id);
  };

  const handleDeleteClick = () => {
    setStatus('Confirm Delete');
  };

  const handleEditClick = () => {
    setStatus('Edit');
  };

  const handleCancelEdit = () => {
    setStatus('');
  };

  return (
    <>
      <Modal
        open={status === 'Confirm Delete'}
        title='Are you sure you want to delete this option?'
        subtitle={`This action cannot be reverted.`}
        submit={handleDelete}
        cancel={() => setStatus('')}
        submitText='Yes'
        cancelText='No'
      />

      {status === 'Edit' && <AddOption option={option} cancel={handleCancelEdit} />}

      <ListItem disableGutters disablePadding divider>
        <ListItemButton onClick={handleEditClick}>
          <ListItemText
            primary={option.name}
            secondary={`${option.required ? 'Required' : ''} \u2022 ${option.selections?.length} selection${
              option.selections && option.selections.length > 1 ? 's' : ''
            }`}
          />
        </ListItemButton>

        <IconButton size='small' color='error' onClick={handleDeleteClick}>
          <Icon path={mdiTrashCan} size={1} />
        </IconButton>

        <Switch color='success' checked={option.status === 'available'} onChange={handleToggle} />
      </ListItem>
    </>
  );
};

export default OptionRow;
