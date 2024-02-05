'use client';

import Icon from '@mdi/react';
import { OffersInterface } from '../../../_shared/types';
import { mdiInformationOutline } from '@mdi/js';
import { Box, IconButton, Link, Typography } from '@mui/material';
import { useState } from 'react';
import Modal from '../../../_shared/components/Modal/Modal';

interface Props {
  offer: OffersInterface;
}

const Offer = ({ offer }: Props) => {
  const [status, setStatus] = useState('');

  return (
    <Box key={offer.id} sx={{ mb: 1, position: 'relative' }}>
      <Link href={offer.url}>
        <img src={offer.logo_url} />
      </Link>

      <Modal open={status === 'Details'} title='Details' cancel={() => setStatus('')} cancelText='Close'>
        <Typography>{offer.details}</Typography>
      </Modal>

      {Boolean(offer.details) && (
        <IconButton
          size='small'
          sx={{ position: 'absolute', bottom: 10, right: 10 }}
          onClick={() => setStatus('Details')}
        >
          <Icon path={mdiInformationOutline} size={1} />
        </IconButton>
      )}
    </Box>
  );
};

export default Offer;
