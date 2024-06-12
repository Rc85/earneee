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
import { retrieveProducts, useSortProducts } from '../../../../_shared/api';
import { useNavigate, useParams } from 'react-router-dom';
import ProductRow from '../Products/ProductRow';

const ProductVariants = () => {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const params = useParams();
  const { id } = params;
  const { isLoading, data } = retrieveProducts({ id });
  const { products } = data || {};
  const sortProducts = useSortProducts();
  const navigate = useNavigate();
  const product = products?.[0];

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;

    if (active.id !== over?.id && product) {
      const variants = product.variants || [];
      const oldIndex = variants.findIndex((product) => product.id === active.id);
      const newIndex = variants.findIndex((product) => product.id === over?.id);

      const sortedProducts = arrayMove(variants, oldIndex, newIndex);

      for (const i in sortedProducts) {
        const index = parseInt(i);
        const product = sortedProducts[index];

        product.ordinance = index + 1;
      }

      sortProducts.mutate({ products: sortedProducts });
    }
  };

  return isLoading ? (
    <Loading />
  ) : (
    <Section title='VARIANTS' titleVariant='h3'>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={product?.variants || []} strategy={verticalListSortingStrategy}>
          <List disablePadding>
            {product?.variants?.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                onClick={() => navigate(`/product/${product.parentId}/variant/${product.id}`)}
                sortable
              />
            ))}
          </List>
        </SortableContext>
      </DndContext>
    </Section>
  );
};

export default ProductVariants;
