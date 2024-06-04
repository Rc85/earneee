'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Section from '../../../_shared/components/Section/Section';
import { retrieveCategories, searchProducts } from '../../../_shared/api';
import { Avatar, Box, List, ListItem, ListItemButton, ListItemIcon, Typography } from '@mui/material';
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
            const affiliateName = urls[0]?.affiliate?.name;
            const excerpt = variant.excerpt || variant.product?.excerpt || '';

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
                    <Typography variant='h6' sx={{ mb: 0 }}>
                      {variant.product?.name} - {variant.name}
                    </Typography>

                    <Typography variant='body2' color='GrayText'>
                      {variant.product?.brand?.name}
                    </Typography>

                    {Boolean(excerpt) && <Typography>{excerpt}</Typography>}
                  </Box>
                </ListItemButton>

                <Box
                  sx={{
                    flexShrink: 0,
                    ml: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <Typography variant='h6' sx={{ mb: 0 }}>
                    {variant.product?.type === 'affiliate'
                      ? `$${lowestPrice.toFixed(2)}${
                          highestPrice ? ` - $${highestPrice.toFixed(2)}` : ''
                        } ${currency.toUpperCase()}`
                      : `$${(variant.price || 0).toFixed(2)} ${variant.currency?.toUpperCase()}`}
                  </Typography>

                  {Boolean(affiliateName) && <Typography variant='body2'>Sold on {affiliateName}</Typography>}
                </Box>
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
