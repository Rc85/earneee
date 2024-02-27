import { InputAdornment, TextField } from '@mui/material';
import { AffiliatesInterface, ProductUrlsInterface } from '../../../../../_shared/types';
import { Modal } from '../../../../_shared/components';
import { useState } from 'react';
import { generateKey } from '../../../../../_shared/utils';
import { countries } from '../../../../../_shared';

interface Props {
  cancel: () => void;
  submit: (url: ProductUrlsInterface) => void;
  variantId: string;
  url?: ProductUrlsInterface;
  affiliates: AffiliatesInterface[];
}

const AddUrl = ({ cancel, url, submit, affiliates, variantId }: Props) => {
  const [form, setForm] = useState(
    url || {
      id: generateKey(1),
      url: '',
      price: 0,
      currency: 'cad',
      country: 'CA',
      affiliateId: null,
      variantId,
      createdAt: new Date().toISOString(),
      updatedAt: null
    }
  );

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    submit(form);
  };

  const handleAffiliateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const affiliate = affiliates.find((affiliate) => affiliate.id === e.target.value);

    if (affiliate) {
      setForm({ ...form, affiliate, affiliateId: affiliate.id });
    } else {
      setForm({ ...form, affiliate: undefined, affiliateId: null });
    }
  };

  return (
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
        required
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

      <TextField
        label='Affiliate'
        select
        SelectProps={{ native: true }}
        onChange={handleAffiliateChange}
        value={form.affiliateId}
      >
        <option value=''></option>

        {affiliates.map((affiliate) => (
          <option key={affiliate.id} value={affiliate.id}>
            {affiliate.name}
          </option>
        ))}
      </TextField>
    </Modal>
  );
};

export default AddUrl;
