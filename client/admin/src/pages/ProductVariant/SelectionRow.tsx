import { Box, IconButton, InputAdornment, ListItem, Switch, TextField, useTheme } from '@mui/material';
import { OptionSelectionsInterface } from '../../../../../_shared/types';
import { memo } from 'react';
import { Icon } from '@mdi/react';
import { mdiDragHorizontalVariant, mdiTrashCan } from '@mdi/js';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
  selection: OptionSelectionsInterface;
  index: number;
  onChange: (field: keyof OptionSelectionsInterface, value: any, index: number) => void;
  onToggle: (index: number) => void;
  onDelete: (index: number) => void;
}

const SelectionRow = memo(({ onChange, onDelete, index, onToggle, selection }: Props) => {
  const theme = useTheme();
  const { attributes, listeners, transform, transition, setNodeRef } = useSortable({ id: selection.id });

  const style = { transform: CSS.Transform.toString(transform), transition };

  const handleOnChange = (field: keyof OptionSelectionsInterface, value: any) => {
    console.log(value);

    onChange(field, value, index);
  };

  return (
    <ListItem ref={setNodeRef} disableGutters disablePadding style={style} {...attributes}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', flexGrow: 1 }}>
        <IconButton size='small' {...listeners} sx={{ mr: 1 }}>
          <Icon path={mdiDragHorizontalVariant} size={1} />
        </IconButton>

        <TextField
          label='Name'
          required
          value={selection.name}
          sx={{ mr: 1, flexBasis: '75%' }}
          onChange={(e) => handleOnChange('name', e.target.value)}
        />

        <TextField
          label='Price'
          type='number'
          value={selection.price}
          sx={{ flexBasis: '25%' }}
          onChange={(e) => handleOnChange('price', e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position='start'>$</InputAdornment> }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Switch
            color='success'
            checked={selection.status === 'available'}
            onChange={() => onToggle(index)}
          />

          <IconButton size='small' onClick={() => onDelete(index)}>
            <Icon path={mdiTrashCan} size={1} color={theme.palette.error.main} />
          </IconButton>
        </Box>
      </Box>
    </ListItem>
  );
});

export default SelectionRow;
