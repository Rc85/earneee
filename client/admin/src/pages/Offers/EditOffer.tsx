import { FormEvent, useContext, useEffect, useState } from 'react';
import { Modal } from '../../../../_shared/components';
import { OffersInterface } from '../../../../_shared/types';
import OfferForm from './OfferForm';
import { SupabaseContext } from '../../../../_shared/components/SupabaseProvider/SupabaseProvider';
import { useSnackbar } from 'notistack';

interface Props {
  offer: OffersInterface;
  cancel: () => void;
}

const EditOffer = ({ offer, cancel }: Props) => {
  const [form, setForm] = useState({ ...offer });
  const [file, setFile] = useState<File | undefined>();
  const { supabase } = useContext(SupabaseContext);
  const [status, setStatus] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (offer) {
      setForm({ ...offer });
    }
  }, [offer]);

  const handleOnChange = (key: keyof OffersInterface, value: any) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();

    if (supabase) {
      setStatus('Loading');

      if (file) {
        const response = await supabase.storage.from('offers').upload(`${form.id}/banner.png`, file);

        if (!response.error) {
          form.logo_path = response.data.path;
          form.logo_url = `${import.meta.env.VITE_STORAGE_URL}offers/${response.data.path}`;
        }
      }

      const response = await supabase
        .from('offers')
        .update({
          name: form.name,
          url: form.url,
          details: form.details || null,
          logo_path: form.logo_path,
          logo_url: form.logo_url,
          start_date: form.start_date || null,
          end_date: form.end_date || null
        })
        .eq('id', form.id);

      setStatus('');

      if (response.error) {
        return enqueueSnackbar(response.error.message, { variant: 'error' });
      }

      setFile(undefined);

      cancel();

      enqueueSnackbar('Offer updated', { variant: 'success' });
    }
  };

  return (
    <Modal
      open
      title='Edit Offer'
      cancel={cancel}
      submit={handleSubmit}
      component='form'
      disableBackdropClick
      loading={status === 'Loading'}
    >
      <OfferForm offer={form} onChange={handleOnChange} setFile={setFile} />
    </Modal>
  );
};

export default EditOffer;
