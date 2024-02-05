import {
  Avatar,
  CircularProgress,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
  useTheme
} from '@mui/material';
import { ProductBrandsInterface } from '../../../../_shared/types';
import { Icon } from '@mdi/react';
import { mdiTrashCan } from '@mdi/js';
import { useContext, useState } from 'react';
import { SupabaseContext } from '../../../../_shared/components/SupabaseProvider/SupabaseProvider';
import { Modal } from '../../../../_shared/components';
import { useNavigate } from 'react-router-dom';

interface Props {
  brand: ProductBrandsInterface;
}

const ProductBrandRow = ({ brand }: Props) => {
  const theme = useTheme();
  const [status, setStatus] = useState('');
  const { supabase } = useContext(SupabaseContext);
  const navigate = useNavigate();

  const handleToggle = async () => {
    if (supabase) {
      const status = brand.status === 'active' ? 'inactive' : 'active';

      await supabase.from('product_brands').update({ status }).eq('id', brand.id);
    }
  };

  const handleDelete = async () => {
    if (supabase) {
      setStatus('Deleting');

      if (brand.logo_path) {
        await supabase.storage.from('product_brands').remove([brand.logo_path]);
      }

      await supabase.from('product_brands').delete().eq('id', brand.id);

      setStatus('');
    }
  };

  return (
    <ListItem disableGutters disablePadding divider>
      <Modal
        open={status === 'Confirm Delete'}
        title='Are you sure you want to delete this brand?'
        submit={handleDelete}
        cancel={() => setStatus('')}
        submitText='Yes'
        cancelText='No'
      />

      <ListItemButton onClick={() => navigate('/brand/create', { state: { brand } })}>
        {brand.logo_url && (
          <ListItemIcon>
            <Avatar src={brand.logo_url} />
          </ListItemIcon>
        )}

        <ListItemText primary={brand.name} />
      </ListItemButton>

      <Switch color='success' checked={brand.status === 'active'} sx={{ mr: 1 }} onChange={handleToggle} />

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

export default ProductBrandRow;
