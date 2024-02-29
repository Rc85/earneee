/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable(
    { name: 'product_media', schema: 'public' },
    {
      id: {
        type: 'varchar',
        primaryKey: true
      },
      url: {
        type: 'varchar',
        notNull: true
      },
      path: {
        type: 'varchar'
      },
      type: {
        type: 'varchar',
        notNull: true
      },
      width: {
        type: 'int',
        notNull: true
      },
      height: {
        type: 'int',
        notNull: true
      },
      product_id: {
        type: 'varchar',
        pgmnn: true,
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
      ordinance: {
        type: 'int'
      },
      status: {
        type: 'varchar',
        notNull: true,
        default: 'enabled'
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

  pgm.createIndex({ name: 'product_media', schema: 'public' }, ['url', 'product_id', 'variant_id'], {
    name: 'product_media_unique_product_id_variant_id',
    unique: true,
    where: 'variant_id IS NOT NULL'
  });

  pgm.createIndex({ name: 'product_media', schema: 'public' }, ['url', 'product_id'], {
    name: 'product_media_unique_product_id',
    unique: true,
    where: 'variant_id IS NULL'
  });
};

exports.down = (pgm) => {
  pgm.dropTable({ name: 'product_media', schema: 'public' });
};
