import { List } from '@mui/material';
import { Section } from '../../../../_shared/components';
import { useContext, useEffect, useState } from 'react';
import { SupabaseContext } from '../../../../_shared/components/SupabaseProvider/SupabaseProvider';
import { useParams } from 'react-router-dom';
import { ProductVariantsInterface } from '../../../../_shared/types';
import { useSnackbar } from 'notistack';
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

const ProductVariants = () => {
  const [status, setStatus] = useState('');
  const [variants, setVariants] = useState<ProductVariantsInterface[]>([]);
  const { supabase } = useContext(SupabaseContext);
  const params = useParams();
  const { productId } = params;
  const { enqueueSnackbar } = useSnackbar();
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (supabase) {
      (async () => {
        await retrieveVariants();
      })();

      const dbChanges = supabase
        .channel('schema-db-changes')
        .on('postgres_changes', { event: '*', schema: 'public' }, async (payload) => {
          if (payload.table === 'product_variants') {
            await retrieveVariants();
          }
        });

      dbChanges.subscribe();

      return () => {
        dbChanges.unsubscribe();
      };
    }
  }, []);

  const retrieveVariants = async () => {
    if (supabase) {
      const variants = await supabase
        .from('product_variants')
        .select()
        .eq('product_id', productId)
        .order('ordinance');

      if (variants.data) {
        setVariants(variants.data);
      }
    }
  };

  const handleAddVariant = async (variant: ProductVariantsInterface) => {
    if (supabase && productId) {
      setStatus('Loading');

      if (!variant.ordinance) {
        variant.ordinance = variants.length;
      }

      variant.product_id = productId;

      const response = await supabase.from('product_variants').upsert(variant);

      setStatus('');

      if (response.error) {
        const message = response.error.code === '23505' ? 'Name already exist' : response.error.message;

        return enqueueSnackbar(message, { variant: 'error' });
      }
    }
  };

  const handleDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;

    if (active.id !== over?.id) {
      const oldIndex = variants.findIndex((variant) => variant.id === active.id);
      const newIndex = variants.findIndex((variant) => variant.id === over?.id);

      const sortedVariants = arrayMove(variants, oldIndex, newIndex);

      for (const i in sortedVariants) {
        const index = parseInt(i);
        const variant = sortedVariants[index];

        variant.ordinance = index + 1;
      }

      if (supabase) {
        await supabase.from('product_variants').upsert(sortedVariants);
      }
    }
  };

  return (
    <Section title='VARIANTS' titleVariant='h3'>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={variants} strategy={verticalListSortingStrategy}>
          <List disablePadding>
            {variants.map((variant) => (
              <VariantRow
                key={variant.id}
                variant={variant}
                onEdit={handleAddVariant}
                loading={status === 'Loading'}
              />
            ))}
          </List>
        </SortableContext>
      </DndContext>
    </Section>
  );
};

export default ProductVariants;
