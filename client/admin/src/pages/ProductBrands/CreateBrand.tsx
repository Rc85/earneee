import { Box, Button, CircularProgress, IconButton, TextField, useTheme } from '@mui/material';
import { Section } from '../../../../_shared/components';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@mdi/react';
import { mdiArrowUpDropCircle, mdiRefresh, mdiTrashCan, mdiUpload } from '@mdi/js';
import { grey } from '@mui/material/colors';
import { ChangeEvent, FormEvent, useContext, useEffect, useRef, useState } from 'react';
import { deepEqual, generateKey } from '../../../../../_shared/utils';
import { ProductBrandsInterface, UserProfilesInterface } from '../../../../../_shared/types';
import { LoadingButton } from '@mui/lab';
import { SupabaseContext } from '../../../../_shared/components/SupabaseProvider/SupabaseProvider';
import { useSnackbar } from 'notistack';

const CreateBrand = () => {
  const location = useLocation();
  const brand: ProductBrandsInterface | undefined = location.state?.brand;
  const theme = useTheme();
  const fileInputRef = useRef<any>();
  const [users, setUsers] = useState<UserProfilesInterface[]>([]);
  const [status, setStatus] = useState('');
  const initialState: ProductBrandsInterface = brand || {
    id: generateKey(1),
    name: '',
    logo_url: null,
    logo_path: null,
    owner: null,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: null
  };
  const [form, setForm] = useState<ProductBrandsInterface>(JSON.parse(JSON.stringify(initialState)));
  const { supabase } = useContext(SupabaseContext);
  const [file, setFile] = useState<File>();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (supabase) {
        const users = await supabase.from('user_profiles_with_email').select().order('email');

        if (users.data) {
          setUsers(users.data);
        }
      }
    })();
  }, []);

  const handleRemoveLogo = () => {
    setForm({ ...form, logo_url: null });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setFile(file);

      const fileReader = new FileReader();

      fileReader.onload = (e) => {
        const data = e.target?.result;

        if (data && typeof data === 'string') {
          setForm({ ...form, logo_url: data });

          fileInputRef.current.value = '';
        }
      };

      fileReader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();

    if (supabase) {
      setStatus('Loading');

      if (file) {
        fileInputRef.current.value = '';

        const response = await supabase.storage
          .from('product_brands')
          .upload(`${form.id}/logo.png`, file, { upsert: true });

        if (response.error) {
          setStatus('');

          return enqueueSnackbar(response.error.message, { variant: 'error' });
        }

        form.logo_path = response.data.path;
        form.logo_url = `${import.meta.env.VITE_STORAGE_URL}product_brands/${response.data.path}`;
      } else if (!form.logo_url && form.logo_path) {
        await supabase.storage.from('product_brands').remove([form.logo_path]);
      }

      const response = await supabase.from('product_brands').upsert(form);

      setStatus('');

      if (response.error) {
        return enqueueSnackbar(response.error.message, { variant: 'error' });
      }

      navigate(-1);
    }
  };

  return (
    <Section
      title='Create Brand'
      titleVariant='h3'
      position='center'
      sx={{ p: 2 }}
      component='form'
      onSubmit={handleSubmit}
    >
      <Box sx={{ display: 'flex', mb: 1 }}>
        {Boolean(form.logo_url) ? (
          <Box
            sx={{
              backgroundRepeat: 'no-repeat',
              backgroundColor: 'white',
              backgroundPosition: 'center',
              backgroundImage: `url(${form.logo_url})`,
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
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.email}
              </option>
            ))}
          </TextField>
        </Box>
      </Box>

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
