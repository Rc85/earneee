import { mdiTrashCan, mdiUpload } from '@mdi/js';
import Icon from '@mdi/react';
import { Box, IconButton, Button, TextField, useTheme } from '@mui/material';
import { grey } from '@mui/material/colors';
import { countries } from '../../../../../_shared';
import { ProductBrandUrlsInterface, ProductBrandsInterface } from '../../../../../_shared/types';
import { generateKey } from '../../../../../_shared/utils';
import { ChangeEvent, useRef } from 'react';
import { retrieveUserProfiles } from '../../../../_shared/api';

interface Props {
  submit?: (brand: ProductBrandsInterface) => void;
  cancel?: () => void;
  brand: ProductBrandsInterface;
  setForm: (brand: ProductBrandsInterface) => void;
}

const BrandForm = ({ brand, setForm }: Props) => {
  const theme = useTheme();
  const user = retrieveUserProfiles();
  const { userProfiles } = user.data || {};
  const fileInputRef = useRef<any>();

  const handleUrlChange = (value: string, key: keyof ProductBrandUrlsInterface, index: number) => {
    const urls = brand.urls ? [...brand.urls] : [];

    urls[index][key] = value;

    setForm({ ...brand, urls });
  };

  const handleRemoveUrl = (index: number) => {
    const urls = brand.urls ? [...brand.urls] : [];

    if (index >= 0) {
      urls.splice(index, 1);
    }

    setForm({ ...brand, urls });
  };

  const handleAddWebsiteLinkClick = () => {
    const urls = brand.urls ? [...brand.urls] : [];

    urls.push({ id: generateKey(1), url: '', country: 'CA', brandId: '', createdAt: '', updatedAt: '' });

    setForm({ ...brand, urls });
  };

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
            label='Owner'
            select
            SelectProps={{ native: true }}
            onChange={(e) => setForm({ ...brand, owner: e.target.value })}
            value={brand.owner || ''}
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

      {brand.urls?.map((url, i) => (
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
    </>
  );
};

export default BrandForm;
