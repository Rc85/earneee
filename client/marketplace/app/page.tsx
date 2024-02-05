import { Box } from '@mui/material';
import { Carousel, FeaturedProducts, Offer } from '../components';
import { cookies } from 'next/headers';
import { createClient } from '../utils/supabase/server';
import { OffersInterface } from '../../_shared/types';

const Index = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const now = new Date().toISOString();
  const offers = await supabase
    .from('offers')
    .select()
    .or(`start_date.lte.${now},start_date.is.null`)
    .or(`end_date.gte.${now},end_date.is.null`)
    .order('ordinance')
    .returns<OffersInterface[]>();

  if (offers.data) {
    for (const offer of offers.data) {
      const logo = await supabase.storage
        .from('offers')
        .download(offer.logo_path, { transform: { width: 300 } });

      if (logo.data) {
        const buffer = await logo.data.arrayBuffer();

        offer.logo_url = `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`;
      }
    }
  }

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflowX: 'hidden' }}>
        <Carousel />

        <FeaturedProducts type='new' />

        <FeaturedProducts type='popular' />
      </Box>

      <Box sx={{ width: '25%', minWidth: '200px', maxWidth: '300px', ml: 2 }}>
        {offers.data?.map((offer) => {
          return <Offer key={offer.id} offer={offer} />;
        })}
      </Box>
    </>
  );
};

export default Index;
