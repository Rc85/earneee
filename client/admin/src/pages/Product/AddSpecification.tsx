import { Alert, Autocomplete, Chip, TextField } from '@mui/material';
import { Modal } from '../../../../_shared/components';
import { ProductSpecificationsInterface } from '../../../../../_shared/types';
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { generateKey } from '../../../../../_shared/utils';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';
import { retrieveSpecifications, useCreateProductSpecification } from '../../../../_shared/api';

interface Props {
  cancel: () => void;
}

const AddSpecification = ({ cancel }: Props) => {
  const params = useParams();
  const { productId, id } = params;
  const [status, setStatus] = useState('');
  const [nameValue, setNameValue] = useState('');
  const [name, setName] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const nameInputRef = useRef<any>(null);
  const [productSpecifications, setProductSpecifications] = useState<ProductSpecificationsInterface[]>([]);
  const [value, setValue] = useState('');
  const [shiftDown, setShiftDown] = useState(false);
  const { data } = retrieveSpecifications({ name });
  const { specifications } = data || {};

  useEffect(() => {
    const nameTimeout = setTimeout(() => {
      setName(nameValue);
    }, 500);

    return () => {
      clearTimeout(nameTimeout);
    };
  }, [nameValue]);

  const handleSuccess = () => {
    nameInputRef.current?.focus();

    setNameValue('');
    setValue('');
    setProductSpecifications([]);
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

    createProductSpecification.mutate(productSpecifications);
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

        setProductSpecifications([...productSpecifications, specification]);
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
    const specs = [...productSpecifications];

    specs.splice(index, 1);

    setProductSpecifications(specs);
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
      <Autocomplete
        freeSolo
        options={specifications?.map((specification) => specification.name) || []}
        renderInput={(params) => (
          <TextField
            {...params}
            label='Name'
            onChange={(e) => setNameValue(e.target.value)}
            value={name}
            autoFocus
          />
        )}
        sx={{ mb: 1.25 }}
      />

      <TextField
        label='Value'
        placeholder='Press enter to add'
        onChange={(e) => setValue(e.target.value)}
        value={value}
        onKeyUp={handleKeyUp}
        onKeyDown={handleKeyDown}
      />

      {productSpecifications.length === 0 ? (
        <Alert severity='error'>Add a specification</Alert>
      ) : (
        productSpecifications.map((specification, i) => (
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
