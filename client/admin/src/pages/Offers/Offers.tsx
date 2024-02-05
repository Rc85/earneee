import { Button, List } from '@mui/material';
import { Section } from '../../../../_shared/components';
import { Icon } from '@mdi/react';
import { mdiPlusBox } from '@mdi/js';
import CreateOffer from './CreateOffer';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { OffersInterface } from '../../../../_shared/types';
import { SupabaseContext } from '../../../../_shared/components/SupabaseProvider/SupabaseProvider';
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

const Offers = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<OffersInterface[]>([]);
  const { supabase } = useContext(SupabaseContext);
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    (async () => {
      await retrieveOffers();

      if (supabase) {
        const dbChanges = supabase
          .channel('schema-db-changes')
          .on('postgres_changes', { event: '*', schema: 'public' }, async (payload) => {
            if (payload.table === 'offers') {
              await retrieveOffers();
            }
          });

        dbChanges.subscribe();

        return () => {
          dbChanges.unsubscribe();
        };
      }
    })();
  }, []);

  const retrieveOffers = async () => {
    if (supabase) {
      const offers = await supabase.from('offers').select().order('ordinance');

      if (offers.data) {
        setOffers(offers.data);
      }
    }
  };

  const handleDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;

    if (active.id !== over?.id) {
      const oldIndex = offers.findIndex((offer) => offer.id === active.id);
      const newIndex = offers.findIndex((offer) => offer.id === over?.id);

      const sortedOffers = arrayMove(offers, oldIndex, newIndex);

      for (const i in sortedOffers) {
        const index = parseInt(i);
        const offer = sortedOffers[index];

        offer.ordinance = index + 1;
      }

      if (supabase) {
        await supabase.from('offers').upsert(sortedOffers);
      }
    }
  };

  return (
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
        <SortableContext items={offers} strategy={verticalListSortingStrategy}>
          <List disablePadding>
            {offers.map((offer) => (
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
