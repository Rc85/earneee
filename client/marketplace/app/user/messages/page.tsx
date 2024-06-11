'use client';

import { mdiMessageOff, mdiTrashCan } from '@mdi/js';
import Icon from '@mdi/react';
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Pagination,
  Typography
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { retrieveMessages, useDeleteMessage, useUpdateMessage } from '../../../../_shared/api';
import { Loading, Modal } from '../../../../_shared/components';
import { UserMessagesInterface } from '../../../../../_shared/types';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useSnackbar } from 'notistack';

const Messages = () => {
  const [page, setPage] = useState(0);
  const { isLoading, data } = retrieveMessages(page, 20);
  const { messages, count = 0 } = data || {};

  const updateMessage = useUpdateMessage();

  return isLoading ? (
    <Loading />
  ) : (
    <Box sx={{ px: 2, pb: 2, flexGrow: 1 }}>
      {!messages || messages.length > 0 ? (
        <>
          <Box
            sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}
            onClick={() => updateMessage.mutate(undefined)}
          >
            <Button>Mark All as Read</Button>
          </Box>

          <List disablePadding>
            {messages?.map((message) => (
              <MessageRow key={message.id} message={message} />
            ))}
          </List>
        </>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1 }}>
          <Icon path={mdiMessageOff} size={3} color={grey[500]} />

          <Typography>You have no messages</Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 3 }}>
        <Pagination count={Math.ceil(count / 20)} page={page + 1} onChange={(_, page) => setPage(page)} />
      </Box>
    </Box>
  );
};

const MessageRow = ({ message }: { message: UserMessagesInterface }) => {
  const [status, setStatus] = useState('');
  const { enqueueSnackbar } = useSnackbar();

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

  const updateMessage = useUpdateMessage();
  const deleteMessage = useDeleteMessage(handleSuccess, handleError);

  const handleClick = () => {
    updateMessage.mutate({ messageId: message.id });

    setStatus('Open');
  };

  const handleDelete = () => {
    setStatus('Deleting');

    deleteMessage.mutate([message.id]);
  };

  return (
    <ListItem disableGutters disablePadding divider>
      <Modal open={status === 'Open'} title='Message' cancel={() => setStatus('')} cancelText='Close'>
        <Typography>{message.message}</Typography>
      </Modal>

      <Modal
        open={status === 'Confirm Delete'}
        title='Are you sure you want to delete this message?'
        submit={handleDelete}
        cancel={() => setStatus('')}
      />

      <ListItemButton onClick={handleClick}>
        <ListItemText
          primary={`Lorem ipsum dolor sit amet, consectetur adipisicing elit. Obcaecati doloribus commodi corporis. Cupiditate enim corporis fugit maxime odit dolor aspernatur quam quod nam error, mollitia culpa nisi? Dolorem, commodi labore.`}
          secondary={`${dayjs(message.createdAt).format('YYYY-MM-DD')}`}
          sx={{ overflow: 'hidden' }}
          primaryTypographyProps={{
            sx: {
              fontWeight: message.status === 'new' ? 'bold' : undefined,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }
          }}
        />
      </ListItemButton>

      <IconButton size='small' color='error' onClick={() => setStatus('Confirm Delete')}>
        <Icon path={mdiTrashCan} size={1} />
      </IconButton>
    </ListItem>
  );
};

export default Messages;
