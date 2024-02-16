import { Button, List } from '@mui/material';
import { Loading, Section } from '../../../../_shared/components';
import Icon from '@mdi/react';
import { mdiPlusBox } from '@mdi/js';
import { useState } from 'react';
import AddUrl from './AddUrl';
import { useParams } from 'react-router-dom';
import { retrieveProductUrls } from '../../../../_shared/api';
import UrlRow from './UrlRow';

const ProductUrls = () => {
  const [status, setStatus] = useState('');
  const params = useParams();
  const { variantId } = params;
  const { isLoading, data } = retrieveProductUrls({ variantId });
  const { urls } = data || {};

  return isLoading ? (
    <Loading />
  ) : (
    <Section
      title='URLS'
      titleVariant='h3'
      actions={[
        <Button key='add' startIcon={<Icon path={mdiPlusBox} size={1} />} onClick={() => setStatus('Add')}>
          Add
        </Button>
      ]}
    >
      {status === 'Add' && <AddUrl cancel={() => setStatus('')} variantId={variantId!} />}

      <List disablePadding>
        {urls?.map((url) => (
          <UrlRow key={url.id} url={url} />
        ))}
      </List>
    </Section>
  );
};

export default ProductUrls;
