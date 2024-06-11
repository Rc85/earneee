'use client';

import { Box, Typography } from '@mui/material';
import Link from 'next/link';
import { Section } from '../../../_shared/components';
import { usePathname } from 'next/navigation';
import { authenticate } from '../../../_shared/api';

const layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { data } = authenticate('marketplace');
  const { user } = data || {};

  return (
    <Section
      title='ACCOUNT'
      subtitle={user?.email}
      titleVariant='h3'
      disableGutters
      maxWidth='md'
      position='center'
      containerStyle={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
      sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
    >
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Box
          sx={{
            width: '25%',
            maxWidth: '300px',
            minWidth: '200px',
            borderRightWidth: 1,
            borderRightStyle: 'solid',
            borderRightColor: 'divider',
            px: 2
          }}
        >
          <Box sx={{ mb: 1 }}>
            <Typography variant='button'>
              {pathname === '/user/profile' ? 'Profile' : <Link href='/user/profile'>Profile</Link>}
            </Typography>
          </Box>

          <Box sx={{ mb: 1 }}>
            <Typography variant='button'>
              {pathname === '/user/messages' ? 'Messages' : <Link href='/user/messages'>Messages</Link>}
            </Typography>
          </Box>

          <Box sx={{ mb: 1 }}>
            <Typography variant='button'>
              {pathname === '/user/orders' ? 'Orders' : <Link href='/user/orders'>Orders</Link>}
            </Typography>
          </Box>

          <Box>
            <Typography variant='button'>
              {pathname === '/user/settings' ? 'Settings' : <Link href='/user/settings'>Settings</Link>}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1 }}>{children}</Box>
      </Box>
    </Section>
  );
};

export default layout;
