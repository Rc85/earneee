import { TextField } from '@mui/material';
import { Modal, RichTextEditor } from '../../../../_shared/components';
import { ProductSpecificationsInterface } from '../../../../../_shared/types';
import { useEditor } from '@tiptap/react';
import { useState } from 'react';
import { editorExtensions } from '../../../../_shared/constants';
import { generateKey } from '../../../../../_shared/utils';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';
import { useCreateProductSpecification } from '../../../../_shared/api';

interface Props {
  cancel: () => void;
  specification?: ProductSpecificationsInterface;
}

const editorStyle = { mb: 1.5 };

const AddSpecification = ({ cancel, specification }: Props) => {
  const params = useParams();
  const { variantId } = params;
  const [status, setStatus] = useState('');
  const [form, setForm] = useState<ProductSpecificationsInterface>(
    specification || {
      id: generateKey(1),
      name: '',
      value: '',
      variantId: variantId!,
      ordinance: null,
      createdAt: new Date().toISOString(),
      updatedAt: null
    }
  );
  const editor = useEditor(
    {
      content: specification?.value || undefined,
      extensions: editorExtensions,
      onUpdate: ({ editor }) => {
        setForm({ ...form, value: editor.getHTML() });
      }
    },
    [specification]
  );
  const { enqueueSnackbar } = useSnackbar();

  const handleSuccess = () => {
    if (specification) {
      enqueueSnackbar('Specification updated', { variant: 'success' });
    }

    cancel();
  };

  const handleError = (err: any) => {
    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }

    setStatus('');
  };

  const createProductSpecification = useCreateProductSpecification(handleSuccess, handleError);

  const handleSubmit = () => {
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
      maxWidth='lg'
      loading={status === 'Loading'}
    >
      <TextField
        label='Name'
        required
        autoFocus
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        value={form.name}
      />

      <RichTextEditor editor={editor} sx={editorStyle} />
    </Modal>
  );
};

export default AddSpecification;
