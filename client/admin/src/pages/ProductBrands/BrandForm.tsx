import { mdiTrashCan, mdiUpload } from '@mdi/js';
import Icon from '@mdi/react';
import { Box, IconButton, Button, TextField, useTheme, Autocomplete } from '@mui/material';
import { grey } from '@mui/material/colors';
import { ProductBrandsInterface } from '../../../../../_shared/types';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { retrieveBrandOwners } from '../../../../_shared/api';

interface Props {
  submit?: (brand: ProductBrandsInterface) => void;
  cancel?: () => void;
  brand: ProductBrandsInterface;
  setForm: (brand: ProductBrandsInterface) => void;
}

const BrandForm = ({ brand, setForm }: Props) => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [debouncedEmail, setDebouncedEmail] = useState('');
  const user = retrieveBrandOwners({ email: debouncedEmail });
  const { owners } = user.data || {};
  const fileInputRef = useRef<any>();

  useEffect(() => {
    const emailTimeout = setTimeout(() => {
      setDebouncedEmail(email);
    }, 500);

    return () => {
      clearTimeout(emailTimeout);
    };
  }, [email]);

  const handleRemoveLogo = () => {
    setForm({ ...brand, logoUrl: null });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const fileReader = new FileReader();

      fileReader.onload = (e) => {
        const data = e.target?.result;

        if (data && typeof data === 'string') {
          setForm({ ...brand, logoUrl: data });

          fileInputRef.current.value = '';
        }
      };

      fileReader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', mb: 1 }}>
        {Boolean(brand.logoUrl) ? (
          <Box
            sx={{
              backgroundRepeat: 'no-repeat',
              backgroundColor: 'white',
              backgroundPosition: 'center',
              backgroundImage: `url(${brand.logoUrl})`,
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
            onChange={(e) => setForm({ ...brand, name: e.target.value })}
            value={brand.name}
          />

          <TextField
            label='URL'
            onChange={(e) => setForm({ ...brand, url: e.target.value })}
            value={brand.url}
          />

          <Autocomplete
            options={owners?.map((user) => user.email) || []}
            onChange={(_, newValue) => setForm({ ...brand, owner: newValue || null })}
            defaultValue={brand.owner || ''}
            value={brand.owner || ''}
            renderInput={(params) => (
              <TextField {...params} label='Owner' onChange={(e) => setEmail(e.target.value)} />
            )}
          />
        </Box>
      </Box>
    </>
  );
};

export default BrandForm;
