import { mdiPencil, mdiTrashCan, mdiUndo } from '@mdi/js';
import Icon from '@mdi/react';
import { Paper, Box, Typography, IconButton, Chip, Button, Switch } from '@mui/material';
import dayjs from 'dayjs';
import { ProductDiscountsInterface } from '../../../../../_shared/types';
import { useState } from 'react';
import CreateDiscount from './CreateDiscount';

interface Props {
  discount: ProductDiscountsInterface;
  submit: (discount: ProductDiscountsInterface) => void;
  remove: () => void;
}

const Discount = ({ remove, discount, submit }: Props) => {
  const [status, setStatus] = useState('');

  const handleSubmit = (discount: ProductDiscountsInterface) => {
    submit(discount);

    setStatus('');
  };

  const handleDeleteClick = () => {
    if (!discount.createdAt) {
      remove();
    } else {
      submit({ ...discount, status: 'deleted' });
    }

    setStatus('');
  };

  const handleUndoClick = () => {
    submit({ ...discount, status: 'active' });

    setStatus('');
  };

  const handleToggle = () => {
    const status = discount.status === 'active' ? 'inactive' : 'active';

    submit({ ...discount, status });
  };

  return (
    <Paper variant='outlined' sx={{ display: 'flex', alignItems: 'flex-start', p: 2, mb: 1 }}>
      {status === 'Edit' && (
        <CreateDiscount discount={{ ...discount }} cancel={() => setStatus('')} submit={handleSubmit} />
      )}

      <Box sx={{ flexGrow: 1 }}>
        <Typography>
          {discount.amountType === 'fixed' ? '$' : ''}
          {discount.amount}
          {discount.amountType === 'percentage' ? '%' : ''}
        </Typography>

        {discount.startsAt && <Typography>Starts {dayjs(discount.startsAt).format('YYYY-MM-DD')}</Typography>}
        {!discount.limitedTimeOnly ? (
          discount.endsAt && <Typography>Ends {dayjs(discount.endsAt).format('YYYY-MM-DD')}</Typography>
        ) : (
          <Typography>Limited Time Only</Typography>
        )}
      </Box>

      {discount.status === 'deleted' ? (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Chip size='small' label='To be deleted' sx={{ mb: 1 }} />

          <Button startIcon={<Icon path={mdiUndo} size={1} />} onClick={handleUndoClick}>
            Undo
          </Button>
        </Box>
      ) : (
        <Box sx={{ flexShrink: 0, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton size='small' onClick={() => setStatus('Edit')}>
            <Icon path={mdiPencil} size={1} />
          </IconButton>

          <IconButton size='small' color='error' onClick={handleDeleteClick}>
            <Icon path={mdiTrashCan} size={1} />
          </IconButton>

          <Switch color='success' checked={discount.status === 'active'} onChange={handleToggle} />
        </Box>
      )}
    </Paper>
  );
};

export default Discount;
