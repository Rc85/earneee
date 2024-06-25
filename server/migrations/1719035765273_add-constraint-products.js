/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.dropConstraint({ name: 'products', schema: 'public' }, 'products_name_key');

  pgm.createIndex({ name: 'products', schema: 'public' }, ['name', 'category_id'], {
    name: 'unique_product_name_idx',
    unique: true,
    where: 'parent_id IS null'
  });

  pgm.createIndex({ name: 'products', schema: 'public' }, ['name', 'category_id', 'parent_id'], {
    name: 'unique_variant_name_idx',
    unique: true,
    where: 'parent_id IS NOT NULL'
  });
};

exports.down = (pgm) => {
  pgm.dropIndex({ name: 'products', schema: 'public' }, ['name'], { name: 'unique_product_name_idx' });
  pgm.dropIndex({ name: 'products', schema: 'public' }, ['name', 'parent_id'], {
    name: 'unique_variant_name_idx'
  });
};
