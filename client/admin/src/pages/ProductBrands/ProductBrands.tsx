import { Box, Button, List, Pagination } from '@mui/material';
import { Loading, Section } from '../../../../_shared/components';
import { Icon } from '@mdi/react';
import { mdiPlusBox } from '@mdi/js';
import CreateBrand from './CreateBrand';
import { useNavigate } from 'react-router-dom';
import ProductBrandRow from './ProductBrandRow';
import { retrieveProductBrands } from '../../../../_shared/api';
import { useState } from 'react';

const ProductBrands = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const { isLoading, data } = retrieveProductBrands();
  const { brands, count = 0 } = data || {};

  return isLoading ? (
    <Loading />
  ) : (
    <Section
      title='Product Brands'
      titleVariant='h3'
      position='center'
      disableGutters
      sx={{ p: 2 }}
      actions={[
        <Button
          key='create'
          startIcon={<Icon path={mdiPlusBox} size={1} />}
          onClick={() => navigate('/brand/create')}
        >
          Create
        </Button>
      ]}
    >
      <List disablePadding>
        {brands?.map((brand) => (
          <ProductBrandRow key={brand.id} brand={brand} />
        ))}
      </List>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination count={Math.ceil(count / 20)} page={page + 1} onChange={(_, page) => setPage(page - 1)} />
      </Box>
    </Section>
  );
};

ProductBrands.Create = CreateBrand;

export default ProductBrands;
