import { TableRow, TableCell, Box, Typography, Chip } from '@mui/material';
import { OrderItemsInterface } from '../../../../../_shared/types';
import dayjs from 'dayjs';
import { grey } from '@mui/material/colors';

interface Props {
  item: OrderItemsInterface;
}

const OrderItemRow = ({ item }: Props) => {
  return (
    <TableRow>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ borderRadius: '4px', px: 0.5, py: 0.25, mr: 1, backgroundColor: grey[300] }}>
            <Typography sx={{ fontSize: 12, fontWeight: 500 }}>{item.quantity}</Typography>
          </Box>

          <Typography>{item.name}</Typography>

          <Chip
            size='small'
            color={item.status === 'delivered' ? 'success' : item.status === 'shipped' ? 'info' : undefined}
            label={item.status}
            onClick={() => {}}
            sx={{ ml: 1 }}
          />
        </Box>
        {item.product.variants?.[0] && (
          <Typography color='GrayText'>{item.product.variants?.[0]?.name}</Typography>
        )}

        {item.product.options?.map((option) => (
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

        {item.shipment && (
          <Typography variant='body2' color='GrayText' sx={{ mt: 1 }}>
            {item.shipment.shippingProvider} &bull; {item.shipment.trackingNumber}
            {item.shipment.eta ? ` \u2022 ETA ${dayjs(item.shipment.eta).format('YYYY-MM-DD')}` : ''}
          </Typography>
        )}
      </TableCell>

      <TableCell>
        <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>

        <Typography variant='body2' color='GrayText'>
          ${item.price.toFixed(2)} each
        </Typography>
      </TableCell>
    </TableRow>
  );
};

export default OrderItemRow;
