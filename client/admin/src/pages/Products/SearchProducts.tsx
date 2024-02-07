import { mdiMagnify } from '@mdi/js';
import { Icon } from '@mdi/react';
import { Box, TextField, Button } from '@mui/material';
import { FormEvent, useEffect, useState } from 'react';

interface Props {
  onChange: (filters: { filter?: string; search?: string }) => void;
}

const SearchProducts = ({ onChange }: Props) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (filter) {
      onChange({ filter, search });
    }
  }, [filter]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    handleSearchClick();
  };

  const handleSearchClick = () => {
    onChange({ filter, search });
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
      <TextField
        label='Filter'
        select
        SelectProps={{ native: true }}
        sx={{ maxWidth: 200 }}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value=''></option>
        {/* {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))} */}
      </TextField>

      <Box
        sx={{ display: 'flex', alignItems: 'flex-start', flexGrow: 1 }}
        component='form'
        onSubmit={handleSubmit}
      >
        <TextField label='Search' sx={{ ml: 1 }} onChange={(e) => setSearch(e.target.value)} />

        <Button
          color='info'
          sx={{ flexShrink: 0, ml: 1 }}
          startIcon={<Icon path={mdiMagnify} size={1} />}
          onClick={handleSearchClick}
        >
          Search
        </Button>
      </Box>
    </Box>
  );
};

export default SearchProducts;
