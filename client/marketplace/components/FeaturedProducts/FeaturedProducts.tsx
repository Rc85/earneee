'use client';

import { mdiChevronLeft, mdiChevronRight, mdiCircle } from '@mdi/js';
import { Box, IconButton, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useState, useRef, useEffect } from 'react';
import { retrieveMarketplaceVariants } from '../../../_shared/api';
import { Loading } from '../../../_shared/components';
import { useAppSelector } from '../../../_shared/redux/store';
import Icon from '@mdi/react';
import { useRouter } from 'next/navigation';

let carouselInterval: NodeJS.Timer | undefined | void = undefined;

const FeaturedProducts = () => {
  const { country } = useAppSelector((state) => state.App);
  const { data } = retrieveMarketplaceVariants({ featured: true, limit: 5, country });
  const { variants = [] } = data || {};
  const [imageIndex, setImageIndex] = useState(0);
  const [carouselTimer, setCarouselTimer] = useState(5);
  const [containerLoaded, setContainerLoaded] = useState(false);
  const router = useRouter();
  const containerRef = useRef<any>(null);

  useEffect(() => {
    if (containerRef.current) {
      setContainerLoaded(true);
    }
  }, [containerRef.current]);

  useEffect(() => {
    if (variants.length > 1) {
      handleWindowOnFocus();

      window.addEventListener('focus', handleWindowOnFocus);

      window.addEventListener('blur', handleWindowOnBlur);
    }

    return () => {
      window.removeEventListener('focus', handleWindowOnFocus);

      window.removeEventListener('blur', handleWindowOnBlur);
    };
  }, [variants]);

  useEffect(() => {
    if (carouselTimer === 0) {
      if (imageIndex === variants.length - 1) {
        setImageIndex(0);
      } else {
        setImageIndex(imageIndex + 1);
      }
    }
  }, [carouselTimer]);

  const handleWindowOnFocus = () => {
    if (!carouselInterval) {
      carouselInterval = setInterval(() => setCarouselTimer((ms) => (!ms ? 5 : ms - 1)), 1000);
    }
  };

  const handleWindowOnBlur = () => {
    if (carouselInterval) {
      carouselInterval = clearInterval(carouselInterval);
    }
  };

  const handlePrevClick = () => {
    setCarouselTimer(5);

    setImageIndex(imageIndex !== 0 ? imageIndex - 1 : 0);
  };

  const handleNextClick = () => {
    setCarouselTimer(5);

    setImageIndex(imageIndex + 1);
  };

  const handleProductClick = (url: string) => {
    router.push(url);
  };

  const handleOnMouseOver = () => {
    if (document.hasFocus()) {
      handleWindowOnBlur();
    }
  };

  const handleOnMouseLeave = () => {
    if (document.hasFocus()) {
      handleWindowOnFocus();
    }
  };

  return (
    <Box ref={containerRef} sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex' }}>
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <IconButton size='small' onClick={handlePrevClick} disabled={!imageIndex}>
            <Icon path={mdiChevronLeft} size={2} />
          </IconButton>
        </Box>

        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            height: '500px'
          }}
          className='carousel-container'
        >
          {!containerLoaded ? (
            <Loading />
          ) : (
            <>
              {variants.map((variant, i) => {
                const urls = variant.urls || [];
                const countryCode = country || 'ca';
                const url =
                  urls.find((url) => url.country.toLowerCase() === countryCode.toLowerCase()) || urls[0];
                const media = variant.media?.[0] || variant.product?.media?.[0];
                const mediaUrl = media?.url;

                return (
                  <Box
                    key={variant.id}
                    onMouseOver={handleOnMouseOver}
                    onMouseLeave={handleOnMouseLeave}
                    onClick={() =>
                      handleProductClick(`/product/${variant.product?.id}?variant=${variant.id}`)
                    }
                    sx={{
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      backgroundColor: 'white',
                      backgroundImage: mediaUrl ? `url("${mediaUrl}")` : undefined,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      backgroundSize: (media?.width || 0) / (media?.height || 0) > 1.5 ? 'cover' : 'contain',
                      width: '100%',
                      height: '500px',
                      position: 'absolute',
                      transition: '0.15s linear',
                      top: 0,
                      right: `${imageIndex * 100 - i * 100}%`
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'flex-start',
                        p: 2
                      }}
                    >
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant='h5' color='white'>
                          {variant.product?.name} - {variant.name}
                        </Typography>

                        <Typography
                          color='white'
                          sx={{
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            WebkitLineClamp: 3
                          }}
                        >
                          {variant.excerpt || variant.product?.excerpt}
                        </Typography>
                      </Box>

                      {url && (
                        <Typography sx={{ ml: 1, flexShrink: 0 }} color='white' variant='h4'>
                          ${url.price.toFixed(2)} {url.currency.toUpperCase()}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </>
          )}
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <IconButton
            size='small'
            onClick={handleNextClick}
            disabled={!Boolean(imageIndex !== variants.length - 1)}
          >
            <Icon path={mdiChevronRight} size={2} />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
        {variants.map((_, i) => (
          <Icon
            key={i}
            path={mdiCircle}
            size={0.75}
            color={imageIndex === i ? undefined : grey[400]}
            style={{ marginRight: i - 1 !== variants.length ? '10px' : 0 }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default FeaturedProducts;
