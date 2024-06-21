'use client';

import { retrieveProductShowcase } from '../../../_shared/api';
import { useAppSelector } from '../../../_shared/redux/store';
import ProductShowcase from '../ProductShowcase/ProductShowcase';

const RecentProducts = () => {
  const { country } = useAppSelector((state) => state.App);
  const { data } = retrieveProductShowcase({ type: 'recent', country });
  const { products } = data || {};

  return <ProductShowcase title='RECENTLY ADDED' products={products || []} />;
};

export default RecentProducts;
