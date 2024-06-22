import {
  mdiAccessPoint,
  mdiAccount,
  mdiAccountGroup,
  mdiHandshake,
  mdiHelpCircle,
  mdiHome,
  mdiLogout,
  mdiMenu,
  mdiPackage,
  mdiShopping,
  mdiStarCircle,
  mdiTag,
  mdiViewList
} from '@mdi/js';
import { Icon } from '@mdi/react';
import {
  Box,
  CircularProgress,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { grey } from '@mui/material/colors';
import { brandName } from '../../../../_shared/constants';
import { authenticate, useLogout } from '../../../../_shared/api';
import { useAppSelector } from '../../../../_shared/redux/store';
import { useSnackbar } from 'notistack';

interface Props {
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

const TopBar = ({ maxWidth }: Props) => {
  const { data } = authenticate('admin');
  const { user } = data || {};
  const [openDrawer, setOpenDrawer] = useState(false);
  const { isLoading } = useAppSelector((state) => state.App);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSuccess = () => {
    setOpenDrawer(false);

    navigate('/');
  };

  const handleError = (err: any) => {
    if (err.response.data.statusText) {
      enqueueSnackbar(err.repsonse.data.statusText, { variant: 'error' });
    }
  };

  const logout = useLogout(handleSuccess, handleError);

  const handleDrawerOnClose = () => {
    setOpenDrawer(false);
  };

  const handleMenuClick = () => {
    setOpenDrawer(true);
  };

  const handleLogoutClick = () => {
    logout.mutate('admin');
  };

  const handleNavClick = (path: string) => {
    navigate(path);

    setOpenDrawer(false);
  };

  return (
    <Container
      maxWidth={maxWidth}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: grey[600],
        borderBottomStyle: 'solid'
      }}
    >
      <Drawer anchor='left' open={openDrawer} onClose={handleDrawerOnClose}>
        <List disablePadding sx={{ minWidth: '300px' }}>
          <ListItem disableGutters disablePadding>
            <ListItemButton onClick={() => handleNavClick('/')}>
              <ListItemIcon>
                <Icon path={mdiHome} size={1} />
              </ListItemIcon>

              <ListItemText primary='Main' />
            </ListItemButton>
          </ListItem>

          {user?.isAdmin && (
            <ListItem disableGutters disablePadding>
              <ListItemButton onClick={() => handleNavClick('/categories')}>
                <ListItemIcon>
                  <Icon path={mdiViewList} size={1} />
                </ListItemIcon>

                <ListItemText primary='Categories' />
              </ListItemButton>
            </ListItem>
          )}

          {user?.isAdmin && (
            <ListItem disableGutters disablePadding>
              <ListItemButton onClick={() => handleNavClick('/brand')}>
                <ListItemIcon>
                  <Icon path={mdiStarCircle} size={1} />
                </ListItemIcon>

                <ListItemText primary='Product Brands' />
              </ListItemButton>
            </ListItem>
          )}

          {user?.isAdmin && (
            <ListItem disableGutters disablePadding>
              <ListItemButton onClick={() => handleNavClick('/products')}>
                <ListItemIcon>
                  <Icon path={mdiPackage} size={1} />
                </ListItemIcon>

                <ListItemText primary='Products' />
              </ListItemButton>
            </ListItem>
          )}

          {user?.isAdmin && (
            <ListItem disableGutters disablePadding>
              <ListItemButton onClick={() => handleNavClick('/orders')}>
                <ListItemIcon>
                  <Icon path={mdiShopping} size={1} />
                </ListItemIcon>

                <ListItemText primary='Orders' />
              </ListItemButton>
            </ListItem>
          )}

          {user?.isAdmin && (
            <ListItem disableGutters disablePadding>
              <ListItemButton onClick={() => handleNavClick('/offers')}>
                <ListItemIcon>
                  <Icon path={mdiTag} size={1} />
                </ListItemIcon>

                <ListItemText primary='Offers' />
              </ListItemButton>
            </ListItem>
          )}

          {user?.isAdmin && (
            <ListItem disableGutters disablePadding>
              <ListItemButton onClick={() => handleNavClick('/affiliates')}>
                <ListItemIcon>
                  <Icon path={mdiHandshake} size={1} />
                </ListItemIcon>

                <ListItemText primary='Affiliates' />
              </ListItemButton>
            </ListItem>
          )}

          {user?.isAdmin && (
            <ListItem disableGutters disablePadding>
              <ListItemButton onClick={() => handleNavClick('/users')}>
                <ListItemIcon>
                  <Icon path={mdiAccountGroup} size={1} />
                </ListItemIcon>

                <ListItemText primary='Users' />
              </ListItemButton>
            </ListItem>
          )}

          {user?.isAdmin && (
            <ListItem disableGutters disablePadding>
              <ListItemButton onClick={() => handleNavClick('/account')}>
                <ListItemIcon>
                  <Icon path={mdiAccount} size={1} />
                </ListItemIcon>

                <ListItemText primary='Account' />
              </ListItemButton>
            </ListItem>
          )}

          {user?.isAdmin && (
            <ListItem disableGutters disablePadding>
              <ListItemButton onClick={() => handleNavClick('/statuses')}>
                <ListItemIcon>
                  <Icon path={mdiAccessPoint} size={1} />
                </ListItemIcon>

                <ListItemText primary='Statuses' />
              </ListItemButton>
            </ListItem>
          )}

          {user?.isAdmin && (
            <ListItem disableGutters disablePadding>
              <ListItemButton onClick={() => handleNavClick('/faq')}>
                <ListItemIcon>
                  <Icon path={mdiHelpCircle} size={1} />
                </ListItemIcon>

                <ListItemText primary='FAQ' />
              </ListItemButton>
            </ListItem>
          )}

          <ListItem disableGutters disablePadding>
            <ListItemButton onClick={handleLogoutClick}>
              <ListItemIcon>
                <Icon path={mdiLogout} size={1} />
              </ListItemIcon>

              <ListItemText primary='Logout' />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Typography variant='h3' className='brand-name' sx={{ mb: 0 }}>
        {brandName.toUpperCase()}
      </Typography>

      {user && (
        <IconButton size='small' onClick={handleMenuClick}>
          <Icon path={mdiMenu} size={2} />
        </IconButton>
      )}

      {isLoading && (
        <Box
          sx={{
            width: '100vw',
            height: '100vh',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Container>
  );
};

export default TopBar;
