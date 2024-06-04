import { TextField } from '@mui/material';
import { ProductSpecificationsInterface } from '../../../../../_shared/types';
import { Modal } from '../../../../_shared/components';
import { FormEvent, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useUpdateProductSpecification } from '../../../../_shared/api';

interface Props {
  specification: ProductSpecificationsInterface;
  cancel: () => void;
}

const EditSpecification = ({ specification, cancel }: Props) => {
  const [form, setForm] = useState(specification);
  const { enqueueSnackbar } = useSnackbar();

  const handleSuccess = (response: any) => {
    if (response.data.statusText) {
      enqueueSnackbar(response.data.statusText, { variant: 'success' });
    }

    cancel();
  };

  const handleError = (err: any) => {
    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }
  };

  const updateProductSpecification = useUpdateProductSpecification(handleSuccess, handleError);

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();

    updateProductSpecification.mutate(form);
  };

  return (
    <Modal
      open
      title='Edit Specification'
      submit={handleSubmit}
      cancel={cancel}
      component='form'
      disableBackdropClick
    >
      <TextField
        label='Name'
        required
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <TextField
        label='Value'
        required
        value={form.value}
        onChange={(e) => setForm({ ...form, value: e.target.value })}
      />
    </Modal>
  );
};

export default EditSpecification;
