'use client';

import { mdiCubeOff } from '@mdi/js';
import Icon from '@mdi/react';
import {
  Box,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Pagination,
  Typography
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { retrieveOrders } from '../../../../_shared/api';
import { Loading, Modal } from '../../../../_shared/components';
import { useState } from 'react';
import { OrdersInterface } from '../../../../../_shared/types';
import dayjs from 'dayjs';

const page = () => {
  const [page, setPage] = useState(0);
  const { isLoading, data } = retrieveOrders({ offset: page, limit: 20 });
  const { orders, count = 0 } = data || {};

  return isLoading ? (
    <Loading />
  ) : (
    <Box sx={{ px: 2, pb: 2, flexGrow: 1 }}>
      {orders && orders.length > 0 ? (
        <>
          <List disablePadding>
            {orders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </List>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={Math.ceil(count / 20)}
              page={page + 1}
              onChange={(_, page) => setPage(page - 1)}
            />
          </Box>
        </>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1 }}>
          <Icon path={mdiCubeOff} size={3} color={grey[500]} />

          <Typography>You have no orders</Typography>
        </Box>
      )}
    </Box>
  );
};

const OrderRow = ({ order }: { order: OrdersInterface }) => {
  const [status, setStatus] = useState('');

  const handleSubmit = () => {
    if (order.receiptUrl) {
      window.open(order.receiptUrl, '_blank');
    }
  };

  return (
    <ListItem disableGutters disablePadding divider>
      <Modal
        open={status === 'Show Details'}
        title={`Order ${order.number}`}
        submit={order.receiptUrl ? handleSubmit : undefined}
        subtitle={dayjs(order.updatedAt).format('YYYY-MM-DD h:mm A')}
        cancel={() => setStatus('')}
        submitText='View Receipt'
        cancelText='Close'
      >
        <Typography sx={{ mb: 3 }}>
          Once the products are shipped, you will receive a tracking number for each shipment.
        </Typography>

        <List disablePadding>
          {order.items.map((item) => (
            <ListItem key={item.id} disableGutters disablePadding divider>
              <ListItemText
                primary={item.name}
                secondary={`${item.quantity}x $${item.price.toFixed(2)}${
                  item.product.variants?.[0] ? ` \u2022 ${item.product.variants[0].name}` : ''
                }`}
              />

              <Chip
                size='small'
                label={item.status}
                color={item.status === 'delivered' ? 'success' : undefined}
                sx={{ ml: 1 }}
              />
            </ListItem>
          ))}
        </List>
      </Modal>

      <ListItemButton sx={{ mr: 1 }} onClick={() => setStatus('Show Details')}>
        <ListItemText
          primary={`Order ${order.number}`}
          secondary={dayjs(order.updatedAt).format('YYYY-MM-DD h:mm A')}
        />
      </ListItemButton>

      <Chip size='small' label={order.status} color={order.status === 'fulfilled' ? 'success' : undefined} />
    </ListItem>
  );
};

export default page;
