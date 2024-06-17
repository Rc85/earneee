import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  ListItemText,
  MenuItem,
  TextField,
  Typography
} from '@mui/material';
import { OrderShipmentsInterface } from '../../../../../_shared/types';
import { Loading, Section } from '../../../../_shared/components';
import { FormEvent, useState } from 'react';
import { deepEqual } from '../../../../../_shared/utils';
import { useParams } from 'react-router-dom';
import { retrieveOrder, useCreateOrderShipment } from '../../../../_shared/api';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import Icon from '@mdi/react';
import { mdiArrowUpDropCircle, mdiPackageVariantClosedRemove, mdiRefresh } from '@mdi/js';
import dayjs from 'dayjs';
import { grey } from '@mui/material/colors';

const CreateOrderShipment = () => {
  const params = useParams();
  const { orderId } = params;
  const { isLoading, data } = retrieveOrder({ orderId });
  const { order } = data || {};
  const initialShipment = {
    id: '',
    orderId,
    shippingProvider: '',
    trackingNumber: '',
    eta: '',
    createdAt: '',
    updatedAt: '',
    items: []
  };
  const [form, setForm] = useState<OrderShipmentsInterface>(JSON.parse(JSON.stringify(initialShipment)));
  const [status, setStatus] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const orderItems = order?.items.filter((item) => item.status === 'processed') || [];

  const handleSuccess = (response: any) => {
    if (response.data.statusText) {
      enqueueSnackbar(response.data.statusText, { variant: 'success' });
    }

    setForm(JSON.parse(JSON.stringify(initialShipment)));

    setStatus('');
  };

  const handleError = (err: any) => {
    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }

    setStatus('');
  };

  const createOrderShipment = useCreateOrderShipment(handleSuccess, handleError);

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();

    setStatus('Creating');

    createOrderShipment.mutate({ orderShipment: form });
  };

  const handleAddItemChange = (_: any, child?: any) => {
    const item = order?.items.find((item) => item.id === child?.props.value);

    if (item) {
      const items = form.items ? [...form.items] : [];
      const index = items.findIndex((i) => i.id === item.id);

      if (index >= 0) {
        items.splice(index, 1);
      } else {
        items.push(item);
      }

      setForm({ ...form, items });
    }
  };

  const handleResetClick = () => {
    setForm(JSON.parse(JSON.stringify(initialShipment)));
  };

  return (
    <Section title='Create Order Shipment' titleVariant='h3' component='form' onSubmit={handleSubmit}>
      {isLoading ? (
        <Loading />
      ) : order && orderItems.length > 0 ? (
        <>
          <TextField
            label='Shipping Provider'
            value={form.shippingProvider}
            onChange={(e) => setForm({ ...form, shippingProvider: e.target.value })}
          />

          <TextField
            label='Tracking Number'
            value={form.trackingNumber}
            onChange={(e) => setForm({ ...form, trackingNumber: e.target.value })}
          />

          <TextField
            label='ETA'
            type='date'
            value={form.eta ? dayjs(form.eta).format('YYYY-MM-DD') : ''}
            onChange={(e) => setForm({ ...form, eta: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label='Add Products'
            size='small'
            select
            SelectProps={{
              multiple: true,
              renderValue: (selected) => selected instanceof Array && `${selected.length} selected`
            }}
            value={form.items}
            onChange={handleAddItemChange}
          >
            {orderItems.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                <Checkbox
                  color='info'
                  checked={Boolean(form.items?.find((orderItem) => orderItem.id === item.id))}
                />

                <ListItemText primary={item.name} />
              </MenuItem>
            ))}
          </TextField>

          <LoadingButton
            variant='contained'
            type='submit'
            startIcon={<Icon path={mdiArrowUpDropCircle} size={1} />}
            loading={status === 'Creating'}
            loadingIndicator={<CircularProgress size={20} />}
            loadingPosition='start'
            fullWidth
            disabled={deepEqual(form, initialShipment)}
          >
            Submit
          </LoadingButton>

          <Button
            color='inherit'
            sx={{ mt: 1 }}
            fullWidth
            startIcon={<Icon path={mdiRefresh} size={1} />}
            onClick={handleResetClick}
          >
            Reset
          </Button>
        </>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Icon path={mdiPackageVariantClosedRemove} size={3} color={grey[500]} />

          <Typography sx={{ mt: 3 }}>There are no products to ship</Typography>
        </Box>
      )}
    </Section>
  );
};

export default CreateOrderShipment;
