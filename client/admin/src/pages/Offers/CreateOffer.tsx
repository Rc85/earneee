import { Breadcrumbs, CircularProgress, Container, Link, Typography } from '@mui/material';
import { Section } from '../../../../_shared/components';
import { useNavigate } from 'react-router-dom';
import OfferForm from './OfferForm';
import { FormEvent, useContext, useState } from 'react';
import { OffersInterface } from '../../../../../_shared/types';
import { generateKey } from '../../../../../_shared/utils';
import { LoadingButton } from '@mui/lab';
import { Icon } from '@mdi/react';
import { mdiArrowUpDropCircle } from '@mdi/js';
import { SupabaseContext } from '../../../../_shared/components/SupabaseProvider/SupabaseProvider';
import { useSnackbar } from 'notistack';

const CreateOffer = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<OffersInterface>({
    id: generateKey(1),
    name: '',
    url: '',
    logo_path: '',
    logo_url: '',
    logo_width: 0,
    logo_height: 0,
    ordinance: 0,
    start_date: null,
    end_date: null,
    details: null,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: null
  });
  const [status, setStatus] = useState('');
  const [file, setFile] = useState<File | undefined>();
  const { supabase } = useContext(SupabaseContext);
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (key: keyof OffersInterface, value: any) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();

    if (supabase) {
      setStatus('Loading');

      /* if (form.logo_url) {
        const image = new Image();

        image.onload = () => {
          const { width, height } = image;

          form.logo_height = height;
          form.logo_width = width;
        };

        image.src = form.logo_url;
      } */

      if (file) {
        const response = await supabase.storage.from('offers').upload(`${form.id}/banner.png`, file);

        if (!response.error) {
          form.logo_path = response.data.path;
          form.logo_url = `${import.meta.env.VITE_STORAGE_URL}offers/${response.data.path}`;
        }
      }

      const response = await supabase.from('offers').insert(form);

      setStatus('');

      if (response.error) {
        return enqueueSnackbar(response.error.message, { variant: 'error' });
      }

      setFile(undefined);

      setForm({
        id: generateKey(1),
        name: '',
        url: '',
        logo_path: '',
        logo_url: '',
        logo_width: 0,
        logo_height: 0,
        details: null,
        ordinance: 0,
        start_date: null,
        end_date: null,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: null
      });

      enqueueSnackbar(response.statusText, { variant: 'success' });
    }
  };

  return (
    <Container disableGutters sx={{ p: 2 }}>
      <Breadcrumbs>
        <Link onClick={() => navigate('/offers')}>Offers</Link>

        <Typography>Create</Typography>
      </Breadcrumbs>

      <Section title='Create Offer' titleVariant='h3' component='form' onSubmit={handleSubmit}>
        <OfferForm onChange={handleChange} setFile={setFile} offer={form} />

        <LoadingButton
          type='submit'
          startIcon={<Icon path={mdiArrowUpDropCircle} size={1} />}
          variant='contained'
          loading={status === 'Loading'}
          loadingPosition='start'
          loadingIndicator={<CircularProgress size={20} />}
          sx={{ mt: 1 }}
          fullWidth
        >
          Submit
        </LoadingButton>
      </Section>
    </Container>
  );
};

export default CreateOffer;
