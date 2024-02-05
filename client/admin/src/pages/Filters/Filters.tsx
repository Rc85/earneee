import { Button, List } from '@mui/material';
import { Section } from '../../../../_shared/components';
import { Icon } from '@mdi/react';
import { mdiPlusBox } from '@mdi/js';
import { useNavigate } from 'react-router-dom';
import CreateFilter from './CreateFilter';
import { useContext, useEffect, useState } from 'react';
import { SupabaseContext } from '../../../../_shared/components/SupabaseProvider/SupabaseProvider';
import { ProductFiltersInterface } from '../../../../_shared/types';
import FilterRow from './FilterRow';

const Filters = () => {
  const navigate = useNavigate();
  const { supabase } = useContext(SupabaseContext);
  const [filters, setFilters] = useState<ProductFiltersInterface[]>([]);

  useEffect(() => {
    (async () => {
      await retrieveFilters();

      if (supabase) {
        const dbChanges = supabase
          .channel('schema-db-changes')
          .on('postgres_changes', { event: '*', schema: 'public' }, async (payload) => {
            if (payload.table === 'product_filters') {
              await retrieveFilters();
            }
          });

        dbChanges.subscribe();

        return () => {
          dbChanges.unsubscribe();
        };
      }
    })();
  }, []);

  const retrieveFilters = async () => {
    if (supabase) {
      const filters = await supabase.from('product_filters_with_options').select().order('name');

      if (filters.data) {
        setFilters(filters.data);
      }
    }
  };

  return (
    <Section
      title='Filters'
      titleVariant='h3'
      sx={{ p: 2 }}
      disableGutters
      position='center'
      actions={[
        <Button
          key='add'
          startIcon={<Icon path={mdiPlusBox} size={1} />}
          onClick={() => navigate('/filters/create', { state: { data: 'hello' } })}
        >
          Create
        </Button>
      ]}
    >
      <List disablePadding>
        {filters.map((filter) => (
          <FilterRow key={filter.id} filter={filter} />
        ))}
      </List>
    </Section>
  );
};

Filters.Create = CreateFilter;

export default Filters;
