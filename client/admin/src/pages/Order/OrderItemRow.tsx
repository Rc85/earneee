import {
  TableRow,
  TableCell,
  Box,
  Typography,
  Chip,
  Popover,
  MenuItem,
  CircularProgress,
  TextField,
  Divider
} from '@mui/material';
import { OrderItemsInterface } from '../../../../../_shared/types';
import dayjs from 'dayjs';
import { grey } from '@mui/material/colors';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useRefundOrderItem, useUpdateOrderItem } from '../../../../_shared/api';
import { Modal } from '../../../../_shared/components';

interface Props {
  item: OrderItemsInterface;
}

const OrderItemRow = ({ item }: Props) => {
  const [status, setStatus] = useState('');
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const [refund, setRefund] = useState({ quantity: '1', reason: '' });

  const handleSuccess = (response: any) => {
    if (response.data.statusText) {
      enqueueSnackbar(response.data.statusText, { variant: 'success' });
    }

    setAnchorEl(null);
    setStatus('');
  };

  const handleError = (err: any) => {
    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }

    setAnchorEl(null);
    setStatus('');
  };

  const refundOrderItem = useRefundOrderItem(handleSuccess, handleError);
  const updateOrderItem = useUpdateOrderItem(handleSuccess, handleError);

  const handleUpdateOrderItem = (status: string) => {
    setStatus('Updating');

    updateOrderItem.mutate({ orderItem: { ...item, status } });
  };

  const handleRefund = () => {
    refundOrderItem.mutate({ orderItemId: item.id, ...refund });
  };

  return (
    <TableRow>
      <Modal
        open={status === 'Refund'}
        title='Refund Item'
        cancel={() => setStatus('')}
        submit={handleRefund}
        disableBackdropClick
      >
        <TextField
          label='Quantity'
          autoFocus
          required
          value={refund.quantity}
          onChange={(e) => setRefund({ ...refund, quantity: e.target.value })}
        />

        <TextField
          label='Reason'
          select
          SelectProps={{ native: true }}
          value={refund.reason}
          onChange={(e) => setRefund({ ...refund, reason: e.target.value })}
        >
          <option value=''></option>
          <option value='duplicate'>Duplicate</option>
          <option value='fraudulent'>Fraudulent</option>
        </TextField>
      </Modal>

      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ borderRadius: '4px', px: 0.5, py: 0.25, mr: 1, backgroundColor: grey[300] }}>
            <Typography sx={{ fontSize: 12, fontWeight: 500 }}>{item.quantity}</Typography>
          </Box>

          <Typography>{item.name}</Typography>

          {status === 'Updating' ? (
            <CircularProgress size={20} sx={{ ml: 1 }} />
          ) : (
            <Chip
              size='small'
              color={item.status === 'delivered' ? 'success' : item.status === 'shipped' ? 'info' : undefined}
              label={item.status}
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{ ml: 1 }}
            />
          )}

          <Popover
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <MenuItem onClick={() => handleUpdateOrderItem('processed')}>Processed</MenuItem>
            <MenuItem onClick={() => handleUpdateOrderItem('shipped')}>Shipped</MenuItem>
            <MenuItem onClick={() => handleUpdateOrderItem('delivered')}>Delivered</MenuItem>
            <MenuItem onClick={() => setStatus('Refund')}>Refund</MenuItem>
          </Popover>
        </Box>
        {item.product.variants?.[0] && (
          <Typography color='GrayText'>{item.product.variants?.[0]?.name}</Typography>
        )}

        {item.product.options?.map((option) => (
          <Box key={option.id} sx={{ ml: 2 }}>
            <Typography variant='body2' color='GrayText'>
              {option.name}
            </Typography>

            {option.selections?.map((selection) => (
              <Typography key={selection.id} variant='body2' color='GrayText'>
                &bull; {selection.name}
              </Typography>
            ))}
          </Box>
        ))}

        {item.shipment && (
          <Typography variant='body2' color='GrayText' sx={{ mt: 1 }}>
            {item.shipment.shippingProvider} &bull; {item.shipment.trackingNumber}
            {item.shipment.eta ? ` \u2022 ETA ${dayjs(item.shipment.eta).format('YYYY-MM-DD')}` : ''}
          </Typography>
        )}

        {item.refunds && item.refunds.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />

            {item.refunds?.map((refund) => (
              <Typography key={refund.id} variant='body2' color='error.main'>
                Refund &bull; {refund.quantity} x ${refund.amount.toFixed(2)}
                {refund.reference ? ` \u2022 Reference: ${refund.reference}` : ''}
              </Typography>
            ))}
          </>
        )}
      </TableCell>

      <TableCell>
        <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>

        <Typography variant='body2' color='GrayText'>
          ${item.price.toFixed(2)} each
        </Typography>
      </TableCell>
    </TableRow>
  );
};

export default OrderItemRow;
