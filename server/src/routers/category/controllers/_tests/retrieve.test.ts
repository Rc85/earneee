import { describe, expect, it, test } from 'vitest';
import { retrieveProductCategories } from '../retrieve';

describe('get up to 6 categories', () => {
  it('will get 1 category', () => {
    const products: any = [
      { id: 'a', categoryId: 1 },
      { id: 'b', categoryId: 1 },
      { id: 'c', categoryId: 1 },
      { id: 'd', categoryId: 1 },
      { id: 'e', categoryId: 1 },
      { id: 'f', categoryId: 1 },
      { id: 'g', categoryId: 1 },
      { id: 'h', categoryId: 1 },
      { id: 'i', categoryId: 1 },
      { id: 'j', categoryId: 1 },
      { id: 'k', categoryId: 1 },
      { id: 'l', categoryId: 1 },
      { id: 'm', categoryId: 1 },
      { id: 'n', categoryId: 1 },
      { id: 'o', categoryId: 1 }
    ];

    const categoryIds = retrieveProductCategories(products, []);

    expect(categoryIds).to.have.lengthOf(1);
  });

  it('will get 2 categories', () => {
    const products: any = [
      { id: 'a', categoryId: 1 },
      { id: 'b', categoryId: 1 },
      { id: 'c', categoryId: 1 },
      { id: 'd', categoryId: 2 },
      { id: 'e', categoryId: 2 },
      { id: 'f', categoryId: 2 }
    ];

    const categoryIds = retrieveProductCategories(products, []);

    expect(categoryIds).to.have.lengthOf(2);
  });

  it('will get 3 categories', () => {
    const products: any = [
      { id: 'a', categoryId: 1 },
      { id: 'b', categoryId: 1 },
      { id: 'c', categoryId: 2 },
      { id: 'd', categoryId: 3 }
    ];

    const categoryIds = retrieveProductCategories(products, []);

    expect(categoryIds).to.have.lengthOf(3);
  });

  it('will get 4 categories', () => {
    const products: any = [
      { id: 'a', categoryId: 1 },
      { id: 'b', categoryId: 1 },
      { id: 'c', categoryId: 1 },
      { id: 'd', categoryId: 2 },
      { id: 'e', categoryId: 3 },
      { id: 'f', categoryId: 4 },
      { id: 'g', categoryId: 4 }
    ];

    const categoryIds = retrieveProductCategories(products, []);

    expect(categoryIds).to.have.lengthOf(4);
  });

  it('will get 5 categories', () => {
    const products: any = [
      { id: 'a', categoryId: 1 },
      { id: 'b', categoryId: 1 },
      { id: 'c', categoryId: 1 },
      { id: 'd', categoryId: 2 },
      { id: 'e', categoryId: 3 },
      { id: 'f', categoryId: 4 },
      { id: 'g', categoryId: 5 },
      { id: 'h', categoryId: 5 }
    ];

    const categoryIds = retrieveProductCategories(products, []);

    expect(categoryIds).to.have.lengthOf(5);
  });

  it('will get 6 categories', () => {
    const products: any = [
      { id: 'a', categoryId: 1 },
      { id: 'b', categoryId: 1 },
      { id: 'c', categoryId: 1 },
      { id: 'd', categoryId: 2 },
      { id: 'e', categoryId: 3 },
      { id: 'f', categoryId: 4 },
      { id: 'g', categoryId: 5 },
      { id: 'h', categoryId: 5 },
      { id: 'i', categoryId: 5 },
      { id: 'j', categoryId: 5 },
      { id: 'k', categoryId: 6 },
      { id: 'l', categoryId: 7 },
      { id: 'm', categoryId: 8 },
      { id: 'n', categoryId: 9 },
      { id: 'o', categoryId: 9 }
    ];

    const categoryIds = retrieveProductCategories(products, []);

    expect(categoryIds).to.have.lengthOf(6);
  });
});
