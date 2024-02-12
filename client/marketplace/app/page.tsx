import { Box } from '@mui/material';
import { FeaturedProducts, ProductShowcase, Offer } from '../components';
import { OffersInterface } from '../../../_shared/types';

const Index = async (props: any) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/offer/retrieve?status=active`, {
    next: { revalidate: 300, tags: ['offers'] },
    credentials: 'include'
  });
  const data = await res.json();
  const offers: OffersInterface[] = data.offers;

  return (
    <>
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
    </>
  );
};

export default Index;
