'use client';

import { mdiCheckCircle } from '@mdi/js';
import Icon from '@mdi/react';
import { Box, Button, TextField } from '@mui/material';
import { useState } from 'react';

interface Props {
  apply: (minPrice: string | undefined, maxPrice: string | undefined) => void;
}

const PriceFilter = ({ apply }: Props) => {
  const [minPrice, setMinPrice] = useState<string | undefined>();
  const [maxPrice, setMaxPrice] = useState<string | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setMinPrice(undefined);
    setMaxPrice(undefined);

    apply(minPrice, maxPrice);
  };

  return (
    <Box component='form' onSubmit={handleSubmit} sx={{ mb: 3 }}>
      <TextField
        label='Mininum Price'
        type='number'
        onChange={(e) => setMinPrice(e.target.value)}
        value={minPrice || ''}
      />

      <TextField
        label='Maximum Price'
        type='number'
        onChange={(e) => setMaxPrice(e.target.value)}
        value={maxPrice || ''}
      />

      <Button type='submit' variant='contained' fullWidth startIcon={<Icon path={mdiCheckCircle} size={1} />}>
        Apply
      </Button>
    </Box>
  );
};

export default PriceFilter;
