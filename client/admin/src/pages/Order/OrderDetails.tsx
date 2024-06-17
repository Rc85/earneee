import { useParams } from 'react-router-dom';
import { Loading, Modal, Section } from '../../../../_shared/components';
import { useState } from 'react';
import { retrieveOrder, useUpdateOrder } from '../../../../_shared/api';
import dayjs from 'dayjs';
import {
  Box,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from '@mui/material';
import Stripe from 'stripe';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import { mdiCheck } from '@mdi/js';
import Icon from '@mdi/react';
import OrderItemRow from './OrderItemRow';

const OrderDetails = () => {
  const params = useParams();
  const { orderId } = params;
  const { isLoading, data } = retrieveOrder({ orderId });
  const { order } = data || {};
  const [status, setStatus] = useState('');
  const paymentIntent = order?.details?.payment_intent as Stripe.PaymentIntent;
  const paymentMethod = paymentIntent?.payment_method as Stripe.PaymentMethod;
  const latestCharge = paymentIntent?.latest_charge as Stripe.Charge;
  const balanceTransaction = latestCharge?.balance_transaction as Stripe.BalanceTransaction;
  const subtotal = order?.items.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;
  const tax = (order?.details?.total_details?.amount_tax || 0) / 100;
  const { enqueueSnackbar } = useSnackbar();
  const pendingOrderItems = order?.items.filter((item) => !item.shipment) || [];
  const disabledFulfill = pendingOrderItems.length > 0;

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
  };

  const updateOrder = useUpdateOrder(handleSuccess, handleError);

  const handleFulfill = () => {
    if (order) {
      setStatus('Fulfilling');

      updateOrder.mutate({ order: { ...order, status: 'fulfilled' } });
    }
  };

  return isLoading ? (
    <Loading />
  ) : (
    <Section
      title={`Order ${order?.number}`}
      subtitle={`${dayjs(order?.createdAt).format('YYYY-MM-DD h:mm A')} \u2022 ${order?.status}`}
      titleVariant='h3'
      position='center'
      maxWidth='md'
      actions={[
        order?.status !== 'fulfilled' ? (
          <LoadingButton
            key='fulfill'
            variant='contained'
            loading={status === 'Fulfilling'}
            loadingIndicator={<CircularProgress size={20} />}
            loadingPosition='start'
            startIcon={<Icon path={mdiCheck} size={1} />}
            color='success'
            onClick={() => setStatus('Confirm Fulfill')}
            disabled={disabledFulfill}
          >
            Fulfill
          </LoadingButton>
        ) : null
      ]}
      sx={{ p: 2 }}
    >
      <Modal
        open={status === 'Confirm Fulfill'}
        title='Are you sure you want to fulfill this order?'
        subtitle='All products will be marked as delivered'
        submit={handleFulfill}
        cancel={() => setStatus('')}
      />

      <Typography variant='h6' sx={{ mb: 0 }}>
        Customer
      </Typography>

      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography>Customer name</Typography>
              </TableCell>

              <TableCell>
                <Typography>{order?.details?.customer_details?.name}</Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography>Customer email</Typography>
              </TableCell>

              <TableCell>
                <Typography>{order?.details?.customer_details?.email}</Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography>Address</Typography>
              </TableCell>

              <TableCell>
                <Typography>{order?.details?.customer_details?.address?.line1}</Typography>

                <Typography>{order?.details?.customer_details?.address?.line2}</Typography>

                <Typography>
                  {order?.details?.customer_details?.address?.city},{' '}
                  {order?.details?.customer_details?.address?.state}{' '}
                  {order?.details?.customer_details?.address?.country},{' '}
                  {order?.details?.customer_details?.address?.postal_code}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
        <Typography variant='h6' sx={{ mb: 0, flexGrow: 1 }}>
          Payment
        </Typography>

        <Chip
          size='small'
          color={balanceTransaction.status === 'available' ? 'success' : undefined}
          label={balanceTransaction.status === 'available' ? 'Payment received' : 'Pending'}
          sx={{ ml: 1 }}
        />
      </Box>

      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography>Card brand</Typography>
              </TableCell>

              <TableCell>
                <Typography>{paymentMethod.card?.brand}</Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography>Card number</Typography>
              </TableCell>

              <TableCell>
                <Typography>**** **** **** {paymentMethod.card?.last4}</Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography>Card expiration</Typography>
              </TableCell>

              <TableCell>
                <Typography>
                  {paymentMethod.card?.exp_month} / {paymentMethod.card?.exp_year}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant='h6' sx={{ mt: 3 }}>
        Order details
      </Typography>

      <TableContainer>
        <Table>
          <TableBody>
            {order?.items.map((item) => (
              <OrderItemRow key={item.id} item={item} />
            ))}

            <TableRow>
              <TableCell>
                <Typography sx={{ textAlign: 'right' }}>Subtotal</Typography>
              </TableCell>

              <TableCell>
                <Typography>${subtotal.toFixed(2)}</Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography sx={{ textAlign: 'right' }}>Tax</Typography>
              </TableCell>

              <TableCell>
                <Typography>${tax.toFixed(2)}</Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography sx={{ textAlign: 'right' }}>Total</Typography>
              </TableCell>

              <TableCell>
                <Typography>${(subtotal + tax).toFixed(2)}</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Section>
  );
};

export default OrderDetails;
