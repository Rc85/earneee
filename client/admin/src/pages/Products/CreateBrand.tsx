import { FormEvent, useEffect, useState } from 'react';
import { ProductBrandsInterface } from '../../../../../_shared/types';
import { Modal } from '../../../../_shared/components';
import BrandForm from '../ProductBrands/BrandForm';
import { deepEqual } from '../../../../../_shared/utils';

interface Props {
  submit: (brand: ProductBrandsInterface) => void;
  cancel: () => void;
  brand?: ProductBrandsInterface;
}

const CreateBrand = ({ submit, cancel, brand }: Props) => {
  const initial = {
    id: '',
    name: '',
    url: null,
    logoUrl: null,
    logoPath: null,
    owner: null,
    status: 'active',
    createdAt: '',
    updatedAt: null
  };
  const [initialState, setInitialState] = useState<ProductBrandsInterface>({ ...initial });
  const [form, setForm] = useState<ProductBrandsInterface>({ ...initial });

  useEffect(() => {
    if (brand) {
      setInitialState({ ...brand });
      setForm({ ...brand });
    }
  }, [brand]);

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();

    submit(form);
  };

  const disabled = () => {
    return !form.name || deepEqual(form, initialState);
  };

  return (
    <Modal
      open
      title={brand ? 'Edit Brand' : 'Create Brand'}
      submit={handleSubmit}
      cancel={cancel}
      disableBackdropClick
      disableSubmit={disabled()}
    >
      <BrandForm brand={form} setForm={setForm} />
    </Modal>
  );
};

export default CreateBrand;
