import { CircularProgress, IconButton, ListItem, ListItemText, useTheme } from '@mui/material';
import { ProductUrlsInterface } from '../../../../../_shared/types';
import Icon from '@mdi/react';
import { mdiTrashCan } from '@mdi/js';
import { useState } from 'react';
import { Modal } from '../../../../_shared/components';
import { useDeleteProductUrl } from '../../../../_shared/api';
import { useSnackbar } from 'notistack';

interface Props {
  url: ProductUrlsInterface;
}

const UrlRow = ({ url }: Props) => {
  const theme = useTheme();
  const [status, setStatus] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const handleError = (err: any) => {
    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }

    setStatus('');
  };

  const deleteProductUrl = useDeleteProductUrl(() => setStatus(''), handleError);

  const handleDelete = () => {
    setStatus('Deleting');

    deleteProductUrl.mutate(url.id);
  };

  return (
    <ListItem disableGutters disablePadding divider>
      <Modal
        open={status === 'Confirm Delete'}
        title='Are you sure you want to delete this URL?'
        submit={handleDelete}
        cancel={() => setStatus('')}
        submitText='Yes'
        cancelText='No'
      />

      <ListItemText primary={url.country} secondary={url.url} />

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

export default UrlRow;
