'use client';

import { useSearchParams } from 'next/navigation';
import Section from '../../../_shared/components/Section/Section';
import { retrieveCategories, searchProducts } from '../../../_shared/api';
import {
  Avatar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';
import { useAppSelector } from '../../../_shared/redux/store';

const Search = () => {
  const searchParams = useSearchParams();
  const searchValue = searchParams.get('value');
  const category = searchParams.get('category');
  const c = retrieveCategories({ categoryId: category as unknown as number });
  const { categories } = c.data || {};
  const { data } = searchProducts({ value: searchValue, category });
  const { variants } = data || {};
  const { country } = useAppSelector((state) => state.App);

  return (
    <Section
      title='Search Results'
      subtitle={`Searching for "${searchValue}"${category ? ` in ${categories?.[0]?.name}` : ''}`}
      titleVariant='h3'
    >
      {variants && variants.length > 0 ? (
        <List>
          {variants.map((variant) => {
            const urls = variant.urls || [];
            const countryCode = country || 'ca';
            const url =
              urls.find((url) => url.country.toLowerCase() === countryCode.toLowerCase()) || urls[0];

            return (
              <ListItem key={variant.id} disableGutters disablePadding divider>
                <ListItemButton sx={{ alignItems: 'flex-start' }}>
                  <ListItemIcon>
                    <Avatar
                      src={variant.media?.[0]?.url || '/broken.jpg'}
                      alt={`${variant.product?.name} || ${variant.name}`}
                      variant='square'
                      sx={{ mr: 2, width: 100, height: 100 }}
                    />
                  </ListItemIcon>

                  <ListItemText
                    primary={`${variant.product?.name} - ${variant.name}`}
                    secondary={variant.excerpt || variant.product?.excerpt}
                  />
                </ListItemButton>

                {Boolean(url) && (
                  <Typography variant='h6'>
                    ${url.price.toFixed(2)} {url.currency.toUpperCase()}
                  </Typography>
                )}
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
