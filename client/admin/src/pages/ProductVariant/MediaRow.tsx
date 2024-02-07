import { Box, CircularProgress, IconButton, ListItem, Switch, useTheme } from '@mui/material';
import { ProductMediaInterface } from '../../../../../_shared/types';
import { Icon } from '@mdi/react';
import { mdiImage, mdiOpenInNew, mdiTrashCan, mdiVideo } from '@mdi/js';
import { useState } from 'react';
import { Modal } from '../../../../_shared/components';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSnackbar } from 'notistack';
import { useDeleteProductMedia, useUpdateProductMedia } from '../../../../_shared/api';

interface Props {
  media: ProductMediaInterface;
}

const MediaRow = ({ media }: Props) => {
  const theme = useTheme();
  const [status, setStatus] = useState('');
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: media.id });
  const { enqueueSnackbar } = useSnackbar();

  const handleError = (err: any) => {
    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }

    setStatus('');
  };

  const deleteProductMedia = useDeleteProductMedia(() => setStatus(''), handleError);
  const updateProductMedia = useUpdateProductMedia(undefined, handleError);

  const style = { transform: CSS.Transform.toString(transform), transition };

  const handleDelete = () => {
    setStatus('Deleting');

    deleteProductMedia.mutate(media.id);
  };

  const handleToggle = () => {
    updateProductMedia.mutate({ ...media, status: media.status === 'enabled' ? 'disabled' : 'enabled' });
  };

  return (
    <ListItem ref={setNodeRef} disableGutters divider {...attributes} {...listeners} style={style}>
      <Modal
        open={status === 'Confirm Delete'}
        title='Are you sure you want to delete this media?'
        submit={handleDelete}
        cancel={() => setStatus('')}
        submitText='Yes'
        cancelText='No'
      />

      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Box sx={{ position: 'relative' }}>
          {media.type === 'image' && (
            <Box
              sx={{
                borderRadius: '100%',
                backgroundColor: 'white',
                position: 'absolute',
                top: 5,
                right: 5,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Icon path={mdiImage} size={1} />
            </Box>
          )}

          {['youtube', 'video'].includes(media.type) && (
            <Box
              sx={{
                borderRadius: '100%',
                backgroundColor: 'white',
                position: 'absolute',
                top: 5,
                right: 5,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Icon path={mdiVideo} size={1} />
            </Box>
          )}

          {media.type === 'image' && <img src={media.url} style={{ maxHeight: 100, maxWidth: 100 }} />}

          {['youtube', 'video'].includes(media.type) && (
            <video
              style={{ maxHeight: 100, maxWidth: 100 }}
              poster={
                media.type === 'youtube' ? `http://img.youtube.com/vi/${media.path}/default.jpg` : undefined
              }
            >
              <source src={`${media.url}#t=0.001`} type='video/mp4' />
            </video>
          )}
        </Box>
      </Box>

      <IconButton size='small' onClick={() => window.open(media.url, '_blank')} sx={{ mr: 1 }}>
        <Icon path={mdiOpenInNew} size={1} />
      </IconButton>

      <Switch color='success' checked={media.status === 'enabled'} onChange={handleToggle} sx={{ mr: 1 }} />

      {status === 'Deleting' ? (
        <CircularProgress size={20} />
      ) : (
        <IconButton size='small' onClick={() => setStatus('Confirm Delete')}>
          <Icon path={mdiTrashCan} size={1} color={theme.palette.error.main} />
        </IconButton>
      )}
    </ListItem>
  );
};

export default MediaRow;
