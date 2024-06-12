import { Button, List } from '@mui/material';
import { Loading, Section } from '../../../../_shared/components';
import { Icon } from '@mdi/react';
import { mdiPlusBox } from '@mdi/js';
import { useState } from 'react';
import AddOption from './AddOption';
import { useParams } from 'react-router-dom';
import OptionRow from './OptionRow';
import { retrieveProductOptions } from '../../../../_shared/api';

const VariantOptions = () => {
  const [status, setStatus] = useState('');
  const params = useParams();
  const { id, productId } = params;
  const { isLoading, data } = retrieveProductOptions({ productId: productId || id });
  const { options } = data || {};

  return isLoading ? (
    <Loading />
  ) : (
    <Section
      title='OPTIONS'
      titleVariant='h3'
      actions={[
        <Button key='add' startIcon={<Icon path={mdiPlusBox} size={1} />} onClick={() => setStatus('Add')}>
          Add
        </Button>
      ]}
    >
      {status === 'Add' && <AddOption cancel={() => setStatus('')} />}

      {options && options.length > 0 ? (
        <List disablePadding>
          {options?.map((option) => (
            <OptionRow key={option.id} option={option} />
          ))}
        </List>
      ) : null}
    </Section>
  );
};

export default VariantOptions;
