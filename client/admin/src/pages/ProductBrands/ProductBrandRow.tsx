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
import { ProductBrandsInterface } from '../../../../../_shared/types';
import { Icon } from '@mdi/react';
import { mdiTrashCan } from '@mdi/js';
import { useState } from 'react';
import { Modal } from '../../../../_shared/components';
import { useNavigate } from 'react-router-dom';
import { useCreateProductBrand, useDeleteProductBrand } from '../../../../_shared/api';

interface Props {
  brand: ProductBrandsInterface;
}

const ProductBrandRow = ({ brand }: Props) => {
  const theme = useTheme();
  const [status, setStatus] = useState('');
  const navigate = useNavigate();
  const updateBrand = useCreateProductBrand();
  const deleteBrand = useDeleteProductBrand(
    () => setStatus(''),
    () => setStatus('')
  );

  const handleToggle = () => {
    const status = brand.status === 'active' ? 'inactive' : 'active';

    updateBrand.mutate({ ...brand, status });
  };

  const handleDelete = () => {
    setStatus('Deleting');

    deleteBrand.mutate(brand.id);
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

      <ListItemButton onClick={() => navigate('/brand/create', { state: { brandId: brand.id } })}>
        <ListItemIcon>
          <Avatar src={brand.logoUrl || '/broken.jpg'} alt={brand.name} />
        </ListItemIcon>

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
