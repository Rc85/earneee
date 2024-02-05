import { Box, IconButton, ListItem, useTheme } from '@mui/material';
import { ProductMediaInterface } from '../../../../_shared/types';
import { Icon } from '@mdi/react';
import { mdiImage, mdiOpenInNew, mdiTrashCan, mdiVideo } from '@mdi/js';
import { useContext, useState } from 'react';
import { Modal } from '../../../../_shared/components';
import { SupabaseContext } from '../../../../_shared/components/SupabaseProvider/SupabaseProvider';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSnackbar } from 'notistack';

interface Props {
  media: ProductMediaInterface;
}

const MediaRow = ({ media }: Props) => {
  const theme = useTheme();
  const [status, setStatus] = useState('');
  const { supabase } = useContext(SupabaseContext);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: media.id });
  const { enqueueSnackbar } = useSnackbar();

  const style = { transform: CSS.Transform.toString(transform), transition };

  const handleSubmit = async () => {
    if (supabase) {
      if (media.path) {
        const response = await supabase.storage.from('product_media').remove([media.path]);

        if (response.error) {
          return enqueueSnackbar(response.error.message, { variant: 'error' });
        }
      }

      await supabase.from('product_media').delete().eq('id', media.id);
    }
  };

  return (
    <ListItem ref={setNodeRef} disableGutters divider {...attributes} {...listeners} style={style}>
      <Modal
        open={status === 'Confirm Delete'}
        title='Are you sure you want to delete this media?'
        submit={handleSubmit}
        cancel={() => setStatus('')}
        submitText='Yes'
        cancelText='No'
      />

      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Box sx={{ position: 'relative' }}>
          {media.type === 'image' && (
            <Icon path={mdiImage} size={1} style={{ position: 'absolute', top: 5, right: 5 }} />
          )}

          {['youtube', 'video'].includes(media.type) && (
            <Icon path={mdiVideo} size={1} style={{ position: 'absolute', top: 5, right: 5 }} />
          )}

          {media.type === 'image' && <img src={media.url} style={{ maxHeight: 200, maxWidth: 200 }} />}

          {['youtube', 'video'].includes(media.type) && (
            <video
              style={{ maxHeight: 200, maxWidth: 200 }}
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

      <IconButton size='small' onClick={() => setStatus('Confirm Delete')}>
        <Icon path={mdiTrashCan} size={1} color={theme.palette.error.main} />
      </IconButton>
    </ListItem>
  );
};

export default MediaRow;
