'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Section from '../../../_shared/components/Section/Section';
import { retrieveCategories, searchProducts } from '../../../_shared/api';
import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';
import { ProductVariantsInterface } from '../../../../_shared/types';

const Search = () => {
  const searchParams = useSearchParams();
  const searchValue = searchParams.get('value');
  const category = searchParams.get('category');
  const c = retrieveCategories({ categoryId: category as unknown as number });
  const { categories } = c.data || {};
  const { data } = searchProducts({ value: searchValue, category });
  const { variants } = data || {};
  const router = useRouter();

  const handleProductClick = (variant: ProductVariantsInterface) => {
    if (variant.product?.type === 'affiliate') {
      const urls = variant.urls?.[0];

      if (urls) {
        const { url } = urls;

        if (url) {
          window.open(url, '_blank');
        }
      }
    } else {
      router.push(`/product/${variant.product?.id}?variant=${variant.id}`);
    }
  };

  return (
    <Section
      title='Search Results'
      subtitle={`Searching for "${searchValue}"${category ? ` in ${categories?.[0]?.name}` : ''}`}
      titleVariant='h3'
    >
      {variants && variants.length > 0 ? (
        <List>
          {variants.map((variant) => {
            const urls = variant?.urls || [];

            urls.sort((a, b) => (a.price < b.price ? -1 : 1));

            const lowestPrice = urls[0]?.price || 0;
            const highestPrice = urls.length > 1 ? urls[urls.length - 1]?.price : 0;
            const currency = urls[0]?.currency || 'cad';
            const variantMedia = variant.media || [];
            const productMedia = variant.product?.media || [];
            const media = [...variantMedia, ...productMedia];

            return (
              <ListItem
                key={variant.id}
                disableGutters
                disablePadding
                divider
                sx={{ alignItems: 'flex-start' }}
              >
                <ListItemButton sx={{ alignItems: 'flex-start' }} onClick={() => handleProductClick(variant)}>
                  <ListItemIcon>
                    <Avatar
                      src={media?.[0]?.url || '/broken.jpg'}
                      alt={`${variant.product?.name} || ${variant.name}`}
                      variant='square'
                      sx={{ mr: 2, width: 100, height: 100 }}
                      imgProps={{ sx: { objectFit: 'contain' } }}
                    />
                  </ListItemIcon>

                  <Box>
                    <ListItemText
                      primary={`${variant.product?.name} - ${variant.name}`}
                      secondary={variant.product?.brand?.name}
                    />

                    <Typography>
                      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aperiam, dolorem corporis
                      reiciendis eveniet sint, incidunt at eaque perferendis sunt velit nostrum, recusandae
                      fuga magni a mollitia dolor repellendus deleniti magnam.
                    </Typography>
                  </Box>
                </ListItemButton>

                <Typography variant='h6' sx={{ flexShrink: 0, ml: 1 }}>
                  ${lowestPrice.toFixed(2)}
                  {highestPrice ? ` - ${highestPrice.toFixed(2)}` : ''} {currency.toUpperCase()}
                </Typography>
              </ListItem>
            );
          })}
        </List>
      ) : (
        <Typography>No search results</Typography>
      )}
    </Section>
  );
};

export default Search;
