import { List } from '@mui/material';
import { Loading, Section } from '../../../../_shared/components';
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
import VariantRow from './VariantRow';
import { retrieveProductVariants, useSortProductVariants } from '../../../../_shared/api';
import { useParams } from 'react-router-dom';

const ProductVariants = () => {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const params = useParams();
  const { productId } = params;
  const { isLoading, data } = retrieveProductVariants({ productId });
  const { variants } = data || {};
  const sortVariants = useSortProductVariants();

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;

    if (active.id !== over?.id && variants) {
      const oldIndex = variants.findIndex((variant) => variant.id === active.id);
      const newIndex = variants.findIndex((variant) => variant.id === over?.id);

      const sortedVariants = arrayMove(variants, oldIndex, newIndex);

      for (const i in sortedVariants) {
        const index = parseInt(i);
        const variant = sortedVariants[index];

        variant.ordinance = index + 1;
      }

      sortVariants.mutate({ variants: sortedVariants });
    }
  };

  return isLoading ? (
    <Loading />
  ) : (
    <Section title='VARIANTS' titleVariant='h3'>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={variants || []} strategy={verticalListSortingStrategy}>
          <List disablePadding>
            {variants?.map((variant) => (
              <VariantRow key={variant.id} variant={variant} />
            ))}
          </List>
        </SortableContext>
      </DndContext>
    </Section>
  );
};

export default ProductVariants;
