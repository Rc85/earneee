import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Section } from '../../../../_shared/components';
import { Divider, Switch, Typography } from '@mui/material';
import { Fragment } from 'react';
import { retrieveStatuses, useCreateStatus } from '../../../../_shared/api';
import { StatusesInterface } from '../../../../../_shared/types';

const Statuses = () => {
  const { data } = retrieveStatuses();
  const { statuses } = data || {};
  const createStatus = useCreateStatus();

  const handleToggle = (status: StatusesInterface) => {
    status.online ? (status.online = false) : (status.online = true);

    createStatus.mutate({ status });
  };

  return (
    <Section title='Statuses' titleVariant='h3' position='center' sx={{ p: 2 }}>
      <Grid2 container spacing={1} justifyContent='space-between' alignItems='center'>
        {statuses?.map((status) => (
          <Fragment key={status.id}>
            <Grid2 xs='auto'>
              <Typography>
                {status.name
                  .split('_')
                  .map((name) => name.charAt(0).toUpperCase() + name.substring(1))
                  .join(' ')}
              </Typography>
            </Grid2>

            <Grid2 xs='auto'>
              <Switch color='success' checked={status.online} onChange={() => handleToggle(status)} />
            </Grid2>

            <Grid2 xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid2>
          </Fragment>
        ))}
      </Grid2>
    </Section>
  );
};

export default Statuses;
