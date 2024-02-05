'use client';
import { Box, IconButton } from '@mui/material';
import { ProductMediaInterface } from '../../../_shared/types';
import Icon from '@mdi/react';
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';
import { useEffect, useState } from 'react';

interface Props {
  images: ProductMediaInterface[];
}

const Gallery = ({ images }: Props) => {
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    setImageIndex(0);
  }, [images]);

  return (
    <>
      <Box sx={{ position: 'relative', width: '100%', height: '500px', overflowX: 'hidden' }}>
        {images.map((image, i) => (
          <Box
            key={image.id}
            onClick={() => window.open(image.url, '_blank')}
            sx={{
              cursor: 'pointer',
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              right: `${imageIndex * 100 - i * 100}%`,
              backgroundImage: image.url ? `url('${image.url}')` : undefined,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
              backgroundPosition: 'top center',
              transition: 'right 0.15s ease-in-out'
            }}
          />
        ))}

        {imageIndex > 0 && (
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
              onClick={() => (imageIndex > 0 ? setImageIndex(imageIndex - 1) : undefined)}
            >
              <Icon path={mdiChevronLeft} size={2} />
            </IconButton>
          </Box>
        )}

        {imageIndex !== images.length - 1 && (
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
              onClick={() => setImageIndex(imageIndex === images.length - 1 ? imageIndex : imageIndex + 1)}
            >
              <Icon path={mdiChevronRight} size={2} />
            </IconButton>
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', overflowX: 'auto', mt: 1 }}>
        {images.map((image, i) => (
          <Box
            key={image.id}
            onClick={() => setImageIndex(i)}
            sx={{
              opacity: imageIndex === i ? 1 : 0.5,
              cursor: 'pointer',
              width: '50px',
              height: '50px',
              backgroundImage: `url('${image.url}')`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
              backgroundPosition: 'top center',
              mr: 1
            }}
          />
        ))}
      </Box>
    </>
  );
};

export default Gallery;
