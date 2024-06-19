import { ListItem, ListItemText, Chip, ListItemButton } from '@mui/material';
import dayjs from 'dayjs';
import { RefundsInterface } from '../../../../../_shared/types';
import { useNavigate } from 'react-router-dom';

interface Props {
  refund: RefundsInterface | undefined;
}

const RefundRow = ({ refund }: Props) => {
  const navigate = useNavigate();

  return (
    <ListItem disableGutters divider>
      <ListItemButton onClick={() => navigate(`/orders/refund/${refund?.id}`)}>
        <ListItemText
          primary={`Order ${refund?.item?.order?.number}`}
          secondary={dayjs(refund?.createdAt).format('YYYY-MM-DD h:mm A')}
        />
      </ListItemButton>

      <Chip
        size='small'
        color={refund?.status === 'pending' ? undefined : refund?.status === 'complete' ? 'success' : 'error'}
        label={refund?.status}
        sx={{ ml: 1 }}
      />
    </ListItem>
  );
};

export default RefundRow;
