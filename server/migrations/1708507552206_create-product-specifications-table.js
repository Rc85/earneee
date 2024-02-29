/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('product_specifications', {
    id: {
      type: 'varchar',
      primaryKey: true
    },
    specification_id: {
      type: 'varchar',
      primaryKey: true,
      references: 'specifications (id)',
      onUpdate: 'cascade',
      onDelete: 'cascade'
    },
    product_id: {
      type: 'varchar',
      notNull: true,
      references: 'products (id)',
      onUpdate: 'cascade',
      onDelete: 'cascade'
    },
    variant_id: {
      type: 'varchar',
      references: 'product_variants (id)',
      onUpdate: 'cascade',
      onDelete: 'cascade'
    }
  });

  pgm.createIndex('product_specifications', ['specification_id', 'product_id', 'variant_id'], {
    name: 'product_specifications_unique_specification_id_product_id_variant_id',
    unique: true,
    where: 'variant_id IS NOT NULL'
  });

  pgm.createIndex('product_specifications', ['specification_id', 'product_id'], {
    name: 'product_specifications_unique_specification_id_product_id',
    unique: true,
    where: 'variant_id IS NULL'
  });
};

exports.down = (pgm) => {
  pgm.dropTable('product_specifications');
};
