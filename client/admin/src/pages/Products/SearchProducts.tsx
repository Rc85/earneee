import { mdiMagnify } from '@mdi/js';
import { Icon } from '@mdi/react';
import { Box, TextField, Button } from '@mui/material';
import { FormEvent, useContext, useEffect, useState } from 'react';
import { SubcategoriesInterface } from '../../../../_shared/types';
import { SupabaseContext } from '../../../../_shared/components/SupabaseProvider/SupabaseProvider';

interface Props {
  onChange: (filters: { filter?: string; search?: string }) => void;
}

const SearchProducts = ({ onChange }: Props) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [subcategories, setSubcategories] = useState<SubcategoriesInterface[]>([]);
  const { supabase } = useContext(SupabaseContext);

  useEffect(() => {
    (async () => {
      await retrieveSubcategories();
    })();
  }, []);

  useEffect(() => {
    if (filter) {
      onChange({ filter, search });
    }
  }, [filter]);

  const retrieveSubcategories = async () => {
    if (supabase) {
      const subcategories = await supabase.from('subcategories').select().order('name');

      if (subcategories.data) {
        setSubcategories(subcategories.data);
      }
    }
  };

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
        {subcategories.map((subcategory) => (
          <option key={subcategory.id} value={subcategory.id}>
            {subcategory.name}
          </option>
        ))}
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
