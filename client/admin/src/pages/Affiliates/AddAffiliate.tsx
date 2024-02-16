import { Breadcrumbs, Container, Link, Typography } from '@mui/material';
import { Loading, Section } from '../../../../_shared/components';
import AffiliateForm from './AffiliateForm';
import { useLocation, useNavigate } from 'react-router-dom';
import { retrieveAffiliates } from '../../../../_shared/api';

const AddAffiliate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const affiliateId = location.state?.affiliateId;
  const { isLoading, data } = affiliateId
    ? retrieveAffiliates({ affiliateId })
    : { isLoading: false, data: {} };
  const { affiliates } = data || {};
  const affiliate = affiliates?.[0];

  return isLoading ? (
    <Loading />
  ) : (
    <Container disableGutters sx={{ p: 2 }}>
      <Breadcrumbs>
        <Link onClick={() => navigate('/affiliates')}>Affiliates</Link>

        <Typography>{affiliate ? affiliate.name : 'Add'}</Typography>
      </Breadcrumbs>

      <Section title={affiliate ? 'Edit Affiliate' : 'Add Affiliate'} titleVariant='h3' component='form'>
        <AffiliateForm affiliate={affiliate} />
      </Section>
    </Container>
  );
};

export default AddAffiliate;
