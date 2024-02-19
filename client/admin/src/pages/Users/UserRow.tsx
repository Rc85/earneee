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
import { mdiCancel, mdiRestore } from '@mdi/js';
import { FormEvent, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useUpdateUser } from '../../../../_shared/api';
import { Modal } from '../../../../_shared/components';
import dayjs from 'dayjs';
import { setIsLoading } from '../../../../_shared/redux/app';
import { useDispatch } from 'react-redux';

interface Props {
  user: UsersInterface;
}

const UserRow = ({ user }: Props) => {
  const theme = useTheme();
  const [status, setStatus] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const [reason, setReason] = useState('');
  const [bannedUntil, setBannedUntil] = useState('');
  const dispatch = useDispatch();

  const handleSuccess = (response: any) => {
    if (response.data.statusText) {
      enqueueSnackbar(response.data.statusText, { variant: 'success' });
    }

    setStatus('');
  };

  const handleError = (err: any) => {
    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }

    setStatus('');
  };

  const updateUser = useUpdateUser(handleSuccess, handleError);

  const handleBanUser = (e?: FormEvent) => {
    e?.preventDefault();

    dispatch(setIsLoading(true));

    updateUser.mutate({ id: user.id, bannedUntil, reason, status: 'suspended' });
  };

  const handleStatusChange = (status: string) => {
    dispatch(setIsLoading(true));

    updateUser.mutate({ id: user.id, status });
  };

  const handleUnbanClick = () => {
    dispatch(setIsLoading(true));

    updateUser.mutate({ id: user.id, unban: true });
  };

  return (
    <ListItem divider disableGutters>
      <Modal
        title='Ban User'
        open={status === 'Ban'}
        submit={handleBanUser}
        cancel={() => setStatus('')}
        component='form'
      >
        <TextField label='Reason' value={reason} onChange={(e) => setReason(e.target.value)} />

        <TextField
          label='Banned Until'
          type='datetime-local'
          value={bannedUntil}
          onChange={(e) => setBannedUntil(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Modal>

      <ListItemButton>
        <ListItemIcon>
          <Avatar src={user.profile?.logoUrl || '/broke.jpg'} alt={user.profile?.firstName || user.email} />
        </ListItemIcon>

        <ListItemText
          primary={user.email}
          secondary={
            user.status !== 'terminated' && user.ban
              ? `banned until ${dayjs(user.ban.bannedUntil).format('MM/DD/YYYY')}`
              : user.status
          }
        />
      </ListItemButton>

      {!user.ban ? (
        <IconButton size='small' sx={{ mr: 1 }} onClick={() => setStatus('Ban')}>
          <Icon path={mdiCancel} size={1} color={theme.palette.error.main} />
        </IconButton>
      ) : (
        <IconButton size='small' sx={{ mr: 1 }} onClick={handleUnbanClick}>
          <Icon path={mdiRestore} size={1} color={theme.palette.success.main} />
        </IconButton>
      )}

      <TextField
        label='Status'
        select
        SelectProps={{ native: true }}
        value={user.status}
        fullWidth={false}
        onChange={(e) => handleStatusChange(e.target.value)}
      >
        <option value='active'>Active</option>
        <option value='terminated'>Terminate</option>
      </TextField>
    </ListItem>
  );
};

export default UserRow;
