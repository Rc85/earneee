import { Button, List } from '@mui/material';
import { Loading, Section } from '../../../../_shared/components';
import { Icon } from '@mdi/react';
import { mdiPlusBox } from '@mdi/js';
import { useState } from 'react';
import CreateCategory from './CreateCategory';
import CategoryRow from './CategoryRow';
import { useParams } from 'react-router-dom';
import { retrieveCategories } from '../../../../_shared/api';

const Categories = () => {
  const [status, setStatus] = useState('');
  const params = useParams();
  const { parentId } = params;
  const { isLoading, data } = retrieveCategories({
    parentId: parentId ? parseInt(parentId) : undefined
  });
  const { categories } = data || {};

  const handleCreateClick = () => {
    setStatus('Create');
  };

  const handleCancelClick = () => {
    setStatus('');
  };

  return isLoading ? (
    <Loading />
  ) : (
    <Section
      title='Categories'
      titleVariant='h3'
      position='center'
      actions={[
        <Button key='create' startIcon={<Icon path={mdiPlusBox} size={1} />} onClick={handleCreateClick}>
          Create
        </Button>
      ]}
      sx={{ p: 2 }}
    >
      {status === 'Create' && <CreateCategory cancel={handleCancelClick} />}

      <List disablePadding>
        {categories?.map((category) => (
          <CategoryRow key={category.id} category={category} />
        ))}
      </List>
    </Section>
  );
};

export default Categories;
