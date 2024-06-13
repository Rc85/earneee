import { Box, Button, InputAdornment, TextField } from '@mui/material';
import { ProductDiscountsInterface, ProductUrlsInterface } from '../../../../../_shared/types';
import { Modal } from '../../../../_shared/components';
import { useState } from 'react';
import { generateKey } from '../../../../../_shared/utils';
import { countries } from '../../../../../_shared';
import { retrieveAffiliates } from '../../../../_shared/api';
import Icon from '@mdi/react';
import { mdiPlusBox } from '@mdi/js';
import CreateDiscount from './CreateDiscount';
import Discount from './Discount';

interface Props {
  cancel: () => void;
  submit: (url: ProductUrlsInterface) => void;
  url?: ProductUrlsInterface;
}

const AddUrl = ({ cancel, url, submit }: Props) => {
  const [status, setStatus] = useState('');
  const { data } = retrieveAffiliates();
  const { affiliates } = data || {};
  const [form, setForm] = useState<ProductUrlsInterface>(
    url || {
      id: generateKey(1),
      url: '',
      price: 0,
      currency: 'cad',
      country: 'CA',
      type: 'affiliate',
      shippingTime: null,
      refundTime: null,
      affiliateId: null,
      productId: '',
      variantId: null,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      discounts: []
    }
  );

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    submit(form);
  };

  const handleAffiliateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const affiliate = affiliates?.find((affiliate) => affiliate.id === e.target.value);

    if (affiliate) {
      setForm({ ...form, affiliate, affiliateId: affiliate.id });
    } else {
      setForm({ ...form, affiliate: undefined, affiliateId: null });
    }
  };

  const handleCreateDiscount = (discount: ProductDiscountsInterface) => {
    const discounts = form.discounts ? [...form.discounts] : [];
    const index = discounts.findIndex((d) => d.id === discount.id);

    if (index >= 0) {
      discounts[index] = discount;
    } else {
      discounts.push(discount);
    }

    setForm({ ...form, discounts });
    setStatus('');
  };

  const handleRemoveDiscount = (index: number) => {
    const discounts = form.discounts ? [...form.discounts] : [];

    discounts.splice(index, 1);

    setForm({ ...form, discounts });
  };

  const handleReturnTimeChange = (value: string, index: number) => {
    const refundTime = form.refundTime;
    const returnTimeChunks = refundTime ? refundTime.split(' ') : [];

    returnTimeChunks[index] = value;

    setForm({ ...form, refundTime: returnTimeChunks.join(' ') });
  };

  return (
    <>
      {status === 'Create Discount' && (
        <CreateDiscount submit={handleCreateDiscount} cancel={() => setStatus('')} />
      )}

      <Modal
        open
        title={url ? 'Edit URL' : 'Add URL'}
        cancel={cancel}
        submit={handleSubmit}
        component='form'
        disableBackdropClick
      >
        <TextField
          label='URL'
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          autoFocus
        />

        <TextField
          label='Country'
          select
          SelectProps={{ native: true }}
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
        >
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </TextField>

        <TextField
          label='Price'
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value as unknown as number })}
          InputProps={{ startAdornment: <InputAdornment position='start'>$</InputAdornment> }}
          required
        />

        <TextField
          label='Currency'
          select
          SelectProps={{ native: true }}
          onChange={(e) => setForm({ ...form, currency: e.target.value })}
          value={form.currency}
        >
          <option value='aud'>Australian Dollar</option>
          <option value='cad'>Canadian Dollar</option>
          <option value='eur'>Euro</option>
          <option value='gbp'>Pound</option>
          <option value='usd'>US Dollar</option>
        </TextField>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              startIcon={<Icon path={mdiPlusBox} size={1} />}
              onClick={() => setStatus('Create Discount')}
            >
              Create Discount
            </Button>
          </Box>

          {form.discounts?.map((discount, i) => (
            <Discount
              key={discount.id}
              discount={discount}
              submit={handleCreateDiscount}
              remove={() => handleRemoveDiscount(i)}
            />
          ))}
        </Box>

        <TextField
          label='Type'
          required
          select
          SelectProps={{ native: true }}
          onChange={(e) => setForm({ ...form, type: e.target.value, affiliateId: null })}
          value={form.type}
        >
          <option value='affiliate'>Affiliate</option>
          <option value='dropship'>Dropship</option>
          <option value='direct'>Direct Sale</option>
        </TextField>

        {form.type === 'affiliate' ? (
          <TextField
            label='Affiliate'
            select
            SelectProps={{ native: true }}
            onChange={handleAffiliateChange}
            value={form.affiliateId || ''}
          >
            <option value=''></option>

            {affiliates?.map((affiliate) => (
              <option key={affiliate.id} value={affiliate.id}>
                {affiliate.name}
              </option>
            ))}
          </TextField>
        ) : (
          <>
            <TextField
              label='Shipping Time'
              value={form.shippingTime || ''}
              onChange={(e) => setForm({ ...form, shippingTime: e.target.value })}
            />

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                label='Return Time'
                value={form.refundTime ? form.refundTime.split(' ')[0] : ''}
                onChange={(e) => handleReturnTimeChange(e.target.value, 0)}
                sx={{ mb: '0 !important', mr: 1 }}
              />

              <TextField
                select
                SelectProps={{ native: true }}
                value={form.refundTime ? form.refundTime.split(' ')[1] : ''}
                onChange={(e) => handleReturnTimeChange(e.target.value, 1)}
                sx={{ mb: '0 !important', width: '35%' }}
              >
                <option value=''></option>
                <option value='day'>Day</option>
                <option value='week'>Week</option>
                <option value='month'>Month</option>
              </TextField>
            </Box>
          </>
        )}
      </Modal>
    </>
  );
};

export default AddUrl;
