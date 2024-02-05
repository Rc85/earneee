import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Switch,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { OptionSelectionsInterface, ProductOptionsInterface } from '../../../../../_shared/types';
import { Icon } from '@mdi/react';
import { mdiChevronDown, mdiContentSave, mdiPencil, mdiRefresh, mdiTrashCan } from '@mdi/js';
import { FormEvent, MouseEvent, useCallback, useContext, useEffect, useState } from 'react';
import { SupabaseContext } from '../../../../_shared/components/SupabaseProvider/SupabaseProvider';
import { Modal } from '../../../../_shared/components';
import { LoadingButton } from '@mui/lab';
import { deepEqual, generateKey } from '../../../../../_shared/utils';
import { useSnackbar } from 'notistack';
import OptionForm from './OptionForm';

interface Props {
  option: ProductOptionsInterface;
}

const OptionRow = ({ option }: Props) => {
  const theme = useTheme();
  const [status, setStatus] = useState('');
  const { supabase } = useContext(SupabaseContext);
  const [form, setForm] = useState<ProductOptionsInterface>(JSON.parse(JSON.stringify(option)));
  const [initialState, setInitialState] = useState<ProductOptionsInterface>(
    JSON.parse(JSON.stringify(option))
  );
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setForm(JSON.parse(JSON.stringify(option)));

    setInitialState(JSON.parse(JSON.stringify(option)));
  }, [option]);

  const handleToggle = async (e: MouseEvent) => {
    e.stopPropagation();

    if (supabase) {
      setStatus('Loading');

      const status = option.status === 'available' ? 'unavailable' : 'available';

      await supabase.from('product_options').update({ status }).eq('id', option.id);

      setStatus('');
    }
  };

  const handleDelete = async () => {
    if (supabase) {
      setStatus('Loading');

      await supabase.from('product_options').delete().eq('id', option.id);

      setStatus('');
    }
  };

  const handleDeleteClick = (e: MouseEvent) => {
    e.stopPropagation();

    setStatus('Confirm Delete');
  };

  const handleSelectionChange = useCallback(
    (field: keyof OptionSelectionsInterface, value: any, index: number) => {
      const selections = form.selections ? [...form.selections] : [];
      const selection = selections[index];

      selection[field] = value as never;

      setForm({ ...form, selections });
    },
    [option, form.selections]
  );

  const handleToggleSelection = useCallback(
    async (index: number) => {
      const selections = form.selections ? [...form.selections] : [];
      const selection = selections[index];
      const status = selection.status === 'available' ? 'unavailable' : 'available';

      selection.status = status;

      setForm({ ...form, selections });
    },
    [option, form.selections]
  );

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();

    if (supabase) {
      setStatus('Loading');

      const response = await supabase
        .from('product_options')
        .update({ required: form.required })
        .eq('id', option.id);

      if (response.error) {
        setStatus('');

        const message =
          response.error.code === '23505' ? 'Selection names must be unique' : response.error.message;

        return enqueueSnackbar(message, { variant: 'error' });
      }

      if (form.selections) {
        const selections = [];

        for (const index in form.selections) {
          const i = parseInt(index);
          const selection = form.selections[i];

          selections.push({
            id: selection.id,
            name: selection.name,
            price: selection.price,
            ordinance: i + 1,
            option_id: option.id,
            status: selection.status
          });
        }

        const response = await supabase.from('option_selections').upsert(selections);

        setStatus('');

        if (response.error) {
          const message =
            response.error.code === '23505' ? 'Selection names must be unique' : response.error.message;

          return enqueueSnackbar(message, { variant: 'error' });
        }
      }

      enqueueSnackbar('Saved', { variant: 'success' });
    }
  };

  const handleAddSelectionClick = useCallback(() => {
    const selections = form.selections ? [...form.selections] : [];

    selections.push({
      id: generateKey(1),
      name: '',
      status: '',
      price: 0,
      ordinance: form.selections ? form.selections.length : 1,
      option_id: option.id,
      created_at: '',
      updated_at: ''
    });

    setForm({ ...form, selections });
  }, [form.selections]);

  const handleDeleteSelection = useCallback(
    (index: number) => {
      const selections = form.selections ? [...form.selections] : [];

      if (index >= 0) {
        selections.splice(index, 1);
      }

      setForm({ ...form, selections });
    },
    [option, form.selections]
  );

  const handleEditOption = async () => {
    if (supabase) {
      const response = await supabase.from('product_options').update({ name: form.name }).eq('id', option.id);

      if (response.error) {
        return enqueueSnackbar(response.error.message, { variant: 'error' });
      }

      setStatus('');
    }
  };

  const handleEditClick = (e: MouseEvent) => {
    e.stopPropagation();

    setStatus('Edit');
  };

  return (
    <>
      <Modal
        open={status === 'Confirm Delete'}
        title='Are you sure you want to delete this option?'
        subtitle={`This action cannot be reverted.`}
        submit={handleDelete}
        cancel={() => setStatus('')}
        submitText='Yes'
        cancelText='No'
      />

      <Modal
        open={status === 'Edit'}
        title='Edit Option'
        submit={handleEditOption}
        cancel={() => setStatus('')}
        disableBackdropClick
      >
        <TextField
          label='Name'
          required
          autoFocus
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </Modal>

      <Accordion>
        <AccordionSummary expandIcon={<Icon path={mdiChevronDown} size={1} />}>
          <Typography sx={{ flexGrow: 1 }}>{option.name}</Typography>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size='small' onClick={handleEditClick}>
              <Icon path={mdiPencil} size={1} color={theme.palette.info.main} />
            </IconButton>

            <Switch color='success' checked={option.status === 'available'} onClick={handleToggle} />

            <IconButton size='small' onClick={handleDeleteClick} sx={{ mx: 1 }}>
              <Icon path={mdiTrashCan} size={1} color={theme.palette.error.main} />
            </IconButton>
          </Box>
        </AccordionSummary>

        <AccordionDetails>
          <Box component='form' onSubmit={handleSave}>
            <OptionForm
              option={form}
              onRequiredClick={() => setForm({ ...form, required: !form.required })}
              onSort={(selections: OptionSelectionsInterface[]) => setForm({ ...form, selections })}
              onAddSelectionClick={handleAddSelectionClick}
              onSelectionChange={handleSelectionChange}
              onSelectionDelete={handleDeleteSelection}
              onSelectionToggle={handleToggleSelection}
            />

            <LoadingButton
              type='submit'
              disabled={deepEqual(initialState, form)}
              variant='contained'
              fullWidth
              startIcon={<Icon path={mdiContentSave} size={1} />}
              loading={status === 'Loading'}
              loadingIndicator={<CircularProgress size={20} />}
              loadingPosition='start'
            >
              Save
            </LoadingButton>

            <Button
              sx={{ mt: 1 }}
              color='inherit'
              fullWidth
              startIcon={<Icon path={mdiRefresh} size={1} />}
              onClick={() => setForm({ ...initialState })}
            >
              Reset
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    </>
  );

  /* return (
    <ListItem disableGutters disablePadding divider>
      <Modal
        open={status === 'Confirm Delete'}
        title='Are you sure you want to delete this option?'
        subtitle={`This action cannot be reverted.`}
        submit={handleDelete}
        cancel={() => setStatus('')}
        submitText='Yes'
        cancelText='No'
      />

      <ListItemButton>
        <ListItemText primary={option.name} secondary={option.required ? 'Required' : undefined} />
      </ListItemButton>

      <Switch color='success' checked={option.status === 'available'} onChange={handleToggle} />

      <IconButton size='small' onClick={() => setStatus('Confirm Delete')}>
        <Icon path={mdiTrashCan} size={1} color={theme.palette.error.main} />
      </IconButton>
    </ListItem>
  ); */
};

export default OptionRow;
