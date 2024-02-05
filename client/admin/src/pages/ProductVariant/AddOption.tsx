import { FormEvent, useCallback, useState } from 'react';
import { Modal } from '../../../../_shared/components';
import { OptionSelectionsInterface, ProductOptionsInterface } from '../../../../../_shared/types';
import { generateKey } from '../../../../../_shared/utils';
import { TextField } from '@mui/material';
import OptionForm from './OptionForm';

interface Props {
  cancel: () => void;
  submit: (option: ProductOptionsInterface) => void;
}

const AddOption = ({ cancel, submit }: Props) => {
  const [form, setForm] = useState<ProductOptionsInterface>({
    id: generateKey(1),
    name: '',
    required: true,
    variant_id: '',
    status: 'available',
    created_at: '',
    updated_at: '',
    selections: []
  });

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();

    submit(form);
  };

  const handleAddSelectionClick = () => {
    const selection: OptionSelectionsInterface = {
      id: generateKey(1),
      name: '',
      price: 0,
      option_id: '',
      ordinance: form.selections ? form.selections.length : 1,
      status: 'available',
      created_at: '',
      updated_at: ''
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

      console.log(selection);

      setForm({ ...form, selections });
    },
    [form.selections]
  );

  const handleToggleSelection = useCallback(
    (index: number) => {
      const selections = form.selections ? [...form.selections] : [];
      const selection = selections[index];
      const status = selection.status === 'available' ? 'unavailable' : 'available';

      selection.status = status;

      setForm({ ...form, selections });
    },
    [form.selections]
  );

  const handleDeleteSelection = useCallback(
    (index: number) => {
      const selections = form.selections ? [...form.selections] : [];

      if (index >= 0) {
        selections.splice(index, 1);
      }

      setForm({ ...form, selections });
    },
    [form.selections]
  );

  return (
    <Modal
      open
      title='Add Option'
      submit={handleSubmit}
      cancel={cancel}
      disableBackdropClick
      component='form'
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
