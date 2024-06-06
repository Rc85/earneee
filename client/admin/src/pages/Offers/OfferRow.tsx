import {
  CircularProgress,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  Switch,
  useTheme
} from '@mui/material';
import { OffersInterface } from '../../../../../_shared/types';
import { useState } from 'react';
import { Icon } from '@mdi/react';
import { mdiDragHorizontalVariant, mdiTrashCan } from '@mdi/js';
import { Modal } from '../../../../_shared/components';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSnackbar } from 'notistack';
import { useCreateOffer, useDeleteOffer } from '../../../../_shared/api';
import { useNavigate } from 'react-router-dom';

interface Props {
  offer: OffersInterface;
}

const OfferRow = ({ offer }: Props) => {
  const [status, setStatus] = useState('');
  const theme = useTheme();
  const { attributes, setNodeRef, transform, transition, listeners } = useSortable({ id: offer.id });
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleError = (err: any) => {
    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }

    setStatus('');
  };

  const deleteOffer = useDeleteOffer(() => setStatus(''), handleError);
  const updateOffer = useCreateOffer();

  const style = { transform: CSS.Transform.toString(transform), transition };

  const handleDelete = () => {
    setStatus('Deleting');

    deleteOffer.mutate(offer.id);
  };

  const handleToggle = () => {
    const status = offer.status === 'active' ? 'inactive' : 'active';

    updateOffer.mutate({ ...offer, status });
  };

  return (
    <ListItem disableGutters disablePadding ref={setNodeRef} divider {...attributes} style={style}>
      <Modal
        open={status === 'Confirm Delete'}
        title='Are you sure you want to delete this offer?'
        submit={handleDelete}
        cancel={() => setStatus('')}
        submitText='Yes'
        cancelText='No'
      />

      <IconButton size='small' {...listeners}>
        <Icon path={mdiDragHorizontalVariant} size={1} />
      </IconButton>

      <ListItemButton onClick={() => navigate('/offers/create', { state: { offerId: offer.id } })}>
        <ListItemText primary={offer.url} secondary={offer.name} />
      </ListItemButton>

      <Switch color='success' checked={offer.status === 'active'} onChange={handleToggle} />

      {status === 'Deleting' ? (
        <CircularProgress size={20} />
      ) : (
        <IconButton size='small' sx={{ ml: 1 }} onClick={() => setStatus('Confirm Delete')}>
          <Icon path={mdiTrashCan} size={1} color={theme.palette.error.main} />
        </IconButton>
      )}
    </ListItem>
  );
};

export default OfferRow;
