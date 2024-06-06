import { Loading, Section } from '../../../../_shared/components';
import { useLocation, useNavigate } from 'react-router-dom';
import { FormEvent, useEffect, useState } from 'react';
import { ProductBrandsInterface } from '../../../../../_shared/types';
import { useSnackbar } from 'notistack';
import { retrieveProductBrands, useCreateProductBrand } from '../../../../_shared/api';
import BrandForm from './BrandForm';
import { deepEqual } from '../../../../../_shared/utils';
import { mdiArrowUpDropCircle, mdiRefresh } from '@mdi/js';
import Icon from '@mdi/react';
import { LoadingButton } from '@mui/lab';
import { CircularProgress, Button } from '@mui/material';

const CreateBrand = () => {
  const location = useLocation();
  const brandId = location.state?.brandId;
  const { isLoading, data } = brandId ? retrieveProductBrands({ brandId }) : { isLoading: false, data: {} };
  const { brands } = data || {};
  const brand = brands?.[0];
  const [status, setStatus] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const initial: ProductBrandsInterface = {
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

  const handleSuccess = (response: any) => {
    setStatus('');

    if (response.data.statusText && brand) {
      return enqueueSnackbar(response.data.statusText, { variant: 'success' });
    }

    navigate(-1);
  };

  const handleError = (err: any) => {
    setStatus('');

    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }
  };

  const createProductBrand = useCreateProductBrand(handleSuccess, handleError);

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();

    setStatus('Loading');

    createProductBrand.mutate(form);
  };

  const disabled = () => {
    return !form.name || deepEqual(form, initialState);
  };

  return isLoading ? (
    <Loading />
  ) : (
    <Section
      title='Create Brand'
      titleVariant='h3'
      position='center'
      sx={{ p: 2 }}
      component='form'
      onSubmit={handleSubmit}
    >
      <BrandForm brand={form} setForm={setForm} />

      <LoadingButton
        type='submit'
        variant='contained'
        startIcon={<Icon path={mdiArrowUpDropCircle} size={1} />}
        loading={status === 'Loading'}
        loadingPosition='start'
        loadingIndicator={<CircularProgress size={20} />}
        fullWidth
        disabled={disabled()}
      >
        Submit
      </LoadingButton>

      <Button
        fullWidth
        sx={{ mt: 1 }}
        startIcon={<Icon path={mdiRefresh} size={1} />}
        color='inherit'
        onClick={() => setForm(JSON.parse(JSON.stringify(initialState)))}
      >
        Reset
      </Button>
    </Section>
  );
};

export default CreateBrand;
