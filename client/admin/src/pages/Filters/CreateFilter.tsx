import { useLocation, useNavigate } from 'react-router-dom';
import { Section } from '../../../../_shared/components';
import { ProductFilterOptionsInterface, ProductFiltersInterface } from '../../../../_shared/types';
import { Box, Button, CircularProgress, TextField } from '@mui/material';
import { Icon } from '@mdi/react';
import { mdiArrowUpDropCircle, mdiPlusBox, mdiRefresh } from '@mdi/js';
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { SupabaseContext } from '../../../../_shared/components/SupabaseProvider/SupabaseProvider';
import { useSnackbar } from 'notistack';
import { deepEqual, generateKey } from '../../../../_shared/utils';
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  closestCenter,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import FilterOptionRow from './FilterOptionRow';

const CreateFilter = () => {
  const [status, setStatus] = useState('');
  const location = useLocation();
  const { state } = location;
  const filter: ProductFiltersInterface | undefined = state.filter;
  const initialFilter: ProductFiltersInterface = {
    id: generateKey(1),
    name: '',
    field: '',
    type: 'range',
    use_from: null,
    scope: null,
    scope_name: null,
    created_at: new Date().toISOString(),
    updated_at: null,
    options: []
  };
  const initialState = filter || initialFilter;
  const [form, setForm] = useState<ProductFiltersInterface>(JSON.parse(JSON.stringify(initialState)));
  const navigate = useNavigate();
  const { supabase } = useContext(SupabaseContext);
  const { enqueueSnackbar } = useSnackbar();
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const [scopeSelections, setScopeSelections] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      if (supabase && form.scope) {
        const scope =
          form.scope === 'categories'
            ? await supabase.from('categories').select().order('name')
            : form.scope === 'subcategories'
            ? await supabase.from('subcategories_with_category').select().order('name')
            : await supabase.from('groups_with_subcategory_and_category').select().order('name');

        if (scope.data) {
          console.log(scope.data);

          setScopeSelections(scope.data);
        }
      }
    })();
  }, [form.scope]);

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();

    if (supabase) {
      setStatus('Loading');

      const response = await supabase.from('product_filters').upsert({
        id: form.id,
        name: form.name,
        field: form.field,
        type: form.type,
        scope: form.scope || null,
        scope_name: form.scope_name || null,
        use_from: form.use_from || null
      });

      const options = [];

      if (form.options) {
        for (const index in form.options) {
          const ordinance = parseInt(index + 1);
          const option = form.options[index];

          options.push({ id: option.id, name: option.name, filter_id: option.filter_id, ordinance });
        }

        const optionIds = options.map((option) => option.id);

        await supabase
          .from('product_filter_options')
          .delete()
          .not('id', 'in', `(${optionIds.join(',')})`);

        await supabase.from('product_filter_options').upsert(options);
      }

      setStatus('');

      if (response.error) {
        return enqueueSnackbar(response.error.message, { variant: 'error' });
      }

      enqueueSnackbar(filter ? 'Update' : response.statusText, { variant: 'success' });

      navigate(-1);
    }
  };

  const handleAddOptionClick = () => {
    const options = form.options ? [...form.options] : [];

    options.push({
      id: generateKey(1),
      name: '',
      value: '',
      filter_id: form.id,
      ordinance: options.length + 1,
      created_at: new Date().toISOString(),
      updated_at: null
    });

    setForm({ ...form, options });
  };

  const handleDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;

    if (form.options && active.id !== over?.id) {
      const options = [...form.options];

      const oldIndex = options.findIndex((filter) => filter.id === active.id);
      const newIndex = options.findIndex((filter) => filter.id === over?.id);

      const sortedFilterOptions = arrayMove(options, oldIndex, newIndex);

      for (const i in sortedFilterOptions) {
        const index = parseInt(i);
        const option = sortedFilterOptions[index];

        option.ordinance = index + 1;
      }

      setForm({ ...form, options: sortedFilterOptions });
    }
  };

  const handleRemoveOption = (index: number) => {
    const options = form.options ? [...form.options] : [];

    options.splice(index, 1);

    setForm({ ...form, options });
  };

  const handleOptionChange = (key: keyof ProductFilterOptionsInterface, value: any, index: number) => {
    const options = form.options ? [...form.options] : [];

    options[index][key] = value as never;

    setForm({ ...form, options });
  };

  const handleTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    let options = form.options ? [...form.options] : [];

    if (value === 'range') {
      options = [];
    } else if (value === 'radio') {
      options = options.splice(0, 1);
    }

    setForm({ ...form, type: value, options });
  };

  return (
    <Section
      title='Create Filter'
      titleVariant='h3'
      position='center'
      sx={{ p: 2 }}
      disableGutters
      component='form'
      onSubmit={handleSubmit}
    >
      <TextField
        label='Name'
        required
        autoFocus
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <TextField
        label='Field'
        required
        autoFocus
        value={form.field}
        onChange={(e) => setForm({ ...form, field: e.target.value })}
      />

      <TextField
        select
        label='Scope'
        SelectProps={{ native: true }}
        value={form.scope || ''}
        onChange={(e) => setForm({ ...form, scope: e.target.value })}
      >
        <option value=''></option>
        <option value='categories'>Categories</option>
        <option value='subcategories'>Subcategories</option>
        <option value='product_groups'>Groups</option>
      </TextField>

      {scopeSelections.length > 0 && (
        <TextField
          select
          SelectProps={{ native: true }}
          label='Scope Name'
          value={form.scope_name || ''}
          onChange={(e) => setForm({ ...form, scope_name: e.target.value })}
        >
          <option value=''></option>

          {scopeSelections.map((scopeName) => (
            <option key={scopeName.id} value={scopeName.id}>
              {scopeName.subcategory?.category
                ? `${scopeName.subcategory.category.name} / ${scopeName.subcategory.name} / ${scopeName.name}`
                : scopeName.category
                ? `${scopeName.category.name} / ${scopeName.name}`
                : scopeName.name}
            </option>
          ))}
        </TextField>
      )}

      <TextField
        label='Type'
        select
        SelectProps={{ native: true }}
        onChange={handleTypeChange}
        value={form.type}
      >
        <option value='range'>Range</option>
        <option value='select'>Dropdown Select</option>
        <option value='radio'>Single Option</option>
        <option value='checkbox'>Multiple Options</option>
      </TextField>

      {['select', 'radio', 'checkbox'].includes(form.type) && (
        <TextField
          label='Use From'
          select
          SelectProps={{ native: true }}
          value={form.use_from || ''}
          onChange={(e) => setForm({ ...form, use_from: e.target.value })}
          InputLabelProps={{ shrink: true }}
        >
          <option value=''>Customize</option>
          <option value='affiliates'>Affiliates</option>
          <option value='product_brands'>Product Brands</option>
        </TextField>
      )}

      {!form.use_from && ['select', 'radio', 'checkbox'].includes(form.type) && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
          <Button startIcon={<Icon path={mdiPlusBox} size={1} />} onClick={handleAddOptionClick}>
            Add Option
          </Button>
        </Box>
      )}

      {form.options && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={form.options} strategy={verticalListSortingStrategy}>
            {form.options?.map((option, i) => (
              <FilterOptionRow
                key={option.id}
                option={option}
                remove={() => handleRemoveOption(i)}
                onChange={(key, value) => handleOptionChange(key, value, i)}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}

      <LoadingButton
        type='submit'
        variant='contained'
        loading={status === 'Loading'}
        loadingPosition='start'
        loadingIndicator={<CircularProgress size={20} />}
        startIcon={<Icon path={mdiArrowUpDropCircle} size={1} />}
        fullWidth
        disabled={deepEqual(initialState, form)}
      >
        Submit
      </LoadingButton>

      <Button
        color='inherit'
        sx={{ mt: 1 }}
        startIcon={<Icon path={mdiRefresh} size={1} />}
        fullWidth
        onClick={() => setForm(JSON.parse(JSON.stringify(initialState)))}
      >
        Reset
      </Button>
    </Section>
  );
};

export default CreateFilter;
