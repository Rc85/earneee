import { mdiListBox, mdiPackageVariantClosedPlus } from '@mdi/js';
import Icon from '@mdi/react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { grey } from '@mui/material/colors';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import OrderDetails from './OrderDetails';
import CreateOrderShipment from './CreateOrderShipment';

const Order = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { orderId } = params;

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
            <ListItemButton onClick={() => navigate(`/order/${orderId}`)}>
              <ListItemIcon>
                <Icon path={mdiListBox} size={1} />
              </ListItemIcon>

              <ListItemText primary='Order Details' />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding disableGutters>
            <ListItemButton onClick={() => navigate(`/order/${orderId}/shipment`)}>
              <ListItemIcon>
                <Icon path={mdiPackageVariantClosedPlus} size={1} />
              </ListItemIcon>

              <ListItemText primary='Create Shipment' />
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

Order.Details = OrderDetails;
Order.CreateShipment = CreateOrderShipment;

export default Order;
