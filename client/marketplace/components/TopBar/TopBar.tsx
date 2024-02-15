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
import { useState } from 'react';
import Categories from '../Categories/Categories';
import { brandName } from '../../../_shared/constants';
import { usePathname } from 'next/navigation';
import { authenticate, useLogout } from '../../../_shared/api';

const TopBar = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const pathname = usePathname();
  const theme = useTheme();
  const { isLoading, data: { data: { user } } = { data: {} } } = authenticate('marketplace');
  const logout = useLogout();
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
            <Link href={`/login?redirect=${pathname}`}>Login</Link> |{' '}
            <Link href='/register'>Create Account</Link>
          </Box>
        )}
      </Container>
    </SnackbarProvider>
  );
};

export default TopBar;
