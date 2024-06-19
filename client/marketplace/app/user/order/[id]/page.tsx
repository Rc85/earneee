'use client';

import {
  Box,
  Chip,
  CircularProgress,
  Link,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import { retrieveUserOrder, useCreateRefund } from '../../../../../_shared/api';
import { Loading, Modal, Section } from '../../../../../_shared/components';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { OrderItemsInterface } from '../../../../../../_shared/types';

interface Props {
  params: { id: string };
}

const page = ({ params: { id } }: Props) => {
  const { isLoading, data } = retrieveUserOrder({ orderId: id });
  const { order } = data || {};

  return isLoading ? (
    <Loading />
  ) : (
    <Section
      title={`Order ${order?.number}`}
      subtitle={`${dayjs(order?.createdAt).format('YYYY-MM-DD h:mm A')} \u2022 ${order?.status}`}
      titleVariant='h6'
      actions={
        Boolean(order?.receiptUrl)
          ? [
              <Link key='receipt' href={order?.receiptUrl!} target='_blank'>
                View receipt
              </Link>
            ]
          : undefined
      }
      sx={{ px: 2 }}
    >
      <Typography sx={{ mb: 3 }}>
        Once the products are shipped, you will receive a tracking number for each shipment. If you need to
        return a product, please refer to our <Link>FAQ</Link> for instructions on how to return products.
      </Typography>

      <List disablePadding>
        {order?.items.map((item) => (
          <OrderItemRow key={item.id} item={item} />
        ))}
      </List>
    </Section>
  );
};

const OrderItemRow = ({ item }: { item: OrderItemsInterface }) => {
  const [status, setStatus] = useState('');
  const [refund, setRefund] = useState({ quantity: '1', reason: '' });
  const refunded = item.refunds?.reduce((acc, refund) => acc + refund.quantity, 0) || 0;
  const { enqueueSnackbar } = useSnackbar();

  const handleSuccess = (response: any) => {
    if (response.data.statusText) {
      enqueueSnackbar(response.data.statusText, { variant: 'success' });
    }

    setStatus('');
  };

  const handleError = (err: any) => {
    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }

    setStatus('');
  };

  const createRefund = useCreateRefund(handleSuccess, handleError);

  const handleRefund = () => {
    setStatus('Creating Refund');

    createRefund.mutate({ orderItemId: item.id, ...refund });
  };

  return (
    <ListItem disableGutters disablePadding divider sx={{ alignItems: 'flex-start' }}>
      <Modal
        open={status === 'Refund'}
        title='Request Refund'
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
          value={refund.reason}
          onChange={(e) => setRefund({ ...refund, reason: e.target.value })}
        />
      </Modal>

      <Box sx={{ flexGrow: 1 }}>
        <ListItemText
          primary={item.name}
          secondary={`${item.quantity}x $${item.price.toFixed(2)}${
            item.product.variants?.[0] ? ` \u2022 ${item.product.variants[0].name}` : ''
          }`}
        />

        {item.shipment && (
          <Box sx={{ mt: 1 }}>
            <Typography variant='body2' color='GrayText'>
              Shipping provider: {item.shipment.shippingProvider}
            </Typography>

            <Typography variant='body2' color='GrayText'>
              Tracking #: {item.shipment.trackingNumber}
            </Typography>

            {item.shipment.eta && (
              <Typography variant='body2' color='GrayText'>
                ETA {dayjs(item.shipment.eta).format('YYYY-MM-DD')}
              </Typography>
            )}
          </Box>
        )}

        {status === 'Creating Refund' ? (
          <CircularProgress size={20} />
        ) : (
          refunded < item.quantity && (
            <Typography variant='body2'>
              <Link onClick={() => setStatus('Refund')}>Request refund</Link>
            </Typography>
          )
        )}

        {item.refunds && item.refunds.length > 0 && (
          <Paper variant='outlined' sx={{ p: 1, mb: 1 }}>
            {item.refunds?.map((refund) => (
              <Box key={refund.id}>
                <Typography variant='body2' color='error.main'>
                  {refund.status === 'complete'
                    ? 'Refund issued'
                    : refund.status === 'declined'
                    ? 'Refund declined'
                    : 'Refund requested'}{' '}
                  &bull; {refund.quantity} x ${refund.amount.toFixed(2)}
                  {refund.reference ? ` \u2022 Reference: ${refund.reference}` : ''}
                </Typography>

                {refund.notes && <Typography variant='body2'>Notes: {refund.notes}</Typography>}

                {refund.photos?.map((photo, i) => (
                  <Link key={photo.id} href={photo.url} target='_blank' sx={{ display: 'block' }}>
                    <Typography variant='body2'>Photo #{i + 1}</Typography>
                  </Link>
                ))}
              </Box>
            ))}
          </Paper>
        )}
      </Box>

      <Chip
        size='small'
        label={item.status}
        color={item.status === 'delivered' ? 'success' : undefined}
        sx={{ ml: 1, my: 1 }}
      />
    </ListItem>
  );
};

export default page;
