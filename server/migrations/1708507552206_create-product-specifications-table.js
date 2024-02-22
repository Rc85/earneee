/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('product_specifications', {
    variant_id: {
      type: 'varchar',
      primaryKey: true,
      references: 'product_variants (id)',
      onUpdate: 'cascade',
      onDelete: 'cascade'
    },
    specification_id: {
      type: 'varchar',
      primaryKey: true,
      references: 'specifications (id)',
      onUpdate: 'cascade',
      onDelete: 'cascade'
    }
  });
};

exports.down = (pgm) => {
  pgm.dropTable('product_specifications');
};
