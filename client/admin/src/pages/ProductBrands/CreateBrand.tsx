import { Box, Button, CircularProgress, IconButton, TextField, useTheme } from '@mui/material';
import { Loading, Section } from '../../../../_shared/components';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@mdi/react';
import { mdiArrowUpDropCircle, mdiRefresh, mdiTrashCan, mdiUpload } from '@mdi/js';
import { grey } from '@mui/material/colors';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { deepEqual, generateKey } from '../../../../../_shared/utils';
import { ProductBrandUrlsInterface, ProductBrandsInterface } from '../../../../../_shared/types';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { retrieveProductBrands, retrieveUserProfiles, useCreateProductBrand } from '../../../../_shared/api';
import { countries } from '../../../../../_shared';

const CreateBrand = () => {
  const location = useLocation();
  const brandId = location.state?.brandId;
  const { isLoading, data } = brandId ? retrieveProductBrands({ brandId }) : { isLoading: false, data: {} };
  const { brands } = data || {};
  const brand = brands?.[0];
  const theme = useTheme();
  const fileInputRef = useRef<any>();
  const [status, setStatus] = useState('');
  const initial = {
    id: generateKey(1),
    name: '',
    logoUrl: null,
    logoPath: null,
    owner: null,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: null,
    urls: []
  };
  const [initialState, setInitialState] = useState<ProductBrandsInterface>({ ...initial });
  const [form, setForm] = useState<ProductBrandsInterface>({ ...initial });
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const user = retrieveUserProfiles();
  const { userProfiles } = user.data || {};

  useEffect(() => {
    if (brand) {
      setForm({ ...brand });

      setInitialState({ ...brand });
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

  const handleRemoveLogo = () => {
    setForm({ ...form, logoUrl: null });

    createProductBrand.mutate(form);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const fileReader = new FileReader();

      fileReader.onload = (e) => {
        const data = e.target?.result;

        if (data && typeof data === 'string') {
          setForm({ ...form, logoUrl: data });

          fileInputRef.current.value = '';
        }
      };

      fileReader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();

    setStatus('Loading');

    createProductBrand.mutate(form);
  };

  const handleUrlChange = (value: string, key: keyof ProductBrandUrlsInterface, index: number) => {
    const urls = form.urls ? [...form.urls] : [];

    urls[index][key] = value;

    setForm({ ...form, urls });
  };

  const handleRemoveUrl = (index: number) => {
    const urls = form.urls ? [...form.urls] : [];

    if (index >= 0) {
      urls.splice(index, 1);
    }

    setForm({ ...form, urls });
  };

  const handleAddWebsiteLinkClick = () => {
    const urls = form.urls ? [...form.urls] : [];

    urls.push({ id: generateKey(1), url: '', country: 'CA', brandId: '', createdAt: '', updatedAt: '' });

    setForm({ ...form, urls });
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
      <Box sx={{ display: 'flex', mb: 1 }}>
        {Boolean(form.logoUrl) ? (
          <Box
            sx={{
              backgroundRepeat: 'no-repeat',
              backgroundColor: 'white',
              backgroundPosition: 'center',
              backgroundImage: `url(${form.logoUrl})`,
              backgroundSize: 'contain',
              width: '150px',
              height: '150px',
              flexShrink: 0,
              borderRadius: 5,
              mr: 2,
              position: 'relative'
            }}
          >
            <IconButton
              size='small'
              disableRipple
              onClick={handleRemoveLogo}
              sx={{ position: 'absolute', top: -5, left: -5, backgroundColor: theme.palette.error.main }}
            >
              <Icon path={mdiTrashCan} size={1} />
            </IconButton>
          </Box>
        ) : (
          <Button
            color='inherit'
            sx={{
              borderWidth: 5,
              borderColor: grey[600],
              borderStyle: 'dashed',
              borderRadius: 5,
              color: grey[600],
              width: '150px',
              height: '150px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              mr: 2,
              flexShrink: 0
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <Icon path={mdiUpload} size={1} />
            Upload logo
          </Button>
        )}

        <input type='file' ref={fileInputRef} hidden onChange={handleFileChange} />

        <Box sx={{ flexGrow: 1 }}>
          <TextField
            label='Name'
            required
            autoFocus
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            value={form.name}
          />

          <TextField
            label='Owner'
            select
            SelectProps={{ native: true }}
            onChange={(e) => setForm({ ...form, owner: e.target.value })}
            value={form.owner || ''}
          >
            <option value=''></option>
            {userProfiles?.map((user) => (
              <option key={user.id} value={user.id}>
                {user.email} {user.firstName ? `(${user.firstName}${user.lastName})` : ''}
              </option>
            ))}
          </TextField>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }} onClick={handleAddWebsiteLinkClick}>
        <Button>Add Website Link</Button>
      </Box>

      {form.urls?.map((url, i) => (
        <Box key={url.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <TextField
            label='URL'
            type='url'
            required
            autoFocus
            sx={{ mr: 1, mb: '0px !important' }}
            onChange={(e) => handleUrlChange(e.target.value, 'url', i)}
            value={url.url}
          />

          <TextField
            label='Country'
            required
            select
            SelectProps={{ native: true }}
            onChange={(e) => handleUrlChange(e.target.value, 'country', i)}
            value={url.country}
            sx={{ mb: '0px !important' }}
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </TextField>

          <IconButton size='small' onClick={() => handleRemoveUrl(i)}>
            <Icon path={mdiTrashCan} size={1} />
          </IconButton>
        </Box>
      ))}

      <LoadingButton
        type='submit'
        variant='contained'
        startIcon={<Icon path={mdiArrowUpDropCircle} size={1} />}
        loading={status === 'Loading'}
        loadingPosition='start'
        loadingIndicator={<CircularProgress size={20} />}
        fullWidth
        disabled={deepEqual(form, initialState)}
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
