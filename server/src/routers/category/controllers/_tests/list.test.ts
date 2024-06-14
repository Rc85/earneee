import { expect, test } from 'vitest';
import { buildSubcategories } from '../list';
import util from 'util';

test('build subcategories', () => {
  const categories: any[] = [
    { id: 1, name: 'Chins', parentId: null, count: 0 },
    { id: 2, name: 'Kans', parentId: null, count: 0 },
    { id: 3, name: 'Smiths', parentId: null, count: 0 }
  ];

  const subcategories: any[] = [
    { id: 4, name: 'Amy', parentId: 2, count: 0 },
    { id: 5, name: 'Peter', parentId: 16, count: 0 },
    { id: 6, name: 'Danny', parentId: 2, count: 0 },
    { id: 7, name: 'Aaron', parentId: 2, count: 0 },
    { id: 8, name: 'Patty', parentId: 16, count: 1 },
    { id: 9, name: 'Bill', parentId: 5, count: 1 },
    { id: 10, name: 'David', parentId: 9, count: 0 },
    { id: 11, name: 'Gary', parentId: 3, count: 0 },
    { id: 12, name: 'Cathy', parentId: 3, count: 1 },
    { id: 13, name: 'Samantha', parentId: 10, count: 0 },
    { id: 14, name: 'Amanda', parentId: 1, count: 0 },
    { id: 15, name: 'Alex', parentId: 1, count: 0 },
    { id: 16, name: 'Roger', parentId: 1, count: 0 },
    { id: 17, name: 'Jenny', parentId: 2, count: 0 },
    { id: 19, name: 'Nathan', parentId: 15, count: 0 },
    { id: 20, name: 'Ryan', parentId: 15, count: 1 },
    { id: 21, name: 'Haley', parentId: 15, count: 0 },
    { id: 22, name: 'Ngee Shen', parentId: 1, count: 0 },
    { id: 23, name: 'Alvin', parentId: 2, count: 1 },
    { id: 24, name: 'Todd', parentId: 8, count: 1 },
    { id: 25, name: 'Beverly', parentId: 8, count: 0 },
    { id: 26, name: 'Simon', parentId: 8, count: 1 }
  ];

  const newCategories = [];

  for (const category of categories) {
    const newCategory = buildSubcategories(category, subcategories);

    if (newCategory) {
      newCategories.push(newCategory);
    }
  }

  console.log('results', util.inspect(newCategories, { showHidden: false, depth: null, colors: true }));
});
