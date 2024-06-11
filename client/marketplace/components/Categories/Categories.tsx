'use client';

import { Box, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useEffect, useState } from 'react';
import { CategoriesInterface } from '../../../../_shared/types';
import { mdiChevronRight, mdiChevronLeft } from '@mdi/js';
import Icon from '@mdi/react';
import { listCategories } from '../../../_shared/api';
import Link from 'next/link';

interface Props {
  onClick: () => void;
}

const Categories = ({ onClick }: Props) => {
  const { data } = listCategories();
  const { categories } = data || {};
  const topCategories = categories?.[0];
  const [prevCategories, setPrevCategories] = useState<CategoriesInterface[][]>([]);
  const [selectedCategories, setSelectedCategories] = useState<CategoriesInterface[]>([]);

  useEffect(() => {
    setSelectedCategories(topCategories || []);
  }, [topCategories]);

  const handleCategoryClick = (category: CategoriesInterface, prev: CategoriesInterface[]) => {
    const cat = categories?.find((c) => c[0]?.parentId === category.id) || [];

    setPrevCategories([...prevCategories, prev]);
    setSelectedCategories([...cat]);
  };

  const handleBackClick = () => {
    const prev = [...prevCategories];
    const prevCategory = prev.pop();

    setSelectedCategories(!prevCategory || !prevCategory[0].parentId ? [] : prevCategory);
    setPrevCategories(prev);
  };

  const handleOnClick = () => {
    onClick();

    setPrevCategories([]);
    setSelectedCategories(topCategories || []);
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
      {/* <List
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

        {topCategories.map((category) => (
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

            {categories?.find((c) => c[0]?.parentId === category.id) && (
              <IconButton
                size='small'
                sx={{ flexShrink: 1 }}
                onClick={() => handleCategoryClick(category, topCategories)}
              >
                <Icon path={mdiChevronRight} size={1} />
              </IconButton>
            )}
          </ListItem>
        ))}
      </List> */}

      {categories?.map((subcategory) => (
        <List
          key={subcategory[0].id}
          disablePadding
          sx={{
            width: '100%',
            position: 'absolute',
            left: prevCategories.find((categories) => categories[0]?.parentId === subcategory[0]?.parentId)
              ? '-100%'
              : selectedCategories[0] &&
                (!selectedCategories[0].parentId ||
                  selectedCategories[0]?.parentId === subcategory[0]?.parentId)
              ? 0
              : '100%',
            transition: '0.15s ease-in-out'
          }}
        >
          {topCategories?.[0]?.parentId !== subcategory[0].parentId ? (
            <ListItem disableGutters divider sx={{ width: '100%' }}>
              <ListItemButton onClick={handleBackClick}>
                <ListItemIcon>
                  <Icon path={mdiChevronLeft} size={1} />
                </ListItemIcon>

                <ListItemText primary='Back' />
              </ListItemButton>
            </ListItem>
          ) : (
            <ListItem disableGutters divider sx={{ width: '100%' }} className='product'>
              <Link href='/' style={{ flexGrow: 1, flexShrink: 1 }}>
                <ListItemButton onClick={handleOnClick}>Main</ListItemButton>
              </Link>
            </ListItem>
          )}

          {subcategory.map((category) => (
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

              {categories?.find((c) => c[0]?.parentId === category.id) && (
                <IconButton
                  size='small'
                  sx={{ flexShrink: 1 }}
                  onClick={() => handleCategoryClick(category, subcategory)}
                >
                  <Icon path={mdiChevronRight} size={1} />
                </IconButton>
              )}
            </ListItem>
          ))}
        </List>
      ))}

      {/* <List
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
      </List> */}
    </Box>
  );
};

export default Categories;
