import { TextField } from '@mui/material';
import { Modal, RichTextEditor } from '../../../../_shared/components';
import { ProductSpecificationsInterface } from '../../../../../_shared/types';
import { useEditor } from '@tiptap/react';
import { useContext, useState } from 'react';
import { editorExtensions } from '../../../../_shared/constants';
import { generateKey } from '../../../../../_shared/utils';
import { SupabaseContext } from '../../../../_shared/components/SupabaseProvider/SupabaseProvider';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';

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
      values: '',
      variant_id: variantId!,
      ordinance: null,
      created_at: new Date().toISOString(),
      updated_at: null
    }
  );
  const editor = useEditor(
    {
      content: specification?.values || undefined,
      extensions: editorExtensions,
      onUpdate: ({ editor }) => {
        setForm({ ...form, values: editor.getHTML() });
      }
    },
    [specification]
  );
  const { supabase } = useContext(SupabaseContext);
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async () => {
    if (supabase) {
      setStatus('Loading');

      const response = await supabase.from('product_specifications').upsert(form);

      setStatus('');

      if (response.error) {
        return enqueueSnackbar(response.error.message, { variant: 'error' });
      }

      cancel();
    }
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
