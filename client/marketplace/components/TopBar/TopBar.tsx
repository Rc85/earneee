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
  Badge,
  Link
} from '@mui/material';
import Search from '../Search/Search';
import { SnackbarProvider } from 'notistack';
import Icon from '@mdi/react';
import { mdiAccountCircle, mdiEmail, mdiLogin, mdiLogoutVariant, mdiMenu } from '@mdi/js';
import { useState } from 'react';
import Categories from '../Categories/Categories';
import { brandName } from '../../../_shared/constants';
import { usePathname } from 'next/navigation';
import { authenticate, useLogout } from '../../../_shared/api';
import { retrieveStatuses } from '../../../_shared/api/statuses/queries';

const TopBar = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const pathname = usePathname();
  const theme = useTheme();
  const { isLoading, data } = authenticate('marketplace');
  const { user } = data || {};
  const logout = useLogout();
  const s = retrieveStatuses();
  const { statuses } = s.data || {};
  const loginStatus = statuses?.find((status) => status.name === 'login');
  const registrationStatus = statuses?.find((status) => status.name === 'registration');
  /* const [selectedCountry, setSelectedCountry] = useState('CA');
  const dispatch = useDispatch();
  const { country } = useAppSelector((state) => state.App);

  useEffect(() => {
    if (user) {
      setSelectedCountry(user.country);
    }
  }, [user]); */

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

          <Link href='/' sx={{ display: 'flex', alignItems: 'center' }} className='logo-link'>
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
              <MenuItem key={country.code} value={country.code} sx={{ display: 'flex', alignItems: 'center' }}>
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
              {loginStatus?.online && (
                <Link
                  href={`/login?redirect=${pathname}`}
                  sx={{ color: 'black', display: 'flex', alignItems: 'center' }}
                >
                  <Icon path={mdiLogin} size={1} style={{ marginRight: '5px' }} /> Login
                </Link>
              )}
              {loginStatus?.online && registrationStatus?.online && (
                <Typography component='span'> | </Typography>
              )}
              {registrationStatus?.online && (
                <Link href='/register' sx={{ color: 'black' }}>
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
