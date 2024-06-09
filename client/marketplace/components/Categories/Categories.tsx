'use client';

import { Box, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useState } from 'react';
import { CategoriesInterface } from '../../../../_shared/types';
import { mdiChevronRight, mdiChevronLeft } from '@mdi/js';
import Icon from '@mdi/react';
import { retrieveCategories } from '../../../_shared/api';
import Link from 'next/link';

interface Props {
  onClick: () => void;
}

const Categories = ({ onClick }: Props) => {
  const { data } = retrieveCategories({ hasProducts: true });
  const { categories } = data || {};
  const [selectedCategories, setSelectedCategories] = useState<CategoriesInterface[]>([]);

  const handleCategoryClick = (category: CategoriesInterface) => {
    const categories = [...selectedCategories];

    categories.push(category);

    setSelectedCategories(categories);
  };

  const handleBackClick = () => {
    if (selectedCategories.length > 0) {
      const categories = [...selectedCategories];

      categories.pop();

      setSelectedCategories(categories);
    }
  };

  const handleOnClick = () => {
    setSelectedCategories([]);

    onClick();
  };

  return (
    <Box
      sx={{
        width: '25%',
        maxWidth: '300px',
        minWidth: '300px',
        mr: 2,
        display: 'flex',
        justifyContent: 'center',
        overflow: 'hidden',
        flexShrink: 0
      }}
    >
      <List
        disablePadding
        sx={{
          width: '100%',
          position: 'absolute',
          left: selectedCategories.length > 0 ? '-100%' : 0,
          transition: '0.15s ease-in-out'
        }}
      >
        <ListItem disableGutters divider sx={{ width: '100%' }} className='product'>
          <Link href='/' style={{ flexGrow: 1, flexShrink: 1 }}>
            <ListItemButton onClick={handleOnClick}>Main</ListItemButton>
          </Link>
        </ListItem>

        {categories?.map((category) => (
          <ListItem
            key={category.id}
            disableGutters
            divider
            sx={{ width: '100%', pr: 1 }}
            className='product'
          >
            <Link href={`/products/${category.id}`} style={{ flexGrow: 1, flexShrink: 1 }}>
              <ListItemButton onClick={handleOnClick}>{category.name}</ListItemButton>
            </Link>

            {category.subcategories && category.subcategories.length > 0 && (
              <IconButton size='small' sx={{ flexShrink: 1 }} onClick={() => handleCategoryClick(category)}>
                <Icon path={mdiChevronRight} size={1} />
              </IconButton>
            )}
          </ListItem>
        ))}
      </List>

      <List
        disablePadding
        sx={{
          width: '100%',
          position: 'absolute',
          left: selectedCategories.length > 1 ? '-100%' : selectedCategories.length === 1 ? 0 : '100%',
          transition: '0.15s ease-in-out'
        }}
      >
        <ListItem disableGutters divider sx={{ width: '100%' }}>
          <ListItemButton onClick={handleBackClick}>
            <ListItemIcon>
              <Icon path={mdiChevronLeft} size={1} />
            </ListItemIcon>

            <ListItemText primary='Back' />
          </ListItemButton>
        </ListItem>

        {selectedCategories[0]?.subcategories?.map((category) => (
          <ListItem
            key={category.id}
            disableGutters
            divider
            sx={{ width: '100%', pr: 1 }}
            className='product'
          >
            <Link
              href={`/products/${selectedCategories[0]?.id}/${category.id}`}
              style={{ flexShrink: 1, flexGrow: 1 }}
            >
              <ListItemButton onClick={handleOnClick}>{category.name}</ListItemButton>
            </Link>

            {category.subcategories && category.subcategories.length > 0 && (
              <IconButton size='small' sx={{ flexShrink: 1 }} onClick={() => handleCategoryClick(category)}>
                <Icon path={mdiChevronRight} size={1} />
              </IconButton>
            )}
          </ListItem>
        ))}
      </List>

      <List
        disablePadding
        sx={{
          width: '100%',
          position: 'absolute',
          left: selectedCategories.length === 2 ? 0 : '100%',
          transition: '0.15s ease-in-out'
        }}
      >
        <ListItem disableGutters divider sx={{ width: '100%' }}>
          <ListItemButton onClick={handleBackClick}>
            <ListItemIcon>
              <Icon path={mdiChevronLeft} size={1} />
            </ListItemIcon>

            <ListItemText primary='Back' />
          </ListItemButton>
        </ListItem>

        {selectedCategories[0]?.subcategories?.[0]?.subcategories?.map((category) => (
          <ListItem key={category.id} disableGutters divider sx={{ width: '100%' }} className='product'>
            <Link
              href={`/products/${selectedCategories[0]?.id}/${selectedCategories[1]?.id}/${category.id}`}
              style={{ flexShrink: 1, flexGrow: 1 }}
            >
              <ListItemButton onClick={handleOnClick}>{category.name}</ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Categories;
