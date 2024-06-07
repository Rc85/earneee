'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Section from '../../../_shared/components/Section/Section';
import { retrieveCategories, searchProducts } from '../../../_shared/api';
import { Avatar, Box, List, ListItem, ListItemButton, ListItemIcon, Typography } from '@mui/material';
import { useAppSelector } from '../../../_shared/redux/store';
import { ProductsInterface } from '../../../../_shared/types';

const Search = () => {
  const searchParams = useSearchParams();
  const searchValue = searchParams.get('value');
  const category = searchParams.get('category');
  const c = retrieveCategories({ categoryId: category as unknown as number });
  const { categories } = c.data || {};
  const { country } = useAppSelector((state) => state.App);
  const { data } = searchProducts({ value: searchValue, category, country });
  const { products } = data || {};
  const router = useRouter();

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

  return (
    <Section
      title='Search Results'
      subtitle={`Searching for "${searchValue}"${category ? ` in ${categories?.[0]?.name}` : ''}`}
      titleVariant='h3'
    >
      {products && products.length > 0 ? (
        <List>
          {products.map((product) => {
            const variantMedia = product.media || [];
            const productMedia = product?.media || [];
            const media = [...variantMedia, ...productMedia];
            const excerpt = product.excerpt;
            const price = product.url?.price || 0;
            const currency = product.url?.currency || 'CAD';
            const discount = product.url?.discount;

            let discountAmount = 0;

            if (discount) {
              if (discount.amountType === 'fixed') {
                discountAmount = discount.amount;
              } else if (discount.amountType === 'percentage') {
                discountAmount = price * (discount.amount / 100);
              }
            }

            const finalPrice = price - discountAmount;

            return (
              <ListItem
                key={product.id}
                disableGutters
                disablePadding
                divider
                sx={{ alignItems: 'flex-start' }}
              >
                <ListItemButton sx={{ alignItems: 'flex-start' }} onClick={() => handleProductClick(product)}>
                  <ListItemIcon>
                    <Avatar
                      src={media?.[0]?.url || '/broken.jpg'}
                      alt={product.name}
                      variant='square'
                      sx={{ mr: 2, width: 100, height: 100 }}
                      imgProps={{ sx: { objectFit: 'contain' } }}
                    />
                  </ListItemIcon>

                  <Box>
                    <Typography variant='h6' sx={{ mb: 0 }}>
                      {product.brand?.name} - {product.name}
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
                    ${finalPrice.toFixed(2)} {currency.toUpperCase()}
                  </Typography>

                  <Box sx={{ display: 'flex' }}>
                    {discount && (
                      <Typography variant='body2' color='red' sx={{ textAlign: 'center' }}>
                        {discount.amountType === 'fixed'
                          ? `$${discount.amount.toFixed(2)} off`
                          : `${discount.amount}% off`}
                      </Typography>
                    )}

                    {price !== finalPrice && (
                      <Typography variant='body2' sx={{ textAlign: 'center', ml: 1 }} color='GrayText'>
                        Was ${price.toFixed(2)}
                      </Typography>
                    )}
                  </Box>

                  {product.url?.affiliate && (
                    <Typography variant='body2'>Sold on {product.url.affiliate.name}</Typography>
                  )}
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
