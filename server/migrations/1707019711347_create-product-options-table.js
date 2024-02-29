/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable(
    { name: 'product_options', schema: 'public' },
    {
      id: {
        type: 'varchar',
        primaryKey: true
      },
      name: {
        type: 'varchar',
        notNull: true
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
      },
      required: {
        type: 'boolean',
        notNull: true,
        default: false
      },
      status: {
        type: 'varchar',
        notNull: true,
        default: 'available'
      },
      created_at: {
        type: 'timestamptz',
        default: pgm.func('now()'),
        notNull: true
      },
      updated_at: {
        type: 'timestamptz'
      }
    }
  );

  pgm.createIndex({ name: 'product_options', schema: 'public' }, ['name', 'product_id', 'variant_id'], {
    name: 'product_options_unique_name_product_id_variant_id',
    unique: true,
    where: 'variant_id IS NOT NULL'
  });

  pgm.createIndex({ name: 'product_options', schema: 'public' }, ['name', 'product_id'], {
    name: 'product_options_unique_name_product_id',
    unique: true,
    where: 'variant_id IS NULL'
  });
};

exports.down = (pgm) => {
  pgm.dropTable({ name: 'product_options', schema: 'public' });
};
