import { IconButton, ListItem, ListItemButton, ListItemText, Switch, useTheme } from '@mui/material';
import { ProductsInterface } from '../../../../_shared/types';
import { Icon } from '@mdi/react';
import { mdiChevronRight, mdiTrashCan } from '@mdi/js';
import { useContext, useState } from 'react';
import { SupabaseContext } from '../../../../_shared/components/SupabaseProvider/SupabaseProvider';
import { Modal } from '../../../../_shared/components';
import { useNavigate } from 'react-router-dom';

interface Props {
  product: ProductsInterface;
}

const ProductRow = ({ product }: Props) => {
  const theme = useTheme();
  const [status, setStatus] = useState('');
  const { supabase } = useContext(SupabaseContext);
  const navigate = useNavigate();

  const handleToggle = async () => {
    if (supabase) {
      setStatus('Loading');

      const status = product.status === 'available' ? 'unavailable' : 'available';

      await supabase.from('products').update({ status }).eq('id', product.id);

      setStatus('');
    }
  };

  const handleDeleteClick = () => {
    setStatus('Confirm Delete');
  };

  const handleDelete = async () => {
    if (supabase) {
      await supabase.from('products').delete().eq('id', product.id);
    }
  };

  const handleCancel = () => {
    setStatus('');
  };

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <ListItem disableGutters disablePadding divider>
      <Modal
        open={status === 'Confirm Delete'}
        title='Are you sure you want to delete this product?'
        subtitle={`This action cannot be reverted.`}
        submit={handleDelete}
        cancel={handleCancel}
        submitText='Yes'
        cancelText='No'
      />

      <ListItemButton onClick={handleClick}>
        <ListItemText primary={product.name} />
      </ListItemButton>

      <Switch
        sx={{ mx: 1 }}
        color='success'
        onChange={handleToggle}
        checked={product.status === 'available'}
      />

      <IconButton size='small' onClick={handleDeleteClick} sx={{ mr: 1 }}>
        <Icon path={mdiTrashCan} size={1} color={theme.palette.error.main} />
      </IconButton>

      <Icon path={mdiChevronRight} size={1} />
    </ListItem>
  );
};

export default ProductRow;
