'use client';

import { mdiCheckCircleOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { Container, Paper, Typography, useTheme } from '@mui/material';
import Link from 'next/link';

const page = () => {
  const theme = useTheme();

  return (
    <Container maxWidth='sm'>
      <Paper variant='outlined' sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Icon path={mdiCheckCircleOutline} size={3} color={theme.palette.success.main} />

        <Typography variant='h3'>Order processed</Typography>

        <Typography sx={{ textAlign: 'center', mb: 3 }}>
          Your order has been processed. You can view the status and details of your order on your orders
          page.
        </Typography>

        <Typography variant='button'>
          <Link href='/user/orders'>View Orders</Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default page;
