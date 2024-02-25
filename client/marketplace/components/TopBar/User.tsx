'use server';

import { mdiAccountCircle, mdiEmail, mdiLogoutVariant } from '@mdi/js';
import { Box, IconButton, Badge, Button } from '@mui/material';
import Link from 'next/link';
import { UsersInterface } from '../../../../_shared/types';
import { theme } from '../../../_shared/constants';
import Icon from '@mdi/react';
import { usePathname } from 'next/navigation';

const User = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/v1/auth/user`, {
    credentials: 'include',
    next: { revalidate: 180, tags: ['authenticate'] }
  });
  const data = await res.json();
  const user: UsersInterface = data.user;
  const pathname = usePathname();

  const handleLogout = () => {};

  return user ? (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <IconButton size='small' sx={{ mr: 2 }}>
        <Icon path={mdiAccountCircle} size={1} color={theme.palette.primary.main} />
      </IconButton>

      <Badge badgeContent={0} color='error' overlap='circular' sx={{ mr: 2 }}>
        <IconButton size='small'>
          <Icon path={mdiEmail} size={1} color={theme.palette.info.main} />
        </IconButton>
      </Badge>

      <Button startIcon={<Icon path={mdiLogoutVariant} size={1} />} color='error' onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  ) : (
    <Box>
      <Link href={`/login?redirect=${pathname}`}>Login</Link> | <Link href='/register'>Create Account</Link>
    </Box>
  );
};

export default User;
