import { Button, List } from '@mui/material';
import { Loading, Section } from '../../../../_shared/components';
import { Icon } from '@mdi/react';
import { mdiPlusBox } from '@mdi/js';
import { useState } from 'react';
import AddSpecification from './AddSpecification';
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
import SpecificationRow from './SpecificationRow';
import { retrieveProductSpecifications, useSortProductSpecifications } from '../../../../_shared/api';
import { useParams } from 'react-router-dom';

const Specifications = () => {
  const [status, setStatus] = useState('');
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const params = useParams();
  const { variantId } = params;
  const { isLoading, data: { data: { specifications } } = { data: {} } } = retrieveProductSpecifications({
    variantId
  });
  const sortProductSpecifications = useSortProductSpecifications();

  const handleDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;

    if (active.id !== over?.id && specifications) {
      const oldIndex = specifications.findIndex((spec) => spec.id === active.id);
      const newIndex = specifications.findIndex((spec) => spec.id === over?.id);

      const sortedSpecs = arrayMove(specifications, oldIndex, newIndex);

      for (const i in sortedSpecs) {
        const index = parseInt(i);
        const spec = sortedSpecs[index];

        spec.ordinance = index + 1;
      }

      sortProductSpecifications.mutate({ specifications: sortedSpecs });
    }
  };

  return isLoading ? (
    <Loading />
  ) : (
    <Section
      title='Specifications'
      titleVariant='h3'
      actions={[
        <Button
          key='add'
          startIcon={<Icon path={mdiPlusBox} size={1} />}
          onClick={() => setStatus('Add Specification')}
        >
          Add
        </Button>
      ]}
    >
      {status === 'Add Specification' && <AddSpecification cancel={() => setStatus('')} />}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={specifications || []} strategy={verticalListSortingStrategy}>
          <List disablePadding>
            {specifications?.map((spec) => (
              <SpecificationRow key={spec.id} specification={spec} />
            ))}
          </List>
        </SortableContext>
      </DndContext>
    </Section>
  );
};

export default Specifications;
