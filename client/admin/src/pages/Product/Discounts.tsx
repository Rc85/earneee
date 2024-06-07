import { mdiPlusBox } from '@mdi/js';
import Icon from '@mdi/react';
import { Button, List } from '@mui/material';
import { Section } from '../../../../_shared/components';
import { useState } from 'react';
import CreateDiscounts from './CreateDiscounts';
import { useParams } from 'react-router-dom';
import { retrieveProductDiscounts } from '../../../../_shared/api';
import DiscountRow from './DiscountRow';

const Discounts = () => {
  const [status, setStatus] = useState('');
  const params = useParams();
  const { id, productId } = params;
  const { data } = retrieveProductDiscounts({ productId: productId || id! });
  const { discounts = [] } = data || {};

  return (
    <Section
      title='DISCOUNTS'
      titleVariant='h3'
      actions={[
        <Button
          key='add'
          startIcon={<Icon path={mdiPlusBox} size={1} />}
          sx={{ mr: 1 }}
          onClick={() => setStatus('Create')}
        >
          Create
        </Button>
      ]}
    >
      {status === 'Create' && <CreateDiscounts cancel={() => setStatus('')} />}

      {discounts.length > 0 && (
        <List disablePadding>
          {discounts.map((discount) => (
            <DiscountRow key={discount.id} discount={discount} />
          ))}
        </List>
      )}
    </Section>
  );
};

export default Discounts;
