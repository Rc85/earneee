import { TextField } from '@mui/material';
import { FormEvent, useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Modal } from '../../../../_shared/components';
import { useParams } from 'react-router-dom';
import { CategoriesInterface } from '../../../../../_shared/types';
import { useCreateCategory } from '../../../../_shared/api';

interface Props {
  cancel: () => void;
  category?: CategoriesInterface;
}

const CreateCategory = ({ cancel, category }: Props) => {
  const [status, setStatus] = useState('');
  const params = useParams();
  const { parentId } = params;
  const [form, setForm] = useState<CategoriesInterface>(
    category || {
      id: 0,
      name: '',
      type: null,
      parentId: parentId ? parseInt(parentId) : null,
      status: 'available',
      ordinance: 0,
      createdAt: new Date().toISOString(),
      updatedAt: null
    }
  );
  const { enqueueSnackbar } = useSnackbar();
  const nameInputRef = useRef<any>();

  const handleSuccess = () => {
    if (category) {
      enqueueSnackbar('Category updated', { variant: 'success' });

      cancel();
    }
  };

  const handleError = (err: any) => {
    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }
  };

  const createCategories = useCreateCategory(handleSuccess, handleError);

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();

    setStatus('Loading');

    createCategories.mutate(form);
  };

  return (
    <Modal
      open
      cancel={cancel}
      component='form'
      submit={handleSubmit}
      title={category ? 'Edit Category' : 'Create Category'}
      loading={status === 'Loading'}
      disableBackdropClick
    >
      <TextField
        label='Name'
        required
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        value={form.name}
        autoFocus
        ref={nameInputRef}
      />

      <TextField
        label='Type'
        onChange={(e) => setForm({ ...form, type: e.target.value })}
        value={form.type || ''}
      />
    </Modal>
  );
};

export default CreateCategory;
