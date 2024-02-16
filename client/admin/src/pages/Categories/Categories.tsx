import { Button, List } from '@mui/material';
import { Loading, Section } from '../../../../_shared/components';
import { Icon } from '@mdi/react';
import { mdiPlusBox } from '@mdi/js';
import { useState } from 'react';
import CreateCategory from './CreateCategory';
import CategoryRow from './CategoryRow';
import { useParams } from 'react-router-dom';
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  closestCenter,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { retrieveCategories, useSortCategories } from '../../../../_shared/api';

const Categories = () => {
  const [status, setStatus] = useState('');
  const params = useParams();
  const { parentId } = params;
  const { isLoading, data } = retrieveCategories({
    parentId: parentId ? parseInt(parentId) : undefined
  });
  const { categories } = data || {};
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const sortCategories = useSortCategories();

  const handleCreateClick = () => {
    setStatus('Create');
  };

  const handleCancelClick = () => {
    setStatus('');
  };

  const handleDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;

    if (active.id !== over?.id && categories) {
      const oldIndex = categories.findIndex((category) => category.id === active.id);
      const newIndex = categories.findIndex((category) => category.id === over?.id);

      const sortedCategories = arrayMove(categories, oldIndex, newIndex);

      for (const i in sortedCategories) {
        const index = parseInt(i);
        const category = sortedCategories[index];

        category.ordinance = index + 1;
      }

      sortCategories.mutate({ categories: sortedCategories });
    }
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

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={categories || []} strategy={verticalListSortingStrategy}>
          <List disablePadding>
            {categories?.map((category) => (
              <CategoryRow key={category.id} category={category} />
            ))}
          </List>
        </SortableContext>
      </DndContext>
    </Section>
  );
};

export default Categories;
