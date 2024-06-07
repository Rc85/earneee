import { Alert, Chip, TextField } from '@mui/material';
import { Modal } from '../../../../_shared/components';
import { ProductSpecificationsInterface } from '../../../../../_shared/types';
import { FormEvent, KeyboardEvent, useRef, useState } from 'react';
import { generateKey } from '../../../../../_shared/utils';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';
import { useCreateProductSpecification } from '../../../../_shared/api';

interface Props {
  cancel: () => void;
}

const AddSpecification = ({ cancel }: Props) => {
  const params = useParams();
  const { productId, id } = params;
  const [status, setStatus] = useState('');
  const [name, setName] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const nameInputRef = useRef<any>(null);
  const [specifications, setSpecifications] = useState<ProductSpecificationsInterface[]>([]);
  const [value, setValue] = useState('');
  const [shiftDown, setShiftDown] = useState(false);

  const handleSuccess = () => {
    nameInputRef.current?.focus();

    setName('');
    setValue('');
    setSpecifications([]);
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

    createProductSpecification.mutate(specifications);
  };

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (shiftDown) {
        return handleSubmit();
      } else {
        if (!value) {
          return enqueueSnackbar('Value required', { variant: 'error' });
        }

        const specification = {
          id: generateKey(1),
          name,
          value,
          productId: productId || id!,
          ordinance: null,
          createdAt: new Date().toISOString(),
          updatedAt: null
        };

        setSpecifications([...specifications, specification]);
        setValue('');
      }
    } else if (e.key === 'Shift') {
      setShiftDown(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Shift') {
      setShiftDown(true);
    }
  };

  const handleDeleteValue = (index: number) => {
    const specs = [...specifications];

    specs.splice(index, 1);

    setSpecifications(specs);
  };

  return (
    <Modal
      open
      title='Add Specification'
      submit={handleSubmit}
      cancel={cancel}
      disableBackdropClick
      loading={status === 'Loading'}
    >
      <TextField
        inputRef={nameInputRef}
        label='Name'
        required
        autoFocus
        onChange={(e) => setName(e.target.value)}
        value={name}
      />

      <TextField
        label='Value'
        placeholder='Press enter to add'
        onChange={(e) => setValue(e.target.value)}
        value={value}
        onKeyUp={handleKeyUp}
        onKeyDown={handleKeyDown}
      />

      {specifications.length === 0 ? (
        <Alert severity='error'>Add a specification</Alert>
      ) : (
        specifications.map((specification, i) => (
          <Chip
            key={specification.id}
            onDelete={() => handleDeleteValue(i)}
            size='small'
            label={specification.value}
            sx={{ mr: 1, mb: 1 }}
          />
        ))
      )}
    </Modal>
  );
};

export default AddSpecification;
