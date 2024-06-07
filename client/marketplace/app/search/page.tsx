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
            const urls = product?.urls || [];

            urls.sort((a, b) => (a.price < b.price ? -1 : 1));

            const lowestPrice = urls[0]?.price || 0;
            const highestPrice = urls.length > 1 ? urls[urls.length - 1]?.price : 0;
            const currency = urls[0]?.currency || 'cad';
            const variantMedia = product.media || [];
            const productMedia = product?.media || [];
            const media = [...variantMedia, ...productMedia];
            const affiliateName = urls[0]?.affiliate?.name;
            const excerpt = product.excerpt;
            const discountTexts = [];
            const totalFixedDiscount = (
              product.discounts?.filter((discount) => discount.amountType === 'fixed') || []
            )
              .map((discount) => discount.amount)
              .reduce((acc, amount) => acc + amount, 0);
            const totalPercentageDiscount = (
              product.discounts?.filter((discount) => discount.amountType === 'percentage') || []
            )
              .map((discount) => discount.amount)
              .reduce((acc, amount) => acc + amount, 0);

            const discountedLowestPrice =
              lowestPrice -
              totalFixedDiscount -
              (lowestPrice - totalFixedDiscount) * (totalPercentageDiscount / 100);

            const discountedHighestPrice =
              highestPrice -
              totalFixedDiscount -
              (highestPrice - totalFixedDiscount) * (totalPercentageDiscount / 100);

            if (product.discounts) {
              for (const discount of product.discounts) {
                if (discount.amountType === 'percentage') {
                  discountTexts.push(`${discount.amount}% off`);
                }

                if (discount.amountType === 'fixed') {
                  discountTexts.push(`$${discount.amount} off`);
                }
              }
            }

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
                    ${discountedLowestPrice.toFixed(2)}
                    {discountedHighestPrice ? ` - $${discountedHighestPrice.toFixed(2)}` : ''}{' '}
                    {currency.toUpperCase()}
                  </Typography>

                  <Box sx={{ display: 'flex' }}>
                    {discountTexts.length > 0 && (
                      <Typography variant='body2' color='red' sx={{ textAlign: 'center' }}>
                        {discountTexts.join(', ')}
                      </Typography>
                    )}

                    {lowestPrice !== discountedLowestPrice && (
                      <Typography variant='body2' sx={{ textAlign: 'center', ml: 1 }} color='GrayText'>
                        Was ${lowestPrice.toFixed(2)}
                        {highestPrice ? ` - ${highestPrice.toFixed(2)}` : ''}
                      </Typography>
                    )}
                  </Box>

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
