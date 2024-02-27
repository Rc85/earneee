import { mdiArrowUpDropCircle, mdiTrashCan, mdiUpload } from '@mdi/js';
import { Box, Button, CircularProgress, IconButton, TextField, useTheme } from '@mui/material';
import { grey } from '@mui/material/colors';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { AffiliatesInterface } from '../../../../../_shared/types';
import { Icon } from '@mdi/react';
import { deepEqual, generateKey } from '../../../../../_shared/utils';
import { useSnackbar } from 'notistack';
import { useAddAffiliate } from '../../../../_shared/api';
import { LoadingButton } from '@mui/lab';
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
    url: null,
    description: null,
    logoUrl: null,
    logoPath: null,
    managerUrl: null,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: null
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

  return (
    <Box component='form' onSubmit={handleSubmit}>
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
            label='Website URL'
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            value={form.url || ''}
          />

          <TextField
            label='Manager Website'
            onChange={(e) => setForm({ ...form, managerUrl: e.target.value })}
            value={form.managerUrl || ''}
          />

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
    </Box>
  );
};

export default AffiliateForm;
