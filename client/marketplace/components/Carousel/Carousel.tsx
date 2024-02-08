'use server';

import { cookies } from 'next/headers';
import { createClient } from '../../utils/supabase/server';
import CarouselContainer from './CarouselContainer';

const Carousel = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const response = await supabase.functions.invoke('retrieve-featured-products', {
    body: { featured: true }
  });

  const variants = response.data?.products || [];

  return <CarouselContainer variants={variants} />;
};

export default Carousel;
