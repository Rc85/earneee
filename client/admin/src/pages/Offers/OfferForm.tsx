import { mdiArrowUpDropCircle, mdiTrashCan, mdiUpload } from '@mdi/js';
import { Icon } from '@mdi/react';
import { Box, Button, CircularProgress, IconButton, TextField, useTheme } from '@mui/material';
import { grey } from '@mui/material/colors';
import { FormEvent, useEffect, useState } from 'react';
import { OffersInterface } from '../../../../../_shared/types';
import { deepEqual, generateKey } from '../../../../../_shared/utils';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useCreateOffer } from '../../../../_shared/api';
import AddLogo from './AddLogo';
import dayjs from 'dayjs';
import { RichTextEditor } from '../../../../_shared/components';
import { editorExtensions } from '../../../../_shared/constants';
import { useEditor } from '@tiptap/react';

interface Props {
  offer?: OffersInterface;
}

const editorStyle = { mb: 1.5 };

const OfferForm = ({ offer }: Props) => {
  const theme = useTheme();
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

  const editor = useEditor(
    {
      content: offer?.details || undefined,
      extensions: editorExtensions,
      onUpdate: ({ editor }) => {
        setForm({ ...form, details: editor.getHTML() });
      }
    },
    [offer]
  );

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

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();

    setStatus('Loading');

    createOffer.mutate(form);
  };

  const handleLogoChange = (logoUrl: string, width: number, height: number) => {
    setForm({ ...form, logoUrl, logoWidth: width, logoHeight: height });

    setStatus('');
  };

  return (
    <Box component='form' onSubmit={handleSubmit}>
      {status === 'Add Logo' && <AddLogo cancel={() => setStatus('')} submit={handleLogoChange} />}

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
              height: '300px',
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
              height: '300px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              mr: 1,
              flexShrink: 0
            }}
            onClick={() => setStatus('Add Logo')}
          >
            <Icon path={mdiUpload} size={1} />
            Add logo
          </Button>
        )}

        <Box sx={{ flexGrow: 1 }}>
          <TextField
            label='URL'
            autoFocus
            required
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            value={form?.url || ''}
          />

          <TextField
            label='Name'
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            value={form?.name || ''}
          />

          <TextField
            type='datetime-local'
            label='Start Date'
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            value={form?.startDate ? dayjs(form.startDate).format('YYYY-MM-DD[T]hh:mm') : ''}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            type='datetime-local'
            label='End Date'
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            value={form?.endDate ? dayjs(form.endDate).format('YYYY-MM-DD[T]hh:mm') : ''}
            InputLabelProps={{ shrink: true }}
          />

          <RichTextEditor
            sx={editorStyle}
            editor={editor}
            onHtmlChange={(html) => setForm({ ...form, details: html })}
            rawHtml={form.details || ''}
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
