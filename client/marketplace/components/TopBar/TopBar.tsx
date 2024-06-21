'use client';

import {
  Container,
  Typography,
  Box,
  IconButton,
  Drawer,
  CircularProgress,
  useTheme,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemButton,
  Button
} from '@mui/material';
import Search from '../Search/Search';
import { SnackbarProvider, useSnackbar } from 'notistack';
import Icon from '@mdi/react';
import {
  mdiAccountCircle,
  mdiCart,
  mdiCartArrowRight,
  mdiCartOff,
  mdiCartRemove,
  mdiEmail,
  mdiLogoutVariant,
  mdiMenu,
  mdiTrashCan
} from '@mdi/js';
import { useEffect, useState } from 'react';
import Categories from '../Categories/Categories';
import { brandName } from '../../../_shared/constants';
import { usePathname } from 'next/navigation';
import {
  authenticate,
  retrieveCart,
  retrieveMessageCount,
  retrieveUserProfile,
  useAddProduct,
  useCheckout,
  useLogout,
  useRemoveProduct
} from '../../../_shared/api';
import { retrieveStatuses } from '../../../_shared/api/statuses/queries';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { setCountry } from '../../../_shared/redux/app';
import { grey } from '@mui/material/colors';
import { OrderItemsInterface, ProductsInterface } from '../../../../_shared/types';
import ProductConfigurator from '../ProductConfigurator/ProductConfigurator';
import { useAppSelector } from '../../../_shared/redux/store';
import { LoadingButton } from '@mui/lab';
import { useQueryClient } from '@tanstack/react-query';

const TopBar = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const pathname = usePathname();
  const theme = useTheme();
  const { isLoading, data, refetch } = authenticate('marketplace');
  const { user } = data || {};
  const profile = retrieveUserProfile(Boolean(user));
  const { userProfile } = profile.data || {};
  const logout = useLogout();
  const s = retrieveStatuses();
  const { statuses } = s.data || {};
  const loginStatus = statuses?.find((status) => status.name === 'login');
  const registrationStatus = statuses?.find((status) => status.name === 'registration');
  const dispatch = useDispatch();
  const redirect =
    /^\/account\/activate\/.*$/.test(pathname) || /^\/reset-password.*$/.test(pathname) ? '/' : pathname;
  const userMessages = retrieveMessageCount(Boolean(user));
  const { count = 0 } = userMessages.data || {};

  useEffect(() => {
    if (userProfile) {
      dispatch(setCountry(userProfile.country));
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
                  <Icon path={mdiAccountCircle} size={1} color='black' title='Account' />
                </IconButton>
              </Link>

              <Badge badgeContent={count} color='info' overlap='circular' sx={{ mr: 2 }}>
                <Link href='/user/messages'>
                  <IconButton size='small'>
                    <Icon path={mdiEmail} size={1} color='black' title='Messages' />
                  </IconButton>
                </Link>
              </Badge>

              <Cart />

              <IconButton size='small' onClick={handleLogout}>
                <Icon path={mdiLogoutVariant} size={1} color='black' title='Logout' />
              </IconButton>
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

const Cart = () => {
  const [status, setStatus] = useState('');
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const auth = authenticate('marketplace');
  const { user } = auth.data || {};
  const { data, refetch } = retrieveCart({ userId: user?.id });
  const { order } = data || {};
  const count = order?.items.length || 0;
  const pathname = usePathname();
  const { country } = useAppSelector((state) => state.App);
  const subtotal = (order?.items || []).reduce((acc, item) => acc + item.price * item.quantity, 0);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['cart'] });
  }, [pathname]);

  const handleSuccess = (response: any) => {
    if (response.data.url) {
      window.location.href = response.data.url;
    }
  };

  const handleError = (err: any) => {
    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }

    setStatus('');
  };

  const removeProduct = useRemoveProduct();
  const updateProduct = useAddProduct();
  const checkout = useCheckout(handleSuccess, handleError);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    refetch();

    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRemoveProduct = (orderItemId: string) => {
    removeProduct.mutate({ orderItemId, orderId: order?.id });
  };

  const handleUpdateProduct = (product: ProductsInterface, quantity: string, orderItemId: string) => {
    if (order) {
      updateProduct.mutate({
        orderItemId,
        product,
        quantity: parseInt(quantity),
        orderId: order.id,
        country
      });
    }
  };

  const handleClearCartClick = () => {
    removeProduct.mutate({ orderId: order?.id });
  };

  const handleCheckoutClick = () => {
    if (order) {
      setStatus('Loading');

      checkout.mutate({ orderId: order.id, cancelUrl: pathname });
    }
  };

  return (
    <>
      <Badge badgeContent={count} color='info' overlap='circular' sx={{ mr: 2 }}>
        <IconButton size='small' onClick={handleClick}>
          <Icon path={mdiCart} size={1} color='black' title='Cart' />
        </IconButton>
      </Badge>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { p: 2, width: '400px' } } }}
      >
        {count === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Icon path={mdiCartOff} size={3} color={grey[300]} />

            <Typography sx={{ mt: 3 }}>Your cart is empty</Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant='h6' sx={{ mb: 0 }}>
                {order?.items.length} item{order?.items && order.items.length > 1 ? 's' : ''}
              </Typography>

              <IconButton size='small' color='error' onClick={handleClearCartClick}>
                <Icon path={mdiCartRemove} size={1} />
              </IconButton>
            </Box>

            <List disablePadding>
              {order?.items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onRemove={handleRemoveProduct}
                  onUpdate={handleUpdateProduct}
                />
              ))}
            </List>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant='h6' sx={{ mb: 0 }}>
                SUBTOTAL
              </Typography>

              <Typography variant='h6' sx={{ mb: 0 }}>
                ${subtotal.toFixed(2)}
              </Typography>
            </Box>

            <LoadingButton
              variant='contained'
              fullWidth
              loading={status === 'Loading'}
              loadingIndicator={<CircularProgress size={20} />}
              loadingPosition='start'
              startIcon={<Icon path={mdiCartArrowRight} size={1} />}
              onClick={handleCheckoutClick}
            >
              Checkout
            </LoadingButton>
          </>
        )}
      </Popover>
    </>
  );
};

const CartItem = ({
  item,
  onRemove,
  onUpdate
}: {
  item: OrderItemsInterface;
  onRemove: (orderItemId: string) => void;
  onUpdate: (product: ProductsInterface, quantity: string, orderItemId: string) => void;
}) => {
  const [status, setStatus] = useState('');

  const handleUpdate = (product: ProductsInterface, quantity: string) => {
    onUpdate(product, quantity, item.id);

    setStatus('');
  };

  return (
    <ListItem disableGutters divider sx={{ alignItems: 'stretch' }}>
      {status === 'Edit' && (
        <ProductConfigurator
          product={{ ...item.product }}
          variant={item.product.variants?.[0] ? { ...item.product.variants[0] } : undefined}
          item={item}
          cancel={() => setStatus('')}
          submit={handleUpdate}
        />
      )}

      <ListItemButton onClick={() => setStatus('Edit')} disableGutters sx={{ py: 0 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Box
              sx={{ px: 0.5, py: 0.2, borderRadius: '4px', backgroundColor: 'primary.main', mr: 1, mt: 0.25 }}
            >
              <Typography sx={{ fontSize: 12, fontWeight: 500 }}>{item.quantity}</Typography>
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 500 }}>{item.name}</Typography>

              {item.product.variants?.[0] && (
                <Typography variant='body2' color='GrayText'>
                  {item.product.variants[0].name}
                </Typography>
              )}

              {item.product.options &&
                item.product.options.length > 0 &&
                item.product.options.map((option) => (
                  <Box key={option.id} sx={{ ml: 2 }}>
                    <Typography variant='body2' color='GrayText'>
                      {option.name}
                    </Typography>

                    {option.selections?.map((selection) => (
                      <Typography key={selection.id} variant='body2' color='GrayText'>
                        &bull; {selection.name}
                      </Typography>
                    ))}
                  </Box>
                ))}
            </Box>
          </Box>
        </Box>
      </ListItemButton>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <Typography>
          ${item.price.toFixed(2)} {item.product.url?.currency.toUpperCase()}
        </Typography>

        <Button
          color='error'
          startIcon={<Icon path={mdiTrashCan} size={1} />}
          onClick={() => onRemove(item.id)}
        >
          Remove
        </Button>
      </Box>
    </ListItem>
  );
};

export default TopBar;
