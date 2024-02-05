import { Icon } from '@mdi/react';
import { ProductFilterOptionsInterface } from '../../../../_shared/types';
import { mdiDragHorizontalVariant, mdiTrashCan } from '@mdi/js';
import { Box, IconButton, TextField, useTheme } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
  option: ProductFilterOptionsInterface;
  remove: () => void;
  onChange: (key: keyof ProductFilterOptionsInterface, value: any) => void;
}

const FilterOptionRow = ({ option, remove, onChange }: Props) => {
  const theme = useTheme();
  const { attributes, setNodeRef, transform, transition, listeners } = useSortable({ id: option.id });

  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <Box
      key={option.id}
      sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
      {...attributes}
      style={style}
      ref={setNodeRef}
    >
      <IconButton size='small' sx={{ mr: 1 }} {...listeners}>
        <Icon path={mdiDragHorizontalVariant} size={1} />
      </IconButton>

      <TextField
        label='Name'
        required
        sx={{ mb: '0 !important' }}
        value={option.name}
        onChange={(e) => onChange('name', e.target.value)}
      />

      <TextField
        label='Value'
        required
        sx={{ mb: '0 !important', ml: 1 }}
        value={option.value}
        onChange={(e) => onChange('value', e.target.value)}
      />

      <IconButton size='small' sx={{ ml: 1 }} onClick={remove}>
        <Icon path={mdiTrashCan} size={1} color={theme.palette.error.main} />
      </IconButton>
    </Box>
  );
};

export default FilterOptionRow;
