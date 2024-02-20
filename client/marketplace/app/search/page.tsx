'use client';

import { useSearchParams } from 'next/navigation';
import Section from '../../../_shared/components/Section/Section';
import { searchProducts } from '../../../_shared/api';
import {
  Avatar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';

const Search = () => {
  const searchParams = useSearchParams();
  const searchValue = searchParams.get('value');
  const category = searchParams.get('category');
  const { data } = searchProducts({ value: searchValue, category });
  const { variants } = data || {};

  return (
    <Section title='Search Results' titleVariant='h3'>
      {variants && variants.length > 0 ? (
        <List>
          {variants.map((variant) => (
            <ListItem key={variant.id}>
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
                  secondary={variant.product?.excerpt}
                />
              </ListItemButton>

              <Typography>
                {Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: variant.currency
                }).format(variant.price)}
              </Typography>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No search results</Typography>
      )}
    </Section>
  );
};

export default Search;
