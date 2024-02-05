import { mdiTrashCan, mdiUpload } from '@mdi/js';
import { Icon } from '@mdi/react';
import { Box, Button, IconButton, TextField, useTheme } from '@mui/material';
import { grey } from '@mui/material/colors';
import { ChangeEvent, useRef } from 'react';
import { OffersInterface } from '../../../../../_shared/types';

interface Props {
  offer?: OffersInterface;
  onChange: (key: keyof OffersInterface, value: any) => void;
  setFile: (file: File | undefined) => void;
}

const OfferForm = ({ offer, onChange, setFile }: Props) => {
  const theme = useTheme();
  const fileInputRef = useRef<any>();

  const handleRemoveLogo = () => {
    setFile(undefined);

    onChange('logo_url', null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setFile(file);

      const fileReader = new FileReader();

      fileReader.onload = (e) => {
        const data = e.target?.result;

        if (data && typeof data === 'string') {
          onChange('logo_url', data);

          fileInputRef.current.value = '';
        }
      };

      fileReader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {Boolean(offer?.logo_url) ? (
        <Box
          sx={{
            backgroundRepeat: 'no-repeat',
            backgroundColor: 'white',
            backgroundPosition: 'center',
            backgroundImage: `url(${offer?.logo_url})`,
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
          onChange={(e) => onChange('name', e.target.value)}
          value={offer?.name || ''}
        />

        <TextField
          label='URL'
          required
          onChange={(e) => onChange('url', e.target.value)}
          value={offer?.url || ''}
        />

        <TextField
          type='datetime-local'
          label='Start Date'
          onChange={(e) => onChange('start_date', e.target.value)}
          value={offer?.start_date ? offer.start_date.split('+')[0] : ''}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          type='datetime-local'
          label='End Date'
          onChange={(e) => onChange('end_date', e.target.value)}
          value={offer?.end_date ? offer.end_date.split('+')[0] : ''}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label='Details'
          multiline
          rows={6}
          onChange={(e) => onChange('details', e.target.value)}
          value={offer?.details || ''}
        />
      </Box>
    </Box>
  );
};

export default OfferForm;
