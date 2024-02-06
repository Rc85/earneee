import { Box, Button, List, Pagination, Typography } from '@mui/material';
import { Loading, Section } from '../../../../_shared/components';
import { Icon } from '@mdi/react';
import { mdiPlusBox } from '@mdi/js';
import { useNavigate } from 'react-router-dom';
import CreateProduct from './CreateProduct';
import ProductRow from './ProductRow';
import SearchProducts from './SearchProducts';
import { retrieveProducts } from '../../../../_shared/api';
import { useState } from 'react';

const Products = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const { isLoading, data: { data: { products, count = 0 } } = { data: {} } } = retrieveProducts();

  const handleCreateClick = () => {
    navigate('/products/create');
  };

  return isLoading ? (
    <Loading />
  ) : (
    <Section
      title='Products'
      titleVariant='h3'
      position='center'
      actions={[
        <Button key='create' startIcon={<Icon path={mdiPlusBox} size={1} />} onClick={handleCreateClick}>
          Create
        </Button>
      ]}
      sx={{ p: 2, flex: 1 }}
    >
      {/* <SearchProducts onChange={retrieveProducts} /> */}

      {products && products.length > 0 ? (
        <>
          <List disablePadding>
            {products.map((product) => (
              <ProductRow key={product.id} product={product} />
            ))}
          </List>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={Math.ceil(count / 20)}
              page={page + 1}
              onChange={(_, page) => setPage(page - 1)}
              showFirstButton
              showLastButton
            />
          </Box>
        </>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <Typography>There are no products</Typography>
        </Box>
      )}
    </Section>
  );
};

Products.Create = CreateProduct;

export default Products;
