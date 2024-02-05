import { Button, ButtonGroup, List } from '@mui/material';
import { Modal, Section } from '../../../../_shared/components';
import { Icon } from '@mdi/react';
import { mdiImage, mdiPlusBox, mdiUpload, mdiVideo } from '@mdi/js';
import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import AddMedia from './AddMedia';
import { SupabaseContext } from '../../../../_shared/components/SupabaseProvider/SupabaseProvider';
import { generateKey } from '../../../../../_shared/utils';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';
import { ProductMediaInterface } from '../../../../../_shared/types';
import MediaRow from './MediaRow';
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  closestCenter,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';

const VariantMedia = () => {
  const [status, setStatus] = useState('');
  const [media, setMedia] = useState<ProductMediaInterface[]>([]);
  const [type, setType] = useState('image');
  const { supabase } = useContext(SupabaseContext);
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();
  const { variantId, productId } = params;
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const fileInputRef = useRef<any>(null);

  useEffect(() => {
    if (supabase) {
      (async () => {
        await retrieveMedia();
      })();

      const dbChanges = supabase
        .channel('schema-db-changes')
        .on('postgres_changes', { event: 'INSERT', schema: 'public' }, async (payload) => {
          if (payload.table === 'product_media') {
            await retrieveMedia();
          }
        })
        .on('postgres_changes', { event: 'DELETE', schema: 'public' }, async (payload) => {
          if (payload.table === 'product_media') {
            await retrieveMedia();
          }
        });

      dbChanges.subscribe();

      return () => {
        dbChanges.unsubscribe();
      };
    }
  }, []);

  const retrieveMedia = async () => {
    if (supabase) {
      const media = await supabase
        .from('product_media')
        .select()
        .eq('variant_id', variantId)
        .order('ordinance');

      if (media.data) {
        setMedia(media.data);
      }
    }
  };

  const handleAddMedia = (url: string, type: string, videoId: string) => {
    if (supabase) {
      setStatus('Loading');

      const image = new Image();

      image.onload = async () => {
        const { width, height } = image;
        const ordinance = media.length;
        const id = generateKey(1);

        const response = await supabase.from('product_media').insert({
          id,
          url,
          path: videoId || null,
          height,
          width,
          ordinance,
          type,
          variant_id: variantId
        });

        setStatus('');

        if (response.error) {
          return enqueueSnackbar(response.error.message, { variant: 'error' });
        }

        enqueueSnackbar(response.statusText, { variant: 'success' });
      };

      image.src = url;
    }
  };

  const handleDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;

    if (active.id !== over?.id) {
      const oldIndex = media.findIndex((media) => media.id === active.id);
      const newIndex = media.findIndex((media) => media.id === over?.id);

      const sortedMedia = arrayMove(media, oldIndex, newIndex);

      for (const i in sortedMedia) {
        const index = parseInt(i);
        const media = sortedMedia[index];

        media.ordinance = index + 1;
      }

      if (supabase) {
        const response = await supabase.from('product_media').upsert(sortedMedia);

        if (!response.error) {
          setMedia(sortedMedia);
        }
      }
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];

      if (supabase) {
        setStatus('Loading');

        const response = await supabase.storage
          .from('product_media')
          .upload(`${productId}/${variantId}/${file.name}`, file);

        fileInputRef.current.value = '';

        if (response.error) {
          return enqueueSnackbar(response.error.message, { variant: 'error' });
        }

        enqueueSnackbar('File uploaded', { variant: 'success' });

        const id = generateKey(1);

        await supabase.from('product_media').insert({
          id,
          url: `${import.meta.env.VITE_STORAGE_URL}product_media/${response.data.path}`,
          path: response.data.path || null,
          type,
          variant_id: variantId,
          ordinance: media.length
        });
      }
    }
  };

  const handleUploadClick = (type: string) => {
    setType(type);

    fileInputRef.current?.click();
  };

  return (
    <Section
      title='MEDIA'
      titleVariant='h3'
      actions={[
        <Button
          key='add'
          startIcon={<Icon path={mdiPlusBox} size={1} />}
          sx={{ mr: 1 }}
          onClick={() => setStatus('Add')}
        >
          Add
        </Button>,
        <Button
          key='upload'
          startIcon={<Icon path={mdiUpload} size={1} />}
          onClick={() => setStatus('Upload')}
        >
          Upload
        </Button>
      ]}
    >
      {status === 'Add' && <AddMedia cancel={() => setStatus('')} submit={handleAddMedia} />}

      <Modal open={status === 'Upload'} title='Upload File' cancel={() => setStatus('')} disableBackdropClick>
        <ButtonGroup variant='contained' sx={{ width: '100%' }}>
          <Button
            startIcon={<Icon path={mdiImage} size={1} />}
            sx={{ flexGrow: 1 }}
            onClick={() => handleUploadClick('image')}
          >
            Image
          </Button>

          <Button
            startIcon={<Icon path={mdiVideo} size={1} />}
            sx={{ flexGrow: 1 }}
            onClick={() => handleUploadClick('video')}
          >
            Video
          </Button>
        </ButtonGroup>
      </Modal>

      <input type='file' ref={fileInputRef} hidden onChange={handleFileChange} />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={media} strategy={verticalListSortingStrategy}>
          {media.length > 0 && (
            <List disablePadding>
              {media.map((media) => (
                <MediaRow key={media.id} media={media} />
              ))}
            </List>
          )}
        </SortableContext>
      </DndContext>
    </Section>
  );
};

export default VariantMedia;
