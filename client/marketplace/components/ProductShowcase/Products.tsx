'use client';

import { ProductVariantsInterface } from '../../../../_shared/types';
import Product from './Product';

interface Props {
  variants: ProductVariantsInterface[];
}

const Products = ({ variants }: Props) => {
  return variants?.map((variant, i) => (
    <Product key={variant.id} variant={variant} isLast={i === variants.length - 1} />
  ));
};

export default Products;
