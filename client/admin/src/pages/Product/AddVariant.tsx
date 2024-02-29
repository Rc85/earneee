import { useParams } from 'react-router-dom';
import { generateKey } from '../../../../../_shared/utils';
import { Section } from '../../../../_shared/components';
import VariantForm from './VariantForm';

const AddVariant = () => {
  const params = useParams();
  const { productId } = params;

  return (
    <Section title='Add Variant' titleVariant='h3'>
      <VariantForm
        variant={{
          id: generateKey(1),
          name: '',
          ordinance: 0,
          excerpt: null,
          description: null,
          about: null,
          details: null,
          featured: false,
          productId: productId!,
          status: 'available',
          createdAt: new Date().toISOString(),
          updatedAt: null,
          urls: []
        }}
      />
    </Section>
  );
};

export default AddVariant;
