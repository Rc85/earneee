'use client';

import { retrieveMostRecentCategories } from '../../../_shared/api';
import { Loading } from '../../../_shared/components';
import { useAppSelector } from '../../../_shared/redux/store';
import ProductShowcase from '../ProductShowcase/ProductShowcase';

const CategoryProducts = () => {
  const { country } = useAppSelector((state) => state.App);
  const { isLoading, data } = retrieveMostRecentCategories({ country });
  const { categories } = data || {};

  return isLoading ? (
    <Loading />
  ) : (
    categories?.map((category) => (
      <ProductShowcase
        key={category.id}
        title={category.name.toUpperCase()}
        products={category.products || []}
        actionUrl={`/products/${category.id}`}
        breadcrumbs={category.ancestors || []}
      />
    ))
  );
};

export default CategoryProducts;
