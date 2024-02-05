import { IconButton, ListItem, ListItemButton, ListItemText, Switch, useTheme } from '@mui/material';
import { OffersInterface } from '../../../../_shared/types';
import { useContext, useState } from 'react';
import EditOffer from './EditOffer';
import { Icon } from '@mdi/react';
import { mdiDragHorizontalVariant, mdiTrashCan } from '@mdi/js';
import { SupabaseContext } from '../../../../_shared/components/SupabaseProvider/SupabaseProvider';
import { Modal } from '../../../../_shared/components';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
  offer: OffersInterface;
}

const OfferRow = ({ offer }: Props) => {
  const [status, setStatus] = useState('');
  const theme = useTheme();
  const { supabase } = useContext(SupabaseContext);
  const { attributes, setNodeRef, transform, transition, listeners } = useSortable({ id: offer.id });

  const style = { transform: CSS.Transform.toString(transform), transition };

  const handleDelete = async () => {
    if (supabase) {
      if (offer.logo_path) {
        await supabase.storage.from('offers').remove([offer.logo_path]);
      }

      await supabase.from('offers').delete().eq('id', offer.id);
    }
  };

  const handleToggle = async () => {
    if (supabase) {
      const status = offer.status === 'active' ? 'inactive' : 'active';

      await supabase.from('offers').update({ status }).eq('id', offer.id);
    }
  };

  return (
    <ListItem disableGutters disablePadding ref={setNodeRef} divider {...attributes} style={style}>
      {status === 'Edit' && <EditOffer offer={offer} cancel={() => setStatus('')} />}

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

      <ListItemButton onClick={() => setStatus('Edit')}>
        <ListItemText primary={offer.name} />
      </ListItemButton>

      <Switch color='success' checked={offer.status === 'active'} onChange={handleToggle} />

      <IconButton size='small' sx={{ ml: 1 }} onClick={() => setStatus('Confirm Delete')}>
        <Icon path={mdiTrashCan} size={1} color={theme.palette.error.main} />
      </IconButton>
    </ListItem>
  );
};

export default OfferRow;
