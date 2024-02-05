import {
  CircularProgress,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  Switch,
  useTheme
} from '@mui/material';
import { ProductVariantsInterface } from '../../../../../_shared/types';
import { Icon } from '@mdi/react';
import { mdiDragHorizontalVariant, mdiTrashCan } from '@mdi/js';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useContext, useState } from 'react';
import { Modal } from '../../../../_shared/components';
import { SupabaseContext } from '../../../../_shared/components/SupabaseProvider/SupabaseProvider';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

interface Props {
  variant: ProductVariantsInterface;
  onEdit: (variant: ProductVariantsInterface) => void;
  loading: boolean;
}

const VariantRow = ({ variant, onEdit, loading }: Props) => {
  const [status, setStatus] = useState('');
  const theme = useTheme();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: variant.id });
  const { supabase } = useContext(SupabaseContext);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const style = { transform: CSS.Transform.toString(transform), transition };

  const handleToggle = () => {
    const status = variant.status === 'available' ? 'unavailable' : 'available';

    variant.status = status;

    onEdit(variant);
  };

  const handleDelete = async () => {
    if (supabase) {
      setStatus('Deleting');

      const response = await supabase.from('product_variants').delete().eq('id', variant.id);

      setStatus('');

      if (response.error) {
        return enqueueSnackbar(response.error.message, { variant: 'error' });
      }
    }
  };

  return (
    <>
      <Modal
        open={status === 'Confirm Delete'}
        title='Are you sure you want to delete this variant?'
        subtitle={`All options in this variant will also be deleted. This action cannot be reverted.`}
        submit={handleDelete}
        cancel={() => setStatus('')}
        submitText='Yes'
        cancelText='No'
      />

      <ListItem disableGutters disablePadding divider style={style} {...attributes} ref={setNodeRef}>
        <IconButton {...listeners} size='small'>
          <Icon path={mdiDragHorizontalVariant} size={1} />
        </IconButton>

        <ListItemButton
          disabled={loading}
          onClick={() => navigate(`/product/${variant.product_id}/variant/${variant.id}`)}
        >
          <ListItemText primary={variant.name} />
        </ListItemButton>

        {loading && <CircularProgress size={20} sx={{ mx: 1 }} />}

        <Switch
          color='success'
          checked={variant.status === 'available'}
          sx={{ mx: 1 }}
          disabled={loading}
          onChange={handleToggle}
        />

        <IconButton size='small' disabled={loading} onClick={() => setStatus('Confirm Delete')}>
          <Icon
            path={mdiTrashCan}
            size={1}
            color={theme.palette.error.main}
            style={{ opacity: loading ? 0.5 : 1 }}
          />
        </IconButton>
      </ListItem>
    </>
  );
};

export default VariantRow;
