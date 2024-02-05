'use client';

import {
  Container,
  Typography,
  Box,
  IconButton,
  Drawer,
  Button,
  CircularProgress,
  useTheme,
  Badge
} from '@mui/material';
import Search from '../Search/Search';
import { SnackbarProvider } from 'notistack';
import Link from 'next/link';
import Icon from '@mdi/react';
import { mdiAccountCircle, mdiEmail, mdiLogoutVariant, mdiMenu } from '@mdi/js';
import { useEffect, useState } from 'react';
import Categories from '../Categories/Categories';
import { brandName } from '../../../_shared/constants';
import { createClient } from '../../utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { usePathname } from 'next/navigation';

const TopBar = () => {
  const [status, setStatus] = useState('Loading');
  const [openDrawer, setOpenDrawer] = useState(false);
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const theme = useTheme();

  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((e, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }

      setStatus('');
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <SnackbarProvider>
      <Drawer ModalProps={{ keepMounted: true }} open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <Categories onClick={() => setOpenDrawer(false)} />
      </Drawer>

      <Container maxWidth='xl' sx={{ py: 2, display: 'flex', alignItems: 'center' }}>
        <IconButton size='small' sx={{ mr: 1 }} onClick={() => setOpenDrawer(!openDrawer)}>
          <Icon path={mdiMenu} size={2} />
        </IconButton>

        <Typography className='brand-name' variant='h3' sx={{ mb: 0 }}>
          <Link href='/'>{brandName.toUpperCase()}</Link>
        </Typography>

        <Search />

        {status === 'Loading' ? (
          <CircularProgress size={20} />
        ) : user ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size='small' sx={{ mr: 2 }}>
              <Icon path={mdiAccountCircle} size={1} color={theme.palette.primary.main} />
            </IconButton>

            <Badge badgeContent={0} color='error' overlap='circular' sx={{ mr: 2 }}>
              <IconButton size='small'>
                <Icon path={mdiEmail} size={1} color={theme.palette.info.main} />
              </IconButton>
            </Badge>

            <Button
              startIcon={<Icon path={mdiLogoutVariant} size={1} />}
              color='error'
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Box>
            <Link href={`/login?redirect=${pathname}`}>Login</Link> |{' '}
            <Link href='/register'>Create Account</Link>
          </Box>
        )}
      </Container>
    </SnackbarProvider>
  );
};

export default TopBar;
