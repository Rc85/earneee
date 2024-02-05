import { mdiArrowUpDropCircle, mdiPlus, mdiTrashCan, mdiUpload } from '@mdi/js';
import { Box, Button, CircularProgress, IconButton, TextField, useTheme } from '@mui/material';
import { grey } from '@mui/material/colors';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { AffiliateUrlsInterface, AffiliatesInterface } from '../../../../../_shared/types';
import { Icon } from '@mdi/react';
import { deepEqual, generateKey } from '../../../../../_shared/utils';
import { useSnackbar } from 'notistack';
import { useAddAffiliate } from '../../../../_shared/api';
import { LoadingButton } from '@mui/lab';
import { countries } from '../../../../../_shared';
import { useNavigate } from 'react-router-dom';

interface Props {
  affiliate?: AffiliatesInterface;
}

const AffiliateForm = ({ affiliate }: Props) => {
  const [status, setStatus] = useState('');
  const fileInputRef = useRef<any>(null);
  const theme = useTheme();
  const initial = {
    id: generateKey(1),
    name: '',
    description: null,
    logoUrl: null,
    logoPath: null,
    managerUrl: null,
    commissionRate: null,
    rateType: 'fixed',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: null,
    urls: []
  };
  const [initialState, setInitialState] = useState<AffiliatesInterface>({ ...initial });
  const [form, setForm] = useState<AffiliatesInterface>({ ...initial });
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    if (affiliate) {
      setInitialState({ ...affiliate });
      setForm({ ...affiliate });
    }
  }, [affiliate]);

  const handleSuccess = (response: any) => {
    if (response.data.statusText) {
      enqueueSnackbar(response.data.statusText, { variant: 'success' });
    }

    setStatus('');

    if (!affiliate) {
      navigate(-1);
    }
  };

  const handleError = (err: any) => {
    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }

    setStatus('');
  };

  const addAffiliate = useAddAffiliate(handleSuccess, handleError);

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();

    setStatus('Loading');

    addAffiliate.mutate(form);
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

  const handleRemoveLogo = () => {
    setForm({ ...form, logoUrl: null });
  };

  const handleAddWebsiteLinkClick = () => {
    const urls = form.urls ? [...form.urls] : [];

    urls.push({ id: generateKey(1), url: '', country: 'CA', affiliateId: '', createdAt: '', updatedAt: '' });

    setForm({ ...form, urls });
  };

  const handleUrlChange = (value: string, key: keyof AffiliateUrlsInterface, index: number) => {
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

  return (
    <>
      <Box sx={{ mb: 1, display: 'flex' }}>
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

        <Box sx={{ flexGrow: 1 }}>
          <TextField
            label='Name'
            required
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            value={form.name}
          />

          <TextField
            label='Manager Website'
            onChange={(e) => setForm({ ...form, managerUrl: e.target.value })}
            value={form.managerUrl || ''}
          />

          <Box sx={{ display: 'flex' }}>
            <TextField
              type='number'
              label='Commission Rate'
              onChange={(e) => setForm({ ...form, commissionRate: e.target.value as unknown as number })}
              value={form.commissionRate || ''}
            />

            <TextField
              label='Rate Type'
              select
              SelectProps={{ native: true }}
              sx={{ ml: 1 }}
              onChange={(e) => setForm({ ...form, rateType: e.target.value })}
              value={form.rateType}
            >
              <option value='fixed'>$</option>
              <option value='percentage'>%</option>
            </TextField>
          </Box>

          <TextField
            label='Description'
            multiline
            rows='4'
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            value={form.description || ''}
          />
        </Box>

        <input type='file' ref={fileInputRef} hidden onChange={handleFileChange} />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <Button startIcon={<Icon path={mdiPlus} size={1} />} onClick={handleAddWebsiteLinkClick}>
          Add Website Link
        </Button>
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
        variant='contained'
        fullWidth
        type='submit'
        loading={status === 'Loading'}
        loadingIndicator={<CircularProgress size={20} />}
        loadingPosition='start'
        onClick={handleSubmit}
        startIcon={<Icon path={mdiArrowUpDropCircle} size={1} />}
        disabled={deepEqual(initialState, form)}
      >
        Submit
      </LoadingButton>
    </>
  );
};

export default AffiliateForm;
