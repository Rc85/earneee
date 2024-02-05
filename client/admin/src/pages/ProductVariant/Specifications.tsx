import { Button, List } from '@mui/material';
import { Section } from '../../../../_shared/components';
import { Icon } from '@mdi/react';
import { mdiPlusBox } from '@mdi/js';
import { useContext, useEffect, useState } from 'react';
import AddSpecification from './AddSpecification';
import { ProductSpecificationsInterface } from '../../../../_shared/types';
import { SupabaseContext } from '../../../../_shared/components/SupabaseProvider/SupabaseProvider';
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

const Specifications = () => {
  const [status, setStatus] = useState('');
  const [specifications, setSpecifications] = useState<ProductSpecificationsInterface[]>([]);
  const { supabase } = useContext(SupabaseContext);
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    (async () => {
      await retrieveSpecifications();

      if (supabase) {
        const dbChanges = supabase
          .channel('schema-db-changes')
          .on('postgres_changes', { event: '*', schema: 'public' }, async (payload) => {
            if (payload.table === 'product_specifications') {
              await retrieveSpecifications();
            }
          });

        dbChanges.subscribe();

        return () => {
          dbChanges.unsubscribe();
        };
      }
    })();
  }, []);

  const retrieveSpecifications = async () => {
    if (supabase) {
      const response = await supabase.from('product_specifications').select().order('ordinance, name');

      if (response.data) {
        setSpecifications(response.data);
      }
    }
  };

  const handleDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;

    if (active.id !== over?.id) {
      const oldIndex = specifications.findIndex((spec) => spec.id === active.id);
      const newIndex = specifications.findIndex((spec) => spec.id === over?.id);

      const sortedSpecs = arrayMove(specifications, oldIndex, newIndex);

      for (const i in sortedSpecs) {
        const index = parseInt(i);
        const spec = sortedSpecs[index];

        spec.ordinance = index + 1;
      }

      if (supabase) {
        await supabase.from('product_specifications').upsert(sortedSpecs);
      }
    }
  };

  return (
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
        <SortableContext items={specifications} strategy={verticalListSortingStrategy}>
          <List disablePadding>
            {specifications.map((spec) => (
              <SpecificationRow key={spec.id} specification={spec} />
            ))}
          </List>
        </SortableContext>
      </DndContext>
    </Section>
  );
};

export default Specifications;
