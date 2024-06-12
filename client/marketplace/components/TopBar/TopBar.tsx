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
import Icon from '@mdi/react';
import { mdiAccountCircle, mdiEmail, mdiLogoutVariant, mdiMenu } from '@mdi/js';
import { useEffect, useState } from 'react';
import Categories from '../Categories/Categories';
import { brandName } from '../../../_shared/constants';
import { usePathname } from 'next/navigation';
import { authenticate, retrieveMessageCount, useLogout } from '../../../_shared/api';
import { retrieveStatuses } from '../../../_shared/api/statuses/queries';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { setCountry } from '../../../_shared/redux/app';

const TopBar = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const pathname = usePathname();
  const theme = useTheme();
  const { isLoading, data, refetch } = authenticate('marketplace');
  const { user } = data || {};
  const logout = useLogout();
  const s = retrieveStatuses();
  const { statuses } = s.data || {};
  const loginStatus = statuses?.find((status) => status.name === 'login');
  const registrationStatus = statuses?.find((status) => status.name === 'registration');
  const dispatch = useDispatch();
  const redirect = /^\/account\/activate\/.*$/.test(pathname) ? '/' : pathname;
  const userMessages = retrieveMessageCount(Boolean(user));
  const { count = 0 } = userMessages.data || {};

  useEffect(() => {
    if (user) {
      dispatch(setCountry(user.country));
    } else {
      setTimeout(() => {
        const country = localStorage.getItem('earneee.country');

        dispatch(setCountry(country || 'CA'));
      }, 250);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      userMessages.refetch();
    }

    refetch();
  }, [pathname]);

  const handleLogout = () => {
    logout.mutate('marketplace');
  };

  return (
    <Box sx={{ backgroundColor: theme.palette.primary.main, mb: 3 }}>
      <SnackbarProvider>
        <Drawer ModalProps={{ keepMounted: true }} open={openDrawer} onClose={() => setOpenDrawer(false)}>
          <Categories onClick={() => setOpenDrawer(false)} />
        </Drawer>

        <Container maxWidth='xl' sx={{ py: 2, display: 'flex', alignItems: 'center' }}>
          <IconButton size='small' sx={{ mr: 1 }} onClick={() => setOpenDrawer(!openDrawer)} color='inherit'>
            <Icon path={mdiMenu} size={2} />
          </IconButton>

          <Link href='/' style={{ display: 'flex', alignItems: 'center' }} className='logo-link'>
            <img
              src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/images/${brandName.toLowerCase()}_logo.png`}
              alt='Earneee'
              width={50}
              height={50}
            />

            <Typography className='brand-name' variant='h3' sx={{ mb: 0, ml: 1 }}>
              {brandName.toUpperCase()}
            </Typography>
          </Link>

          <Search />

          {/* <TextField
            select
            sx={{ mb: '0 !important', width: 75, mr: 1 }}
            value={country}
            onChange={(e) => dispatch(setCountry(e.target.value))}
            SelectProps={{
              renderValue: () => (
                <img
                  src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/images/countries/${country.toLowerCase()}.png`}
                  style={{ width: '20px' }}
                />
              ),
              MenuProps: { keepMounted: true }
            }}
          >
            {[
              { code: 'CA', name: 'Canada' },
              { code: 'US', name: 'United States' }
            ].map((country) => (
              <MenuItem
                key={country.code}
                value={country.code}
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <img
                  src={`${
                    process.env.NEXT_PUBLIC_STORAGE_URL
                  }/images/countries/${country.code.toLowerCase()}.png`}
                  style={{ width: '20px', marginRight: '5px' }}
                />
                {country.name}
              </MenuItem>
            ))}
          </TextField> */}

          {isLoading ? (
            <CircularProgress size={20} />
          ) : user ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Link href='/user/profile'>
                <IconButton size='small' sx={{ mr: 2 }}>
                  <Icon path={mdiAccountCircle} size={1} color='black' />
                </IconButton>
              </Link>

              <Badge badgeContent={count} color='info' overlap='circular' sx={{ mr: 2 }}>
                <Link href='/user/messages'>
                  <IconButton size='small'>
                    <Icon path={mdiEmail} size={1} color='black' />
                  </IconButton>
                </Link>
              </Badge>

              <Button
                color='inherit'
                startIcon={<Icon path={mdiLogoutVariant} size={1} />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {loginStatus?.online && (
                <Link
                  href={`/login?redirect=${redirect}`}
                  style={{
                    color: 'black',
                    display: 'flex',
                    alignItems: 'center',
                    marginRight: registrationStatus?.online ? '10px' : 0
                  }}
                >
                  Login
                </Link>
              )}

              {registrationStatus?.online && (
                <Link href='/register' style={{ color: 'black', display: 'flex', alignItems: 'center' }}>
                  Create Account
                </Link>
              )}
            </Box>
          )}
        </Container>
      </SnackbarProvider>
    </Box>
  );
};

export default TopBar;
