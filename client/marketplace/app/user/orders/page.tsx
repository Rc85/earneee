'use client';

import { mdiCubeOff } from '@mdi/js';
import Icon from '@mdi/react';
import { Box, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { retrieveOrders } from '../../../../_shared/api';
import { Loading } from '../../../../_shared/components';

const page = () => {
  const { isLoading, data } = retrieveOrders(0);
  const { orders } = data || {};

  return isLoading ? (
    <Loading />
  ) : (
    <Box sx={{ px: 2, pb: 2, flexGrow: 1 }}>
      {!orders || orders.length > 0 ? (
        <></>
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
