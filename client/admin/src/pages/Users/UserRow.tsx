import {
  Avatar,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  useTheme
} from '@mui/material';
import { UsersInterface } from '../../../../../_shared/types';
import Icon from '@mdi/react';
import { mdiCancel } from '@mdi/js';

interface Props {
  user: UsersInterface;
}

const UserRow = ({ user }: Props) => {
  const theme = useTheme();

  return (
    <ListItem divider disableGutters>
      <ListItemButton>
        <ListItemIcon>
          <Avatar src={user.profile?.logoUrl || '/broke.jpg'} alt={user.profile?.firstName || user.email} />
        </ListItemIcon>

        <ListItemText primary={user.email} />
      </ListItemButton>

      <IconButton size='small' sx={{ mr: 1 }}>
        <Icon path={mdiCancel} size={1} color={theme.palette.error.main} />
      </IconButton>

      <TextField label='Status' select SelectProps={{ native: true }} value={user.status} fullWidth={false}>
        <option value='active'>Active</option>
        <option value='terminated'>Terminate</option>
      </TextField>
    </ListItem>
  );
};

export default UserRow;
