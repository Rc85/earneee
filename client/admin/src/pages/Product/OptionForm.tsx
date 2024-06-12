import { mdiPlaylistPlus } from '@mdi/js';
import { Icon } from '@mdi/react';
import { Box, Button, List } from '@mui/material';
import { OptionSelectionsInterface, ProductOptionsInterface } from '../../../../../_shared/types';
import SelectionRow from './SelectionRow';
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
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

interface Props {
  option: ProductOptionsInterface;
  onAddSelectionClick: () => void;
  onSelectionChange: (field: keyof OptionSelectionsInterface, value: any, index: number) => void;
  onSelectionToggle: (index: number) => void;
  onSelectionDelete: (index: number) => void;
  onSort: (selections: OptionSelectionsInterface[]) => void;
}

const OptionForm = ({
  option,
  onAddSelectionClick,
  onSelectionChange,
  onSelectionDelete,
  onSelectionToggle,
  onSort
}: Props) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;

    if (active.id !== over?.id && option.selections) {
      const oldIndex = option.selections.findIndex((selection) => selection.id === active.id);
      const newIndex = option.selections.findIndex((selection) => selection.id === over?.id);
      const sortedSelections = arrayMove(option.selections, oldIndex, newIndex);

      for (const i in sortedSelections) {
        const index = parseInt(i);
        const selection = sortedSelections[index];

        selection.ordinance = index + 1;
      }

      onSort(sortedSelections);
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button startIcon={<Icon path={mdiPlaylistPlus} size={1} />} onClick={onAddSelectionClick}>
          Add Selection
        </Button>
      </Box>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={option.selections || []} strategy={verticalListSortingStrategy}>
          <List disablePadding>
            {option.selections?.map((selection, i) => (
              <SelectionRow
                key={selection.id}
                index={i}
                selection={selection}
                onChange={onSelectionChange}
                onToggle={onSelectionToggle}
                onDelete={onSelectionDelete}
              />
            ))}
          </List>
        </SortableContext>
      </DndContext>
    </>
  );
};

export default OptionForm;
