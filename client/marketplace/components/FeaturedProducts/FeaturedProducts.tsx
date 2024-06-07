'use client';

import { mdiChevronLeft, mdiChevronRight, mdiCircle } from '@mdi/js';
import { Box, IconButton, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useState, useRef, useEffect } from 'react';
import { retrieveMarketplaceProducts } from '../../../_shared/api';
import { Loading } from '../../../_shared/components';
import { useAppSelector } from '../../../_shared/redux/store';
import Icon from '@mdi/react';
import { useRouter } from 'next/navigation';
import { ProductsInterface } from '../../../../_shared/types';

let carouselInterval: NodeJS.Timer | undefined | void = undefined;

const FeaturedProducts = () => {
  const { country } = useAppSelector((state) => state.App);
  const { data } = retrieveMarketplaceProducts({ featured: true, limit: 5, country });
  const { products = [] } = data || {};
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
    if (products.length > 1) {
      handleWindowOnFocus();

      window.addEventListener('focus', handleWindowOnFocus);

      window.addEventListener('blur', handleWindowOnBlur);
    }

    return () => {
      window.removeEventListener('focus', handleWindowOnFocus);

      window.removeEventListener('blur', handleWindowOnBlur);
    };
  }, [products]);

  useEffect(() => {
    if (carouselTimer === 0) {
      if (imageIndex === products.length - 1) {
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

  const handleProductClick = (product: ProductsInterface) => {
    const urls = product.urls?.[0];

    if (urls?.type === 'affiliate') {
      if (urls) {
        const { url } = urls;

        if (url) {
          window.open(url, '_blank', 'noopener, noreferrer');
        }
      }
    } else {
      router.push(`/product/${product.id}`);
    }
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
              {products.map((product, i) => {
                const urls = product.urls || [];

                urls.sort((a, b) => (a.price < b.price ? -1 : 1));

                const lowestPrice = urls[0]?.price || 0;
                const highestPrice = urls.length > 1 ? urls[urls.length - 1]?.price : 0;
                const currency = urls[0]?.currency || 'cad';
                const media = product?.media?.[0];
                const mediaUrl = media?.url;
                const affiliateName = urls[0]?.affiliate?.name;

                return (
                  <Box
                    key={product.id}
                    onMouseOver={handleOnMouseOver}
                    onMouseLeave={handleOnMouseLeave}
                    onClick={() => handleProductClick(product)}
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
                        alignItems: 'center',
                        p: 2
                      }}
                    >
                      <Box sx={{ flexGrow: 1, mr: 1 }}>
                        <Typography variant='h5' color='white'>
                          {product.brand?.name} {product.name}
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
                          {product.excerpt}
                        </Typography>
                      </Box>

                      <Box sx={{ ml: 1, flexShrink: 0 }}>
                        <Typography sx={{ mb: 0, textAlign: 'center' }} color='white' variant='h4'>
                          {`$${lowestPrice.toFixed(2)}${
                            highestPrice ? ` - $${highestPrice.toFixed(2)}` : ''
                          } ${currency.toUpperCase()}`}
                        </Typography>

                        {Boolean(affiliateName) && (
                          <Typography variant='body2' color='white' sx={{ textAlign: 'center' }}>
                            Sold on {affiliateName}
                          </Typography>
                        )}
                      </Box>
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
            disabled={!Boolean(imageIndex !== products.length - 1)}
          >
            <Icon path={mdiChevronRight} size={2} />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
        {products.map((_, i) => (
          <Icon
            key={i}
            path={mdiCircle}
            size={0.75}
            color={imageIndex === i ? undefined : grey[400]}
            style={{ marginRight: i - 1 !== products.length ? '10px' : 0 }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default FeaturedProducts;
