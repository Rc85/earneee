'use client';

import { Box, TextField, Typography } from '@mui/material';
import { OrderItemsInterface, ProductsInterface } from '../../../../_shared/types';
import { Modal } from '../../../_shared/components';
import { ChangeEvent, useState } from 'react';

interface Props {
  product: ProductsInterface;
  variant: ProductsInterface | undefined;
  item?: OrderItemsInterface;
  cancel: () => void;
  submit: (product: ProductsInterface, quantity: string) => void;
}

const ProductConfigurator = ({ product, variant, item, cancel, submit }: Props) => {
  const [quantity, setQuantity] = useState(item ? item.quantity.toString() : '1');
  const subtotal = ((product.url?.price || 0) + (variant?.url?.price || 0)) * parseInt(quantity);

  const handleSubmit = () => {
    submit({ ...product, variants: variant ? [variant] : [] }, quantity);
  };

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (parseInt(e.target.value) < 1) {
      e.target.value = '1';
    }

    setQuantity(e.target.value);
  };

  return (
    <Modal
      open
      title={product.name}
      subtitle={variant?.name}
      cancel={cancel}
      submit={handleSubmit}
      disableBackdropClick
    >
      <TextField label='Quantity' type='number' value={quantity} onChange={handleQuantityChange} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant='h6' sx={{ mb: 0 }}>
          SUBTOTAL
        </Typography>

        <Typography variant='h6' sx={{ mb: 0 }}>
          ${subtotal.toFixed(2)}
        </Typography>
      </Box>
    </Modal>
  );
};

export default ProductConfigurator;
