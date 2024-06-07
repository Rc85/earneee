import { Box, Checkbox, FormControlLabel, InputAdornment, TextField } from '@mui/material';
import { ProductDiscountsInterface } from '../../../../../_shared/types';
import { Modal } from '../../../../_shared/components';
import { FormEvent, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { generateKey } from '../../../../../_shared/utils';

interface Props {
  cancel: () => void;
  submit: (discount: ProductDiscountsInterface) => void;
  discount?: ProductDiscountsInterface;
}

const CreateDiscount = ({ submit, cancel, discount }: Props) => {
  const [form, setForm] = useState<ProductDiscountsInterface>({
    id: generateKey(1),
    amount: 0,
    amountType: 'fixed',
    productUrlId: '',
    startsAt: dayjs().format('YYYY-MM-DD'),
    endsAt: null,
    createdAt: '',
    updatedAt: '',
    limitedTimeOnly: false,
    status: 'active'
  });

  useEffect(() => {
    if (discount) {
      setForm({ ...discount });
    }
  }, [discount]);

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();

    submit(form);
  };

  return (
    <Modal
      open
      title={discount ? 'Edit Discount' : 'Create Discount'}
      cancel={cancel}
      submit={handleSubmit}
      disableBackdropClick
      component='form'
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
            startAdornment:
              form.amountType === 'fixed' ? <InputAdornment position='start'>$</InputAdornment> : undefined,
            endAdornment:
              form.amountType === 'percentage' ? <InputAdornment position='end'>%</InputAdornment> : undefined
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

      <FormControlLabel
        label='Limited Time Only'
        checked={form.limitedTimeOnly}
        onChange={() => setForm({ ...form, limitedTimeOnly: !form.limitedTimeOnly })}
        control={<Checkbox color='info' />}
        sx={{ mb: 1.25 }}
      />

      <TextField
        type='date'
        label='Starts At'
        value={dayjs(form.startsAt).format('YYYY-MM-DD')}
        onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
        InputLabelProps={{ shrink: true }}
      />

      {!form.limitedTimeOnly && (
        <TextField
          type='date'
          label='Ends At'
          value={dayjs(form.endsAt).format('YYYY-MM-DD')}
          onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
          InputLabelProps={{ shrink: true }}
        />
      )}
    </Modal>
  );
};

export default CreateDiscount;
