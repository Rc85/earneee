import {
  CircularProgress,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme
} from '@mui/material';
import { ProductSpecificationsInterface } from '../../../../_shared/types';
import { Icon } from '@mdi/react';
import { mdiTrashCan } from '@mdi/js';
import { useContext, useState } from 'react';
import { Modal } from '../../../../_shared/components';
import { SupabaseContext } from '../../../../_shared/components/SupabaseProvider/SupabaseProvider';
import AddSpecification from './AddSpecification';

interface Props {
  specification: ProductSpecificationsInterface;
}

const SpecificationRow = ({ specification }: Props) => {
  const [status, setStatus] = useState('');
  const theme = useTheme();
  const { supabase } = useContext(SupabaseContext);

  const handleSubmit = async () => {
    if (supabase) {
      setStatus('Deleting');

      await supabase.from('product_specifications').delete().eq('id', specification.id);

      setStatus('');
    }
  };

  return (
    <ListItem disableGutters disablePadding divider>
      <Modal
        open={status === 'Confirm Delete'}
        title='Are you sure you want to delete this spec?'
        submit={handleSubmit}
        cancel={() => setStatus('')}
        submitText='Yes'
        cancelText='No'
      />

      {status === 'Edit' && <AddSpecification cancel={() => setStatus('')} specification={specification} />}

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
