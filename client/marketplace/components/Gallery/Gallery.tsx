'use client';
import { Box, IconButton } from '@mui/material';
import { ProductMediaInterface } from '../../../../_shared/types';
import Icon from '@mdi/react';
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';
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
      <Box sx={{ display: 'flex', width: '100%', height: '500px' }}>
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <IconButton
            size='small'
            onClick={() => (mediaIndex > 0 ? setMediaIndex(mediaIndex - 1) : undefined)}
            disabled={mediaIndex === 0}
          >
            <Icon path={mdiChevronLeft} size={2} />
          </IconButton>
        </Box>

        <Box sx={{ position: 'relative', overflowX: 'hidden', width: '100%', height: '100%' }}>
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
                  maxHeight: '500px',
                  top: 0,
                  right: `${mediaIndex * 100 - i * 100}%`,
                  backgroundImage: media.url ? `url('${media.url}')` : undefined,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'contain',
                  backgroundPosition: 'top center',
                  transition: 'right 0.15s ease-in-out'
                }}
              />
            ) : media.type === 'youtube' ? (
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
                  transition: 'right 0.15s ease-in-out',
                  minWidth: 0
                }}
              >
                <iframe
                  width='100%'
                  height='100%'
                  src={`https://www.youtube.com/embed/${media.path}`}
                  title='Levoit Air Purifier, Noise, Wind Speed, Power Measured'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                  allowFullScreen
                />

                {/* <Icon path={mdiPlayCircleOutline} size={5} color='black' style={{ position: 'absolute' }} /> */}
              </Box>
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
                  controls
                  controlsList='nodownload noremoteplayback noplaybackrate'
                  disablePictureInPicture
                  style={{ maxHeight: '100%', maxWidth: '100%' }}
                >
                  <source src={`${media.url}#t=0.001`} type='video/mp4' />
                </video>
              </Box>
            )
          )}
        </Box>

        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <IconButton
            size='small'
            onClick={() => setMediaIndex(mediaIndex === media.length - 1 ? mediaIndex : mediaIndex + 1)}
            disabled={Boolean(media.length === 0 || mediaIndex === media.length - 1)}
          >
            <Icon path={mdiChevronRight} size={2} />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', overflowX: 'auto', my: 1 }}>
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
