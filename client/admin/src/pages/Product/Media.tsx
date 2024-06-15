import { Button, ButtonGroup, List } from '@mui/material';
import { Loading, Modal, Section } from '../../../../_shared/components';
import { Icon } from '@mdi/react';
import { mdiImage, mdiPlusBox, mdiUpload, mdiVideo } from '@mdi/js';
import { ChangeEvent, useRef, useState } from 'react';
import AddMedia from './AddMedia';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';
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
import {
  retrieveProductMedia,
  useAddProductMedia,
  useSortProductMedia,
  useUploadProductMedia
} from '../../../../_shared/api';
import { setIsLoading } from '../../../../_shared/redux/app';
import { useDispatch } from 'react-redux';

const VariantMedia = () => {
  const [status, setStatus] = useState('');
  const [type, setType] = useState('image');
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();
  const { id, productId } = params;
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const fileInputRef = useRef<any>(null);
  const { isLoading, data } = retrieveProductMedia({ productId: productId || id });
  const { media } = data || {};
  const dispatch = useDispatch();

  const handleSuccess = (response: any) => {
    if (response.data.statusText) {
      enqueueSnackbar(response.data.statusText, { variant: 'success' });
    }

    fileInputRef.current.value = '';

    setStatus('');
  };

  const handleError = (err: any) => {
    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }

    fileInputRef.current.value = '';

    setStatus('');
  };

  const uploadProductMedia = useUploadProductMedia(handleSuccess, handleError);
  const addProductMedia = useAddProductMedia(handleSuccess, handleError);
  const sortProductMedia = useSortProductMedia();

  const handleAddMedia = (url: string, type: string, videoId: string) => {
    setStatus('Loading');

    if (media) {
      if (type === 'image') {
        const image = new Image();

        image.onload = () => {
          const { width, height } = image;
          const ordinance = media.length;

          addProductMedia.mutate({
            id: '',
            url,
            path: videoId || null,
            height,
            width,
            ordinance,
            type,
            sizing: 'contain',
            useAsThumbnail: false,
            productId: productId || id!,
            status: 'enabled',
            createdAt: '',
            updatedAt: ''
          });
        };

        image.src = url;
      } else {
        addProductMedia.mutate({
          id: '',
          url,
          path: videoId,
          height: 0,
          width: 0,
          ordinance: media.length,
          type,
          sizing: 'contain',
          useAsThumbnail: false,
          productId: productId || id!,
          status: 'enabled',
          createdAt: '',
          updatedAt: ''
        });
      }
    }
  };

  const handleDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;

    if (active.id !== over?.id && media) {
      const oldIndex = media.findIndex((media) => media.id === active.id);
      const newIndex = media.findIndex((media) => media.id === over?.id);

      const sortedMedia = arrayMove(media, oldIndex, newIndex);

      for (const i in sortedMedia) {
        const index = parseInt(i);
        const media = sortedMedia[index];

        media.ordinance = index + 1;
      }

      sortProductMedia.mutate({ media: sortedMedia });
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];

      if (file) {
        if (type === 'image') {
          const fileReader = new FileReader();

          fileReader.onload = (e: any) => {
            const result = e.target?.result;

            dispatch(setIsLoading(true));

            uploadProductMedia.mutate({ productId: productId || id, image: result });
          };

          fileReader.readAsDataURL(file);
        } else if (type === 'video') {
          const formData = new FormData();

          formData.set('media', file);
          formData.set('productId', productId || id!);

          dispatch(setIsLoading(true));

          uploadProductMedia.mutate(formData);
        }
      }
    }

    fileInputRef.current.value = '';
  };

  const handleUploadClick = (type: string) => {
    setType(type);

    fileInputRef.current?.click();
  };

  return isLoading ? (
    <Loading />
  ) : (
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
        <SortableContext items={media || []} strategy={verticalListSortingStrategy}>
          {media && media.length > 0 && (
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
