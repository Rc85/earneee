'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import Loading from './loading';
import { Container, Typography, useTheme } from '@mui/material';
import Icon from '@mdi/react';
import { mdiCheckCircleOutline, mdiCloseCircleOutline } from '@mdi/js';
import Link from 'next/link';

interface Props {
  params: { key: string };
}

const page = ({ params: { key } }: Props) => {
  const [status, setStatus] = useState('Loading');
  const [error, setError] = useState('');
  const theme = useTheme();

  useEffect(() => {
    (async () => {
      axios({
        method: 'patch',
        url: '/v1/user',
        data: { key }
      })
        .then((response) => {
          if (response.status === 200) {
            setStatus('Success');
          }
        })
        .catch((error) => {
          setStatus('Error');
          setError(error.response.data.statusText);
        });
    })();
  }, []);

  return status === 'Loading' ? (
    <Loading />
  ) : status === 'Error' ? (
    <Container maxWidth='sm' sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <Typography variant='h3'>Error</Typography>

      <Icon path={mdiCloseCircleOutline} size={3} color={theme.palette.error.main} />

      <Typography>{error}</Typography>
    </Container>
  ) : (
    <Container maxWidth='sm' sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <Typography variant='h3'>Success</Typography>

      <Icon path={mdiCheckCircleOutline} size={3} color={theme.palette.success.main} />

      <Typography>Your account has been activated.</Typography>

      <Typography variant='button'>
        <Link href='/login?redirect=/'>Login now</Link>
      </Typography>
    </Container>
  );
};

export default page;
