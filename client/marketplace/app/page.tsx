import { Box } from '@mui/material';
import { FeaturedProducts, ProductShowcase, Offer, Subscribe } from '../components';
import { OffersInterface, StatusesInterface } from '../../../_shared/types';

const Index = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/offer?status=active`, {
    next: { revalidate: 300, tags: ['offers'] },
    credentials: 'include'
  });
  const data = await res.json();
  const offers: OffersInterface[] = data.offers;
  const status = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/statuses`);
  const statusData = await status.json();
  const statuses: StatusesInterface[] = statusData.statuses;
  const emailSubscriptionStatus = statuses.find((status) => status.name === 'email_subscription');

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflowX: 'hidden' }}>
          <FeaturedProducts />

          <ProductShowcase type='new' />

          <ProductShowcase type='popular' />
        </Box>

        <Box sx={{ width: '25%', minWidth: '200px', maxWidth: '300px', ml: 2 }}>
          {offers?.map((offer) => {
            return <Offer key={offer.id} offer={offer} />;
          })}
        </Box>
      </Box>

      {emailSubscriptionStatus?.online && <Subscribe />}
    </>
  );
};

export default Index;
