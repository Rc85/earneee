'use client';

import Icon from '@mdi/react';
import { OffersInterface } from '../../../../_shared/types';
import { mdiInformationOutline } from '@mdi/js';
import { Box, IconButton, Link, Typography } from '@mui/material';
import { useState } from 'react';
import Modal from '../../../_shared/components/Modal/Modal';
import dayjs from 'dayjs';

interface Props {
  offer: OffersInterface;
}

const Offer = ({ offer }: Props) => {
  const [status, setStatus] = useState('');

  return (
    <Box key={offer.id} sx={{ mb: 1, position: 'relative' }}>
      <Modal open={status === 'Details'} title='Details' cancel={() => setStatus('')} cancelText='Close'>
        <Typography>{offer.details}</Typography>
      </Modal>

      <Link href={offer.url}>
        <img src={offer.logoUrl} style={{ maxWidth: '100%' }} />
      </Link>

      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Typography>{offer.name}</Typography>

        {Boolean(offer.details) && (
          <IconButton size='small' onClick={() => setStatus('Details')}>
            <Icon path={mdiInformationOutline} size={1} />
          </IconButton>
        )}
      </Box>

      {Boolean(offer.startDate || offer.endDate) && (
        <Typography variant='body2' color='GrayText'>
          {offer.startDate ? `Starts ${dayjs(offer.startDate).format('MMM DD, YYYY')}` : ''}
          {offer.startDate && offer.endDate ? ' ' : ''}
          {offer.endDate ? `Ends ${dayjs(offer.endDate).format('MMM DD, YYYY')}` : ''}
        </Typography>
      )}
    </Box>
  );
};

export default Offer;
