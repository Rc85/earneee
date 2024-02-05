import { Section } from '../../../../_shared/components';
import { useContext } from 'react';
import { ProductVariantsInterface } from '../../../../_shared/types';
import { useOutletContext } from 'react-router-dom';
import { SupabaseContext } from '../../../../_shared/components/SupabaseProvider/SupabaseProvider';
import { useSnackbar } from 'notistack';
import VariantForm from '../Product/VariantForm';

const EditVariant = () => {
  const { variant } = useOutletContext<any>();
  const { supabase } = useContext(SupabaseContext);
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (variant: ProductVariantsInterface) => {
    if (supabase) {
      const response = await supabase
        .from('product_variants')
        .update({
          name: variant.name,
          url: variant.url,
          price: variant.price,
          description: variant.description || null,
          featured: variant.featured
        })
        .eq('id', variant.id);

      if (response.error) {
        return enqueueSnackbar(response.error.message, { variant: 'error' });
      }

      enqueueSnackbar('Updated', { variant: 'success' });
    }
  };

  return (
    <Section title='EDIT' titleVariant='h3'>
      <VariantForm variant={variant} submit={handleSubmit} />
    </Section>
  );
};

export default EditVariant;
