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
import { FormEvent, MouseEvent, useCallback, useEffect, useState } from 'react';
import { Modal } from '../../../../_shared/components';
import { LoadingButton } from '@mui/lab';
import { deepEqual, generateKey } from '../../../../../_shared/utils';
import { useSnackbar } from 'notistack';
import OptionForm from '../ProductVariant/OptionForm';
import { useCreateProductOption, useDeleteProductOption } from '../../../../_shared/api';

interface Props {
  option: ProductOptionsInterface;
}

const OptionRow = ({ option }: Props) => {
  const theme = useTheme();
  const [status, setStatus] = useState('');
  const [form, setForm] = useState<ProductOptionsInterface>(JSON.parse(JSON.stringify(option)));
  const [initialState, setInitialState] = useState<ProductOptionsInterface>(
    JSON.parse(JSON.stringify(option))
  );
  const [name, setName] = useState(form.name);
  const { enqueueSnackbar } = useSnackbar();

  const handleSuccess = () => {
    enqueueSnackbar('Option updated', { variant: 'success' });

    setStatus('');
  };

  const handleError = (err: any) => {
    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }

    setStatus('');
  };

  const updateProductOption = useCreateProductOption(handleSuccess, handleError);
  const deleteProductOption = useDeleteProductOption(() => setStatus(''), handleError);

  useEffect(() => {
    setForm(JSON.parse(JSON.stringify(option)));

    setInitialState(JSON.parse(JSON.stringify(option)));
  }, [option]);

  const handleToggle = (e: MouseEvent) => {
    e.stopPropagation();

    setForm({ ...form, status: form.status === 'available' ? 'unavailable' : 'available' });
  };

  const handleDelete = () => {
    setStatus('Deleting');

    deleteProductOption.mutate(option.id);
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

  const handleSave = (e: FormEvent) => {
    e.preventDefault();

    setStatus('Loading');

    updateProductOption.mutate(form);
  };

  const handleAddSelectionClick = useCallback(() => {
    const selections = form.selections ? [...form.selections] : [];

    selections.push({
      id: generateKey(1),
      name: '',
      status: 'available',
      price: 0,
      ordinance: form.selections ? form.selections.length : 1,
      optionId: option.id,
      createdAt: '',
      updatedAt: ''
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

  const handleEditOption = () => {
    setForm({ ...form, name });

    setStatus('');
  };

  const handleEditClick = (e: MouseEvent) => {
    e.stopPropagation();

    setStatus('Edit');
  };

  const handleCancelEdit = () => {
    setStatus('');

    setName(form.name);
  };

  const handleResetClick = () => {
    setForm({ ...initialState });

    setName(initialState.name);
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
        cancel={handleCancelEdit}
        disableBackdropClick
      >
        <TextField label='Name' required autoFocus value={name} onChange={(e) => setName(e.target.value)} />
      </Modal>

      <Accordion>
        <AccordionSummary expandIcon={<Icon path={mdiChevronDown} size={1} />}>
          <Typography sx={{ flexGrow: 1 }}>{form.name}</Typography>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size='small' onClick={handleEditClick}>
              <Icon path={mdiPencil} size={1} color={theme.palette.info.main} />
            </IconButton>

            <Switch color='success' checked={form.status === 'available'} onClick={handleToggle} />

            {status === 'Deleting' ? (
              <CircularProgress size={20} sx={{ mx: 1 }} />
            ) : (
              <IconButton size='small' onClick={handleDeleteClick} sx={{ mx: 1 }}>
                <Icon path={mdiTrashCan} size={1} color={theme.palette.error.main} />
              </IconButton>
            )}
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
              onClick={handleResetClick}
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
