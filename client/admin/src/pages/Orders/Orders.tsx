import { List, Box, ListItem, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import { mdiCreditCardRefund, mdiListBox } from '@mdi/js';
import { grey } from '@mui/material/colors';
import Icon from '@mdi/react';
import OrderList from './OrderList';
import Refunds from './Refunds';
import Refund from './Refund';

const Orders = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexGrow: 1 }}>
      <Box
        sx={{
          minWidth: '200px',
          borderRightWidth: 1,
          borderRightColor: grey[600],
          borderRightStyle: 'solid'
        }}
      >
        <List disablePadding>
          <ListItem disablePadding disableGutters>
            <ListItemButton onClick={() => navigate(`/orders`)}>
              <ListItemIcon>
                <Icon path={mdiListBox} size={1} />
              </ListItemIcon>

              <ListItemText primary='Orders' />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding disableGutters>
            <ListItemButton onClick={() => navigate(`/orders/refunds`)}>
              <ListItemIcon>
                <Icon path={mdiCreditCardRefund} size={1} />
              </ListItemIcon>

              <ListItemText primary='Refunds' />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      <Box sx={{ p: 2, flexGrow: 1, minWidth: 0, overflow: 'hidden' }}>
        <Outlet />
      </Box>
    </Box>
  );
};

Orders.List = OrderList;
Orders.Refunds = Refunds;
Orders.Refund = Refund;

export default Orders;
