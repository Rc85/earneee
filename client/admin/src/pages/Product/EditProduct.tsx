import { useOutletContext } from 'react-router-dom';
import { Section } from '../../../../_shared/components';
import ProductForm from '../Products/ProductForm';
import { ProductsInterface } from '../../../../_shared/types';

const EditProduct = () => {
  const { product } = useOutletContext<{ product: ProductsInterface }>();

  return (
    <Section title='EDIT PRODUCT' titleVariant='h3'>
      <ProductForm product={product} />
    </Section>
  );
};

export default EditProduct;
