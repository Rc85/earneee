'use client';

import { Box, IconButton, List, ListItem, ListItemButton, ListItemIcon } from '@mui/material';
import React, { useState } from 'react';
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
  const [prevCategories, setPrevCategories] = useState<CategoriesInterface[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoriesInterface>();

  const handleOnClick = () => {
    onClick();

    setPrevCategories([]);
    setSelectedCategory(undefined);
  };

  const handleNextClick = (category: CategoriesInterface) => {
    if (selectedCategory) {
      const prev = { ...selectedCategory };

      setPrevCategories([...prevCategories, prev]);
    }

    setSelectedCategory(category);
  };

  const handleBackClick = () => {
    const previous = [...prevCategories];
    const prev = previous.pop();

    setSelectedCategory(prev);
    setPrevCategories(previous);
  };

  return (
    <>
      <ListItem disableGutters divider sx={{ width: '100%' }} className='product'>
        <Link href='/' style={{ flexGrow: 1, flexShrink: 1 }}>
          <ListItemButton onClick={handleOnClick}>Main</ListItemButton>
        </Link>
      </ListItem>

      <Box
        sx={{
          width: '25%',
          maxWidth: '300px',
          minWidth: '300px',
          mr: 2,
          display: 'flex',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <Category
          categories={categories || []}
          onNextClick={handleNextClick}
          selectedCategory={selectedCategory}
          onBackClick={handleBackClick}
          prevCategories={prevCategories}
          onClick={handleOnClick}
        />
      </Box>
    </>
  );
};

const Category = ({
  categories,
  onNextClick,
  selectedCategory,
  onBackClick,
  prevCategories,
  onClick
}: {
  categories: CategoriesInterface[];
  prevCategories: CategoriesInterface[];
  onNextClick: (category: CategoriesInterface) => void;
  selectedCategory: CategoriesInterface | undefined;
  onBackClick: () => void;
  onClick: () => void;
}) => {
  const hideLeft =
    (selectedCategory && !categories[0]?.parentId) ||
    (prevCategories.length > 0 &&
      categories[0]?.parentId &&
      prevCategories.find((category) => category.id === categories[0]?.parentId));
  const show =
    (!selectedCategory && !categories[0]?.parentId) ||
    (selectedCategory && selectedCategory.id === categories[0]?.parentId);

  return (
    <>
      <List
        disablePadding
        sx={{
          width: '100%',
          position: 'absolute',
          left: hideLeft ? '-100%' : show ? 0 : '100%',
          transition: '0.15s ease-in-out'
        }}
      >
        {selectedCategory && (
          <ListItem disableGutters divider sx={{ width: '100%' }} className='product'>
            <ListItemButton onClick={onBackClick}>
              <ListItemIcon>
                <Icon path={mdiChevronLeft} size={1} />
              </ListItemIcon>
              Back
            </ListItemButton>
          </ListItem>
        )}

        {categories.map((category) => (
          <ListItem
            key={category.id}
            disableGutters
            divider
            sx={{ width: '100%', pr: 1 }}
            className='product'
          >
            <Link href={`/products/${category.id}`} style={{ flexGrow: 1, flexShrink: 1 }}>
              <ListItemButton onClick={onClick}>{category.name}</ListItemButton>
            </Link>

            {category.subcategories && category.subcategories.length > 0 && (
              <IconButton size='small' sx={{ flexShrink: 1 }} onClick={() => onNextClick(category)}>
                <Icon path={mdiChevronRight} size={1} />
              </IconButton>
            )}
          </ListItem>
        ))}
      </List>

      {categories.map((category) =>
        category.subcategories && category.subcategories.length > 0 ? (
          <Category
            key={category.id}
            categories={category.subcategories}
            onNextClick={onNextClick}
            selectedCategory={selectedCategory}
            onBackClick={onBackClick}
            prevCategories={prevCategories}
            onClick={onClick}
          />
        ) : null
      )}
    </>
  );
};

export default Categories;
