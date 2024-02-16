import { useState } from 'react';
import { Loading, Section } from '../../../../_shared/components';
import { Box, Button, List, Pagination } from '@mui/material';
import AffiliateRow from './AffiliateRow';
import AddAffiliate from './AddAffiliate';
import { Icon } from '@mdi/react';
import { mdiPlusBox } from '@mdi/js';
import { useNavigate } from 'react-router-dom';
import { retrieveAffiliates } from '../../../../_shared/api';

const Affiliates = () => {
  const [page, setPage] = useState(0);
  const { isLoading, data } = retrieveAffiliates({
    offset: page * 20
  });
  const { affiliates, count = 0 } = data || {};
  const navigate = useNavigate();

  return isLoading ? (
    <Loading />
  ) : (
    <Section
      title='Affiliates'
      titleVariant='h3'
      position='center'
      sx={{ p: 2 }}
      actions={[
        <Button
          key='add'
          startIcon={<Icon path={mdiPlusBox} size={1} />}
          onClick={() => navigate('/affiliates/add')}
        >
          Add
        </Button>
      ]}
    >
      <List disablePadding>
        {affiliates?.map((affiliate) => (
          <AffiliateRow key={affiliate.id} affiliate={affiliate} />
        ))}
      </List>

      {count > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={Math.ceil(count / 30)}
            page={page + 1}
            onChange={(_, page) => setPage(page - 1)}
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Section>
  );
};

Affiliates.Add = AddAffiliate;

export default Affiliates;
