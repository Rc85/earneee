import { mdiTrashCan } from '@mdi/js';
import Icon from '@mdi/react';
import { ListItem, ListItemButton, ListItemText, IconButton, Switch, CircularProgress } from '@mui/material';
import dayjs from 'dayjs';
import { ProductDiscountsInterface } from '../../../../../_shared/types';
import { useState } from 'react';
import CreateDiscounts from './CreateDiscounts';
import { useCreateProductDiscount, useDeleteProductDiscount } from '../../../../_shared/api';
import { Modal } from '../../../../_shared/components';
import { useSnackbar } from 'notistack';

interface Props {
  discount: ProductDiscountsInterface;
}

const DiscountRow = ({ discount }: Props) => {
  const [status, setStatus] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const handleSuccess = () => {
    setStatus('');
  };

  const handleError = (err: any) => {
    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }

    setStatus('');
  };

  const deleteDiscount = useDeleteProductDiscount(handleSuccess, handleError);
  const updateDiscount = useCreateProductDiscount();

  const handleToggle = () => {
    const productDiscount = { ...discount };

    productDiscount.status = productDiscount.status === 'active' ? 'inactive' : 'active';

    updateDiscount.mutate(productDiscount);
  };

  const handleDelete = () => {
    setStatus('Deleting');

    deleteDiscount.mutate({ id: discount.id });
  };

  return (
    <>
      {status === 'Edit' && <CreateDiscounts cancel={() => setStatus('')} discount={discount} />}

      <Modal
        open={status === 'Confirm Delete'}
        title='Are you sure you want to delete this discount?'
        subtitle={'This action cannot be reverted'}
        submit={handleDelete}
        cancel={() => setStatus('')}
        submitText='Yes'
        cancelText='No'
      />

      <ListItem disablePadding disableGutters divider>
        <ListItemButton onClick={() => setStatus('Edit')}>
          <ListItemText
            primary={`${discount.amountType === 'fixed' ? '$' : ''}${discount.amount}${
              discount.amountType === 'percentage' ? '%' : ''
            }`}
            secondary={`${
              discount.startsAt
                ? `From ${dayjs(discount.startsAt).format('YYYY-MM-DD')}${discount.endsAt ? ' to' : ''}`
                : ''
            } ${discount.endsAt ? `${dayjs(discount.endsAt).format('YYYY-MM-DD')}` : ''}`}
          />
        </ListItemButton>

        {status === 'Deleting' ? (
          <CircularProgress size={20} />
        ) : (
          <IconButton size='small' color='error' onClick={() => setStatus('Confirm Delete')}>
            <Icon path={mdiTrashCan} size={1} />
          </IconButton>
        )}

        <Switch color='success' checked={discount.status === 'active'} onChange={handleToggle} />
      </ListItem>
    </>
  );
};

export default DiscountRow;
