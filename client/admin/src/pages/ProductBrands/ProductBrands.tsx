import { Button, List } from '@mui/material';
import { Section } from '../../../../_shared/components';
import { Icon } from '@mdi/react';
import { mdiPlusBox } from '@mdi/js';
import CreateBrand from './CreateBrand';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { ProductBrandsInterface } from '../../../../../_shared/types';
import { SupabaseContext } from '../../../../_shared/components/SupabaseProvider/SupabaseProvider';
import ProductBrandRow from './ProductBrandRow';

const ProductBrands = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState<ProductBrandsInterface[]>([]);
  const { supabase } = useContext(SupabaseContext);

  useEffect(() => {
    (async () => {
      await retrieveBrands();

      if (supabase) {
        const dbChanges = supabase
          .channel('schema-db-changes')
          .on('postgres_changes', { event: '*', schema: 'public' }, async (payload) => {
            if (payload.table === 'product_brands') {
              await retrieveBrands();
            }
          });

        dbChanges.subscribe();

        return () => {
          dbChanges.unsubscribe();
        };
      }
    })();
  }, []);

  const retrieveBrands = async () => {
    if (supabase) {
      const response = await supabase.from('product_brands').select().order('name');

      if (response.data) {
        setBrands(response.data);
      }
    }
  };

  return (
    <Section
      title='Product Brand'
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
        {brands.map((brand) => (
          <ProductBrandRow key={brand.id} brand={brand} />
        ))}
      </List>
    </Section>
  );
};

ProductBrands.Create = CreateBrand;

export default ProductBrands;
