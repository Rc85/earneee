import { TextField } from '@mui/material';
import { Modal } from '../../../../_shared/components';
import { ProductSpecificationsInterface } from '../../../../../_shared/types';
import { FormEvent, useRef, useState } from 'react';
import { generateKey } from '../../../../../_shared/utils';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';
import { useCreateProductSpecification } from '../../../../_shared/api';

interface Props {
  cancel: () => void;
  specification?: ProductSpecificationsInterface;
}

const AddSpecification = ({ cancel, specification }: Props) => {
  const params = useParams();
  const { productId, variantId } = params;
  const [status, setStatus] = useState('');
  const [form, setForm] = useState<ProductSpecificationsInterface>(
    specification || {
      id: generateKey(1),
      name: '',
      value: '',
      productId: productId!,
      variantId: variantId || null,
      ordinance: null,
      createdAt: new Date().toISOString(),
      updatedAt: null
    }
  );
  const { enqueueSnackbar } = useSnackbar();
  const nameInputRef = useRef<any>(null);

  const handleSuccess = () => {
    if (specification) {
      enqueueSnackbar('Specification updated', { variant: 'success' });
    }

    if (specification) {
      cancel();
    } else {
      setForm({
        id: generateKey(1),
        name: '',
        value: '',
        productId: productId!,
        variantId: variantId || null,
        ordinance: null,
        createdAt: new Date().toISOString(),
        updatedAt: null
      });

      nameInputRef.current?.focus();
    }

    setStatus('');
  };

  const handleError = (err: any) => {
    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }

    setStatus('');
  };

  const createProductSpecification = useCreateProductSpecification(handleSuccess, handleError);

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();

    setStatus('Loading');

    createProductSpecification.mutate(form);
  };

  return (
    <Modal
      open
      title={specification ? 'Edit Specifiation' : 'Add Specification'}
      submit={handleSubmit}
      cancel={cancel}
      disableBackdropClick
      loading={status === 'Loading'}
      component='form'
    >
      <TextField
        inputRef={nameInputRef}
        label='Name'
        required
        autoFocus
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        value={form.name}
      />

      <TextField
        label='Value'
        required
        onChange={(e) => setForm({ ...form, value: e.target.value })}
        value={form.value}
      />
    </Modal>
  );
};

export default AddSpecification;
