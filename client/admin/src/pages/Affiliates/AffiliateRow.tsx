import {
  Avatar,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
  useTheme
} from '@mui/material';
import { Icon } from '@mdi/react';
import { mdiTrashCan } from '@mdi/js';
import { useState } from 'react';
import { Modal } from '../../../../_shared/components';
import { useNavigate } from 'react-router-dom';
import { AffiliatesInterface } from '../../../../../_shared/types';
import { useAddAffiliate, useDeleteAffiliate } from '../../../../_shared/api';

interface Props {
  affiliate: AffiliatesInterface;
}

const AffiliateRow = ({ affiliate }: Props) => {
  const theme = useTheme();
  const [status, setStatus] = useState('');
  const [deleteAllProducts, setDeleteAllProducts] = useState(false);
  const navigate = useNavigate();
  const updateAffiliate = useAddAffiliate();
  const deleteAffiliate = useDeleteAffiliate(
    () => setStatus(''),
    () => setStatus('')
  );

  const handleToggle = () => {
    const status = affiliate.status === 'active' ? 'inactive' : 'active';

    updateAffiliate.mutate({ ...affiliate, status });
  };

  const handleDelete = () => {
    setStatus('Deleting');

    const options: { affiliateId: string; deleteAllProducts?: boolean } = { affiliateId: affiliate.id };

    if (deleteAllProducts) {
      options.deleteAllProducts = true;
    }

    deleteAffiliate.mutate(options);
  };

  return (
    <ListItem disableGutters disablePadding divider>
      <Modal
        open={status === 'Confirm Delete'}
        title='Are you sure want to delete this affiliate?'
        submit={handleDelete}
        cancel={() => setStatus('')}
      >
        <FormControlLabel
          label='Delete all products that belong to this affiliate'
          control={<Checkbox color='info' />}
          checked={deleteAllProducts}
          onChange={() => setDeleteAllProducts(!deleteAllProducts)}
        />
      </Modal>

      <ListItemIcon>
        <Avatar src={affiliate.logoUrl || '/broken.jpg'} alt={affiliate.name} />
      </ListItemIcon>

      <ListItemButton onClick={() => navigate('/affiliates/add', { state: { affiliateId: affiliate.id } })}>
        <ListItemText primary={affiliate.name} />
      </ListItemButton>

      <Switch color='success' checked={affiliate.status === 'active'} onClick={handleToggle} />

      {status === 'Deleting' ? (
        <CircularProgress size={20} />
      ) : (
        <IconButton size='small' onClick={() => setStatus('Confirm Delete')} sx={{ ml: 1 }}>
          <Icon path={mdiTrashCan} size={1} color={theme.palette.error.main} />
        </IconButton>
      )}
    </ListItem>
  );
};

export default AffiliateRow;
