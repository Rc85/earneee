import { Button } from '@mui/material';
import { Section } from '../../../../_shared/components';
import { Icon } from '@mdi/react';
import { mdiPlusBox } from '@mdi/js';
import { useContext, useEffect, useState } from 'react';
import AddOption from './AddOption';
import { ProductOptionsInterface } from '../../../../_shared/types';
import { SupabaseContext } from '../../../../_shared/components/SupabaseProvider/SupabaseProvider';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';
import OptionRow from './OptionRow';

const VariantOptions = () => {
  const [status, setStatus] = useState('');
  const { supabase } = useContext(SupabaseContext);
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();
  const { variantId } = params;
  const [options, setOptions] = useState<ProductOptionsInterface[]>([]);

  useEffect(() => {
    (async () => {
      if (supabase) {
        await retrieveOptions();

        const dbChanges = supabase
          .channel('schema-db-changes')
          .on('postgres_changes', { event: '*', schema: 'public' }, async (payload) => {
            if (['option_selections', 'product_options'].includes(payload.table)) {
              await retrieveOptions();
            }
          });

        dbChanges.subscribe();

        return () => {
          dbChanges.unsubscribe();
        };
      }
    })();
  }, []);

  const retrieveOptions = async () => {
    if (supabase) {
      const options = await supabase
        .from('product_options_with_selections')
        .select()
        .eq('variant_id', variantId)
        .order('name');

      if (options.data) {
        setOptions(options.data);
      }
    }
  };

  const handleAddOption = async (option: ProductOptionsInterface) => {
    if (supabase) {
      setStatus('Loading');

      const response = await supabase.from('product_options').upsert({
        id: option.id,
        name: option.name,
        status: option.status,
        variant_id: variantId,
        required: option.required
      });

      if (response.error) {
        setStatus('');

        const message = response.error.code === '23505' ? 'Name already exists' : response.error.message;

        return enqueueSnackbar(message, { variant: 'error' });
      }

      if (option.selections) {
        const selections = [];

        for (const index in option.selections) {
          const i = parseInt(index);
          const selection = option.selections[i];
          selection.option_id = option.id;

          selections.push({
            id: selection.id,
            name: selection.name,
            price: selection.price,
            option_id: option.id,
            ordinance: i + 1,
            status: selection.status
          });
        }

        const response = await supabase.from('option_selections').upsert(selections);

        setStatus('');

        if (response.error) {
          const message =
            response.error.code === '23505' ? 'Selection name must unique' : response.error.message;

          await supabase.from('product_options').delete().eq('id', option.id);

          return enqueueSnackbar(message, { variant: 'error' });
        }
      }

      setStatus('');

      enqueueSnackbar('Created', { variant: 'success' });
    }
  };

  return (
    <Section
      title='OPTIONS'
      titleVariant='h3'
      actions={[
        <Button key='add' startIcon={<Icon path={mdiPlusBox} size={1} />} onClick={() => setStatus('Add')}>
          Add
        </Button>
      ]}
    >
      {status === 'Add' && <AddOption cancel={() => setStatus('')} submit={handleAddOption} />}

      {options.map((option) => (
        <OptionRow key={option.id} option={option} />
      ))}
    </Section>
  );
};

export default VariantOptions;
