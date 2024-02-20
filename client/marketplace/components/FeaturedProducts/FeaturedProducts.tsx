'use server';

import { ProductVariantsInterface } from '../../../../_shared/types';
import Carousel from './Carousel';

const FeaturedProducts = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/product/variant/retrieve?scope=marketplace&featured=true&limit=5`,
    {
      next: { revalidate: 300, tags: ['featured products'] },
      credentials: 'include'
    }
  );
  const data = await res.json();
  const variants: ProductVariantsInterface[] = data.variants;

  return <Carousel variants={variants} />;
};

export default FeaturedProducts;
