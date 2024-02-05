import { mdiArrowUpDropCircle, mdiTrashCan, mdiUpload } from '@mdi/js';
import { Icon } from '@mdi/react';
import { Box, Button, CircularProgress, IconButton, TextField, useTheme } from '@mui/material';
import { grey } from '@mui/material/colors';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { OffersInterface } from '../../../../../_shared/types';
import { deepEqual, generateKey } from '../../../../../_shared/utils';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useCreateOffer } from '../../../../_shared/api';

interface Props {
  offer?: OffersInterface;
}

const OfferForm = ({ offer }: Props) => {
  const theme = useTheme();
  const fileInputRef = useRef<any>();
  const initial = {
    id: generateKey(1),
    name: '',
    url: '',
    logoPath: '',
    logoUrl: '',
    logoWidth: 0,
    logoHeight: 0,
    ordinance: 0,
    startDate: null,
    endDate: null,
    details: null,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: null
  };
  const [initialState, setInitialState] = useState<OffersInterface>({ ...initial });
  const [form, setForm] = useState<OffersInterface>({ ...initial });
  const [status, setStatus] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    if (offer) {
      setInitialState({ ...offer });

      setForm({ ...offer });
    }
  }, [offer]);

  const handleSuccess = (response: any) => {
    if (response.data.statusText && offer) {
      enqueueSnackbar(response.data.statusText, { variant: 'success' });
    }

    if (!offer) {
      navigate(-1);
    } else {
      setStatus('');
    }
  };

  const handleError = (err: any) => {
    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }

    setStatus('');
  };

  const createOffer = useCreateOffer(handleSuccess, handleError);

  const handleRemoveLogo = () => {
    setForm({ ...form, logoUrl: '' });
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

    createOffer.mutate(form);
  };

  return (
    <Box component='form' onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex' }}>
        {Boolean(form?.logoUrl) ? (
          <Box
            sx={{
              backgroundRepeat: 'no-repeat',
              backgroundColor: 'white',
              backgroundPosition: 'center',
              backgroundImage: `url(${form?.logoUrl})`,
              backgroundSize: 'contain',
              width: '300px',
              height: '450px',
              flexShrink: 0,
              borderRadius: 5,
              mr: 1,
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
              width: '300px',
              height: '450px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              mr: 1,
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
            value={form?.name || ''}
          />

          <TextField
            label='URL'
            required
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            value={form?.url || ''}
          />

          <TextField
            type='datetime-local'
            label='Start Date'
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            value={form?.startDate ? form.startDate.split('+')[0] : ''}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            type='datetime-local'
            label='End Date'
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            value={form?.endDate ? form.endDate.split('+')[0] : ''}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label='Details'
            multiline
            rows={6}
            onChange={(e) => setForm({ ...form, details: e.target.value })}
            value={form?.details || ''}
          />
        </Box>
      </Box>

      <LoadingButton
        type='submit'
        startIcon={<Icon path={mdiArrowUpDropCircle} size={1} />}
        variant='contained'
        loading={status === 'Loading'}
        loadingPosition='start'
        loadingIndicator={<CircularProgress size={20} />}
        sx={{ mt: 1 }}
        disabled={deepEqual(initialState, form)}
        fullWidth
      >
        Submit
      </LoadingButton>
    </Box>
  );
};

export default OfferForm;
