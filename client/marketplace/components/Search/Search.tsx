'use client';

import { mdiMagnify } from '@mdi/js';
import Icon from '@mdi/react';
import { Box, InputBase, IconButton } from '@mui/material';
import { FormEvent, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { retrieveCategories } from '../../../_shared/api';

const Search = () => {
  const [searchValue, setSearchValue] = useState('');
  const { data } = retrieveCategories();
  const { categories } = data || {};
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();

    if (!searchValue) {
      return enqueueSnackbar('Enter something to search', { variant: 'error' });
    }

    let url = `/search?value=${searchValue}`;

    if (selectedCategory) {
      url = `${url}&category=${selectedCategory}`;
    }

    window.location.href = url;
  };

  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, ml: 3 }}
      component='form'
      onSubmit={handleSubmit}
    >
      <InputBase
        placeholder='Search...'
        onChange={(e) => setSearchValue(e.target.value)}
        value={searchValue}
        sx={{
          mb: '0 !important',
          pl: 1,
          borderWidth: 1,
          borderStyle: 'solid',
          borderTopLeftRadius: 4,
          borderBottomLeftRadius: 4,
          flexGrow: 1
        }}
      />

      <select
        className='search-category-select'
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        style={{ borderColor: '#000' }}
      >
        <option value=''>All categories</option>

        {categories?.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <IconButton
        size='small'
        color='primary'
        disableRipple
        onClick={handleSubmit}
        sx={{
          mr: 3,
          backgroundColor: 'black',
          borderTopRightRadius: 4,
          borderBottomRightRadius: 4,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0
        }}
      >
        <Icon path={mdiMagnify} size={1} />
      </IconButton>
    </Box>
  );
};

export default Search;
