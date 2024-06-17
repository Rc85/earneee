import {
  List,
  Box,
  Pagination,
  Typography,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip
} from '@mui/material';
import { Loading, Section } from '../../../../_shared/components';
import { useState } from 'react';
import { listOrders } from '../../../../_shared/api';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const [page, setPage] = useState(0);
  const { isLoading, data } = listOrders({ page, limit: 20 });
  const { orders, count = 0 } = data || {};
  const navigate = useNavigate();

  return isLoading ? (
    <Loading />
  ) : (
    <Section title='Products' titleVariant='h3' position='center' sx={{ p: 2, flex: 1 }}>
      {orders && orders.length > 0 ? (
        <>
          <List disablePadding>
            {orders.map((order) => (
              <ListItem key={order.id} disableGutters disablePadding divider>
                <ListItemButton onClick={() => navigate(`/order/${order.id}`)}>
                  <ListItemText
                    primary={`Order ${order.number}`}
                    secondary={dayjs(order.createdAt).format('YYYY-MM-DD h:mm A')}
                  />
                </ListItemButton>

                <Chip
                  size='small'
                  color={order.status === 'fulfilled' ? 'success' : undefined}
                  label={order.status}
                  sx={{ ml: 1 }}
                />
              </ListItem>
            ))}
          </List>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={Math.ceil(count / 20)}
              page={page + 1}
              onChange={(_, page) => setPage(page - 1)}
              showFirstButton
              showLastButton
            />
          </Box>
        </>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <Typography>There are no orders</Typography>
        </Box>
      )}
    </Section>
  );
};

export default Orders;
