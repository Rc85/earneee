import { Box } from '@mui/material';
import { Carousel, FeaturedProducts, Offer } from '../components';

const Index = async () => {
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflowX: 'hidden' }}>
        <Carousel />

        <FeaturedProducts type='new' />

        <FeaturedProducts type='popular' />
      </Box>

      <Box sx={{ width: '25%', minWidth: '200px', maxWidth: '300px', ml: 2 }}>
        {/* offers.data?.map((offer) => {
          return <Offer key={offer.id} offer={offer} />;
        }) */}
      </Box>
    </>
  );
};

export default Index;
