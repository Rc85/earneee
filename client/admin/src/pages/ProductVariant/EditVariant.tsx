import { Section } from '../../../../_shared/components';
import { useParams } from 'react-router-dom';
import VariantForm from '../Product/VariantForm';
import { retrieveProductVariants } from '../../../../_shared/api';

const EditVariant = () => {
  const params = useParams();
  const { variantId } = params;
  const { data: { data: { variants } } = { data: {} } } = retrieveProductVariants({ variantId });
  const variant = variants?.[0];

  return (
    <Section title='EDIT' titleVariant='h3'>
      <VariantForm variant={variant} />
    </Section>
  );
};

export default EditVariant;
