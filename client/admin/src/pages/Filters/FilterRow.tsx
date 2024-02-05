import {
  CircularProgress,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme
} from '@mui/material';
import { ProductFiltersInterface } from '../../../../_shared/types';
import { Icon } from '@mdi/react';
import { mdiTrashCan } from '@mdi/js';
import { useContext, useState } from 'react';
import { Modal } from '../../../../_shared/components';
import { SupabaseContext } from '../../../../_shared/components/SupabaseProvider/SupabaseProvider';
import { useNavigate } from 'react-router-dom';

interface Props {
  filter: ProductFiltersInterface;
}

const FilterRow = ({ filter }: Props) => {
  const theme = useTheme();
  const [status, setStatus] = useState('');
  const { supabase } = useContext(SupabaseContext);
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (supabase) {
      setStatus('Loading');

      await supabase.from('product_filters').delete().eq('id', filter.id);

      setStatus('');
    }
  };

  return (
    <ListItem disableGutters disablePadding divider>
      <Modal
        open={status === 'Confirm Delete'}
        title='Are you sure you want to delete this filter?'
        submit={handleDelete}
        cancel={() => setStatus('')}
        cancelText='No'
        submitText='Yes'
      />

      <ListItemButton onClick={() => navigate('/filters/create', { state: { filter } })}>
        <ListItemText
          primary={filter.name}
          secondary={`${filter.type} ${filter.scope ? `\u2022 ${filter.scope}` : ''}`}
        />
      </ListItemButton>

      {status === 'Loading' ? (
        <CircularProgress size={20} />
      ) : (
        <IconButton size='small' sx={{ ml: 1 }} onClick={() => setStatus('Confirm Delete')}>
          <Icon path={mdiTrashCan} size={1} color={theme.palette.error.main} />
        </IconButton>
      )}
    </ListItem>
  );
};

export default FilterRow;
