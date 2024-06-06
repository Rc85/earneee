import { useParams } from 'react-router-dom';
import { Section } from '../../../../_shared/components';
import ProductForm from '../Products/ProductForm';
import { retrieveProducts } from '../../../../_shared/api';

const EditProduct = () => {
  const params = useParams();
  const { id, productId } = params;
  const { data } = retrieveProducts({ id: productId || id, parentId: productId ? id : undefined });
  const { products } = data || {};
  const product = products?.[0];

  return (
    <Section title='EDIT PRODUCT' titleVariant='h3'>
      <ProductForm product={product} />
    </Section>
  );
};

export default EditProduct;
