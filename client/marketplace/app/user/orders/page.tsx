'use client';

import { mdiCubeOff } from '@mdi/js';
import Icon from '@mdi/react';
import {
  Box,
  Chip,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Pagination,
  Typography
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { retrieveUserOrders } from '../../../../_shared/api';
import { Loading } from '../../../../_shared/components';
import dayjs from 'dayjs';
import { useRouter, useSearchParams } from 'next/navigation';

const page = () => {
  const search = useSearchParams();
  const page = search.get('page') || '1';
  const { isLoading, data } = retrieveUserOrders({ offset: parseInt(page) - 1, limit: 10 });
  const { orders, count = 0 } = data || {};
  const router = useRouter();

  return isLoading ? (
    <Loading />
  ) : (
    <Box sx={{ px: 2, pb: 2, flexGrow: 1 }}>
      {orders && orders.length > 0 ? (
        <>
          <List disablePadding>
            {orders.map((order) => (
              <ListItem disableGutters disablePadding divider>
                <Link href={`/user/order/${order.id}`} sx={{ flexGrow: 1 }} className='list-item-button-link'>
                  <ListItemButton sx={{ mr: 1 }}>
                    <ListItemText
                      primary={`Order ${order.number}`}
                      secondary={dayjs(order.createdAt).format('YYYY-MM-DD h:mm A')}
                    />
                  </ListItemButton>
                </Link>

                <Chip
                  size='small'
                  label={order.status}
                  color={order.status === 'fulfilled' ? 'success' : undefined}
                />
              </ListItem>
            ))}
          </List>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={Math.ceil(count / 20)}
              page={parseInt(page)}
              onChange={(_, page) => router.push(`/user/orders?page=${page}`)}
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

export default page;
