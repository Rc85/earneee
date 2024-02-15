'use client';
import { Box, IconButton } from '@mui/material';
import { ProductMediaInterface } from '../../../../_shared/types';
import Icon from '@mdi/react';
import { mdiChevronLeft, mdiChevronRight, mdiPlayCircleOutline } from '@mdi/js';
import { useEffect, useState } from 'react';

interface Props {
  media: ProductMediaInterface[];
}

const Gallery = ({ media }: Props) => {
  const [mediaIndex, setMediaIndex] = useState(0);

  useEffect(() => {
    setMediaIndex(0);
  }, [media]);

  return (
    <>
      <Box sx={{ position: 'relative', width: '100%', height: '500px', overflowX: 'hidden' }}>
        {media.map((media, i) =>
          media.type === 'image' ? (
            <Box
              key={media.id}
              onClick={() => window.open(media.url, '_blank')}
              sx={{
                cursor: 'pointer',
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                right: `${mediaIndex * 100 - i * 100}%`,
                backgroundImage: media.url ? `url('${media.url}')` : undefined,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundPosition: 'top center',
                transition: 'right 0.15s ease-in-out'
              }}
            />
          ) : (
            <Box
              key={media.id}
              sx={{
                position: 'absolute',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                top: 0,
                right: `${mediaIndex * 100 - i * 100}%`,
                transition: 'right 0.15s ease-in-out'
              }}
            >
              <video
                onClick={() => window.open(media.url, '_blank')}
                style={{ maxHeight: '100%', maxWidth: '100%', opacity: 0.75, cursor: 'pointer' }}
                poster={
                  media.type === 'youtube' ? `http://img.youtube.com/vi/${media.path}/default.jpg` : undefined
                }
              >
                <source src={`${media.url}#t=0.001`} type='video/mp4' />
              </video>

              <Icon path={mdiPlayCircleOutline} size={5} color='black' style={{ position: 'absolute' }} />
            </Box>
          )
        )}

        {mediaIndex > 0 && (
          <Box
            sx={{
              position: 'absolute',
              height: '100%',
              left: 0,
              top: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <IconButton
              size='small'
              onClick={() => (mediaIndex > 0 ? setMediaIndex(mediaIndex - 1) : undefined)}
            >
              <Icon path={mdiChevronLeft} size={2} />
            </IconButton>
          </Box>
        )}

        {mediaIndex !== media.length - 1 && (
          <Box
            sx={{
              position: 'absolute',
              height: '100%',
              right: 0,
              top: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <IconButton
              size='small'
              onClick={() => setMediaIndex(mediaIndex === media.length - 1 ? mediaIndex : mediaIndex + 1)}
            >
              <Icon path={mdiChevronRight} size={2} />
            </IconButton>
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', overflowX: 'auto', mt: 1 }}>
        {media.map((media, i) =>
          media.type === 'image' ? (
            <Box
              key={media.id}
              onClick={() => setMediaIndex(i)}
              sx={{
                opacity: mediaIndex === i ? 1 : 0.5,
                cursor: 'pointer',
                width: '50px',
                height: '50px',
                backgroundImage: `url('${media.url}')`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundPosition: 'top center',
                mr: 1
              }}
            />
          ) : (
            <video
              onClick={() => setMediaIndex(i)}
              style={{
                opacity: mediaIndex === i ? 1 : 0.5,
                maxHeight: '50px',
                maxWidth: '50px',
                cursor: 'pointer',
                marginRight: '5px'
              }}
              poster={
                media.type === 'youtube' ? `http://img.youtube.com/vi/${media.path}/default.jpg` : undefined
              }
            >
              <source src={`${media.url}#t=0.001`} type='video/mp4' />
            </video>
          )
        )}
      </Box>
    </>
  );
};

export default Gallery;
