'use client';

import { Box, Checkbox, Chip, FormControlLabel, ListItemText, TextField, Typography } from '@mui/material';
import {
  OptionSelectionsInterface,
  OrderItemsInterface,
  ProductOptionsInterface,
  ProductsInterface
} from '../../../../_shared/types';
import { Modal } from '../../../_shared/components';
import { ChangeEvent, useState } from 'react';
import { useSnackbar } from 'notistack';

interface Props {
  product: ProductsInterface;
  variant: ProductsInterface | undefined;
  item?: OrderItemsInterface;
  cancel: () => void;
  submit: (product: ProductsInterface, quantity: string) => void;
}

const ProductConfigurator = ({ product, variant, item, cancel, submit }: Props) => {
  const [quantity, setQuantity] = useState(item ? item.quantity.toString() : '1');
  const [selectedOptions, setSelectedOptions] = useState<ProductOptionsInterface[]>([]);
  const optionsCost = selectedOptions.reduce(
    (acc, option) =>
      acc + (option.selections?.reduce((acc, selection) => acc + (selection.price || 0), 0) || 0),
    0
  );
  const subtotal =
    ((product.url?.price || 0) + (variant?.url?.price || 0) + optionsCost) * parseInt(quantity);
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = () => {
    submit({ ...product, variants: variant ? [variant] : [], options: selectedOptions }, quantity);
  };

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (parseInt(e.target.value) < 1) {
      e.target.value = '1';
    }

    setQuantity(e.target.value);
  };

  const handleOptionChange = (
    selection: OptionSelectionsInterface,
    productOption: ProductOptionsInterface
  ) => {
    const options = [...selectedOptions];
    const index = options.findIndex((option) => option.id === productOption.id);

    if (index >= 0) {
      const selections = options[index].selections || [];
      const i = selections.findIndex((s) => s.id === selection.id);

      if (i >= 0) {
        if (selections.length > 1) {
          selections.splice(i, 1);

          options[index].selections = [...selections];
        } else {
          options.splice(index, 1);
        }
      } else if (productOption.maximumSelections && productOption.maximumSelections === selections.length) {
        return enqueueSnackbar('Maximum selections reached', { variant: 'error' });
      } else {
        selections.push(selection);

        options[index].selections = [...selections];
      }
    } else {
      options.push({ ...productOption, selections: [selection] });
    }

    console.log(options);

    setSelectedOptions(options);
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
      {product.options?.map((option) => (
        <OptionSelector
          key={option.id}
          option={option}
          onChange={handleOptionChange}
          selectedOptions={selectedOptions}
        />
      ))}

      {variant?.options?.map((option) => (
        <OptionSelector
          key={option.id}
          option={option}
          onChange={handleOptionChange}
          selectedOptions={selectedOptions}
        />
      ))}

      <TextField
        label='Quantity'
        type='number'
        value={quantity}
        onChange={handleQuantityChange}
        sx={{
          mt:
            (product.options && product.options.length > 0) ||
            (variant?.options && variant.options.length > 0)
              ? 3
              : 0
        }}
      />

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

const OptionSelector = ({
  option,
  onChange,
  selectedOptions
}: {
  option: ProductOptionsInterface;
  onChange: (selection: OptionSelectionsInterface, option: ProductOptionsInterface) => void;
  selectedOptions: ProductOptionsInterface[];
}) => {
  const selectedOption = selectedOptions.find((o) => o.id === option.id);
  const requiredSelections = option.minimumSelections;
  const selections = selectedOption?.selections || [];
  const required = option.required && selections.length < requiredSelections;

  let name = option.name;

  if (option.maximumSelections && option.minimumSelections === option.maximumSelections) {
    name += ` (select ${option.minimumSelections})`;
  } else if (option.minimumSelections !== option.maximumSelections) {
    name += ` (select up to ${option.maximumSelections})`;
  }

  return (
    <Box key={option.id}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <ListItemText
          primary={name}
          secondary={option.description}
          primaryTypographyProps={{ variant: 'h6', sx: { mb: 0 } }}
        />

        {required && <Chip size='small' color='error' label='Required' />}
      </Box>

      {option.selections?.map((selection) => (
        <Box key={selection.id}>
          <FormControlLabel
            label={
              <ListItemText
                primary={selection.name}
                secondary={selection.price ? `+$${selection.price?.toFixed(2)}` : undefined}
              />
            }
            checked={Boolean(selections.find((s) => s.id === selection.id))}
            control={<Checkbox color='info' />}
            onChange={() => onChange(selection, option)}
          />
        </Box>
      ))}
    </Box>
  );
};

export default ProductConfigurator;
