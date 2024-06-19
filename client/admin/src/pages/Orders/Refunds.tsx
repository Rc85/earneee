import { useState } from 'react';
import { Loading, Section } from '../../../../_shared/components';
import { listRefunds } from '../../../../_shared/api';
import { Box, List, Pagination, Typography } from '@mui/material';
import RefundRow from './RefundRow';

const Refunds = () => {
  const [page, setPage] = useState(0);
  const { isLoading, data } = listRefunds({ offset: page, limit: 20 });
  const { refunds, count = 0 } = data || {};

  return isLoading ? (
    <Loading />
  ) : (
    <Section title='Refunds' titleVariant='h3'>
      {refunds && refunds.length > 0 ? (
        <List disablePadding>
          {refunds.map((refund) => (
            <RefundRow key={refund.id} refund={refund} />
          ))}
        </List>
      ) : (
        <Typography>There are no refunds</Typography>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={Math.ceil(count / 20)}
          page={page + 1}
          onChange={(_, page) => setPage(page - 1)}
          showFirstButton
          showLastButton
        />
      </Box>
    </Section>
  );
};

export default Refunds;
