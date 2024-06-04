import { Box } from '@mui/material';
import { FeaturedProducts, ProductShowcase, Offer, Subscribe } from '../components';
import { OffersInterface, StatusesInterface } from '../../../_shared/types';

const Page = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/v1/offer?status=active`, {
    next: { revalidate: 30, tags: ['offers'] },
    credentials: 'include'
  });
  const data = await res.json();
  const offers: OffersInterface[] = data.offers;
  const status = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/v1/statuses`, {
    next: { revalidate: 5 }
  });
  const statusData = await status.json();
  const statuses: StatusesInterface[] = statusData.statuses;
  const emailSubscriptionStatus = statuses.find((status) => status.name === 'email_subscription');

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflowX: 'hidden', mr: 2 }}>
          <FeaturedProducts />

          <ProductShowcase type='new' />
        </Box>

        {Boolean(offers && offers.length > 0) && (
          <Box sx={{ width: '30%', minWidth: '250px', maxWidth: '350px' }}>
            {offers?.map((offer) => {
              return <Offer key={offer.id} offer={offer} />;
            })}
          </Box>
        )}
      </Box>

      {emailSubscriptionStatus?.online && <Subscribe />}
    </>
  );
};

export default Page;
