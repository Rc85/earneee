import { Breadcrumbs, Container, Link, Typography } from '@mui/material';
import { Loading, Section } from '../../../../_shared/components';
import { useLocation, useNavigate } from 'react-router-dom';
import OfferForm from './OfferForm';
import { retrieveOffers } from '../../../../_shared/api';

const CreateOffer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const offerId = location.state?.offerId;
  const { isLoading, data } = offerId ? retrieveOffers({ offerId }) : { isLoading: false, data: {} };
  const { offers } = data || {};
  const offer = offers?.[0];

  return isLoading ? (
    <Loading />
  ) : (
    <Container disableGutters sx={{ p: 2, overflow: 'hidden' }}>
      <Breadcrumbs>
        <Link onClick={() => navigate('/offers')}>Offers</Link>

        <Typography>{offer ? offer.name : 'Create'}</Typography>
      </Breadcrumbs>

      <Section title={offer ? 'Edit Offer' : 'Create Offer'} titleVariant='h3'>
        <OfferForm offer={offer} />
      </Section>
    </Container>
  );
};

export default CreateOffer;
