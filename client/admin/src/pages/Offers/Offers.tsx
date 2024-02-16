import { Button, List } from '@mui/material';
import { Loading, Section } from '../../../../_shared/components';
import { Icon } from '@mdi/react';
import { mdiPlusBox } from '@mdi/js';
import CreateOffer from './CreateOffer';
import { useNavigate } from 'react-router-dom';
import OfferRow from './OfferRow';
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
import { retrieveOffers, useSortOffers } from '../../../../_shared/api';

const Offers = () => {
  const navigate = useNavigate();
  const { isLoading, data } = retrieveOffers();
  const { offers } = data || {};
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const sortOffers = useSortOffers();

  const handleDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;

    if (active.id !== over?.id && offers) {
      const oldIndex = offers.findIndex((offer) => offer.id === active.id);
      const newIndex = offers.findIndex((offer) => offer.id === over?.id);

      const sortedOffers = arrayMove(offers, oldIndex, newIndex);

      for (const i in sortedOffers) {
        const index = parseInt(i);
        const offer = sortedOffers[index];

        offer.ordinance = index + 1;
      }

      sortOffers.mutate({ offers: sortedOffers });
    }
  };

  return isLoading ? (
    <Loading />
  ) : (
    <Section
      title='Offers'
      titleVariant='h3'
      position='center'
      sx={{ p: 2 }}
      actions={[
        <Button
          key='create'
          startIcon={<Icon path={mdiPlusBox} size={1} />}
          onClick={() => navigate('/offers/create')}
        >
          Create
        </Button>
      ]}
    >
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={offers || []} strategy={verticalListSortingStrategy}>
          <List disablePadding>
            {offers?.map((offer) => (
              <OfferRow key={offer.id} offer={offer} />
            ))}
          </List>
        </SortableContext>
      </DndContext>
    </Section>
  );
};

Offers.Create = CreateOffer;

export default Offers;
