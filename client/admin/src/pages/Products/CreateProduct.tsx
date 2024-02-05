import { Breadcrumbs, Container, Link, Typography } from '@mui/material';
import { Section } from '../../../../_shared/components';
import ProductForm from './ProductForm';
import { useNavigate } from 'react-router-dom';

const CreateProduct = () => {
  const navigate = useNavigate();

  return (
    <Container disableGutters sx={{ p: 2 }}>
      <Breadcrumbs>
        <Link onClick={() => navigate('/products')}>Products</Link>

        <Typography>Create</Typography>
      </Breadcrumbs>

      <Section title={'Create Product'} titleVariant='h3'>
        <ProductForm />
      </Section>
    </Container>
  );
};

export default CreateProduct;
