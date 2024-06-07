import { Box, TextField } from '@mui/material';
import { ProductDiscountsInterface } from '../../../../../_shared/types';
import { Modal } from '../../../../_shared/components';
import { FormEvent, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useCreateProductDiscount } from '../../../../_shared/api';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';

interface Props {
  cancel: () => void;
  discount?: ProductDiscountsInterface;
}

const CreateDiscounts = ({ cancel, discount }: Props) => {
  const [status, setStatus] = useState('');
  const params = useParams();
  const { id, productId } = params;
  const [form, setForm] = useState<ProductDiscountsInterface>({
    id: '',
    amount: 0,
    amountType: 'fixed',
    productId: productId || id!,
    startsAt: null,
    endsAt: '',
    createdAt: '',
    updatedAt: '',
    status: 'active'
  });
  const { enqueueSnackbar } = useSnackbar();

  const handleSuccess = () => {
    enqueueSnackbar(discount ? 'Discount updated' : 'Discount created', { variant: 'success' });

    cancel();
  };

  const handleError = (err: any) => {
    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }

    setStatus('');
  };

  const createDiscount = useCreateProductDiscount(handleSuccess, handleError);

  useEffect(() => {
    if (discount) {
      setForm({ ...discount });
    }
  }, [discount]);

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();

    setStatus('Loading');

    createDiscount.mutate(form);
  };

  return (
    <Modal
      open
      title={discount ? 'Edit Discount' : 'Create Discount'}
      cancel={cancel}
      submit={handleSubmit}
      disableBackdropClick
      component='form'
      loading={status === 'Loading'}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.25 }}>
        <TextField
          label='Amount'
          type='number'
          required
          autoFocus
          onChange={(e) => setForm({ ...form, amount: e.target.value as unknown as number })}
          value={form.amount}
          InputProps={{
            startAdornment: form.amountType === 'fixed' ? '$' : undefined,
            endAdornment: form.amountType === 'percentage' ? '%' : undefined
          }}
          sx={{ width: '75%', mr: 1, mb: '0 !important' }}
        />

        <TextField
          label='Amount Type'
          required
          select
          SelectProps={{ native: true }}
          value={form.amountType}
          onChange={(e) => setForm({ ...form, amountType: e.target.value })}
          sx={{ mb: '0 !important', width: '25%' }}
        >
          <option value='fixed'>$</option>
          <option value='percentage'>%</option>
        </TextField>
      </Box>

      <TextField
        type='date'
        label='Starts At'
        value={dayjs(form.startsAt).format('YYYY-MM-DD')}
        onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        type='date'
        label='Ends At'
        value={dayjs(form.endsAt).format('YYYY-MM-DD')}
        onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
        InputLabelProps={{ shrink: true }}
      />
    </Modal>
  );
};

export default CreateDiscounts;
