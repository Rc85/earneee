import { FormEvent, useCallback, useState } from 'react';
import { Modal } from '../../../../_shared/components';
import { OptionSelectionsInterface, ProductOptionsInterface } from '../../../../../_shared/types';
import { generateKey } from '../../../../../_shared/utils';
import { TextField } from '@mui/material';
import OptionForm from '../ProductVariant/OptionForm';
import { useSnackbar } from 'notistack';
import { useCreateProductOption } from '../../../../_shared/api';
import { useParams } from 'react-router-dom';

interface Props {
  cancel: () => void;
  option?: ProductOptionsInterface;
}

const AddOption = ({ cancel, option }: Props) => {
  const [status, setStatus] = useState('');
  const params = useParams();
  const { variantId } = params;
  const [form, setForm] = useState<ProductOptionsInterface>({
    id: generateKey(1),
    name: '',
    required: true,
    variantId: variantId!,
    status: 'available',
    createdAt: '',
    updatedAt: '',
    selections: []
  });
  const { enqueueSnackbar } = useSnackbar();

  const handleSuccess = () => {
    if (option) {
      enqueueSnackbar('Option updated', { variant: 'success' });
    }

    cancel();
  };

  const handleError = (err: any) => {
    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }

    setStatus('');
  };

  const createProductOption = useCreateProductOption(handleSuccess, handleError);

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();

    setStatus('Loading');

    createProductOption.mutate(form);
  };

  const handleAddSelectionClick = () => {
    const selection: OptionSelectionsInterface = {
      id: generateKey(1),
      name: '',
      price: 0,
      optionId: form.id,
      ordinance: form.selections ? form.selections.length : 1,
      status: 'available',
      createdAt: '',
      updatedAt: ''
    };
    const selections = form.selections ? [...form.selections] : [];

    selections.push(selection);

    setForm({ ...form, selections });
  };

  const handleSelectionChange = useCallback(
    (field: keyof OptionSelectionsInterface, value: any, index: number) => {
      const selections = form.selections ? [...form.selections] : [];
      const selection = selections[index];

      selection[field] = value as never;

      setForm({ ...form, selections });
    },
    [form]
  );

  const handleToggleSelection = useCallback(
    (index: number) => {
      const selections = form.selections ? [...form.selections] : [];
      const selection = selections[index];
      const status = selection.status === 'available' ? 'unavailable' : 'available';

      selection.status = status;

      setForm({ ...form, selections });
    },
    [form]
  );

  const handleDeleteSelection = useCallback(
    (index: number) => {
      const selections = form.selections ? [...form.selections] : [];

      if (index >= 0) {
        selections.splice(index, 1);
      }

      setForm({ ...form, selections });
    },
    [form]
  );

  return (
    <Modal
      open
      title='Add Option'
      submit={handleSubmit}
      cancel={cancel}
      disableBackdropClick
      component='form'
      loading={status === 'Loading'}
    >
      <TextField
        label='Name'
        required
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        value={form.name}
        autoFocus
      />

      <OptionForm
        option={form}
        onRequiredClick={() => setForm({ ...form, required: !form.required })}
        onAddSelectionClick={handleAddSelectionClick}
        onSelectionChange={handleSelectionChange}
        onSelectionToggle={handleToggleSelection}
        onSelectionDelete={handleDeleteSelection}
        onSort={(selections: OptionSelectionsInterface[]) => setForm({ ...form, selections })}
      />
    </Modal>
  );
};

export default AddOption;
