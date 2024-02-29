/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable(
    { name: 'product_urls', schema: 'public' },
    {
      id: {
        type: 'varchar',
        primaryKey: true
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
      url: {
        type: 'varchar',
        notNull: true
      },
      country: {
        type: 'varchar',
        notNull: true
      },
      price: {
        type: 'double precision',
        default: 0,
        notNull: true
      },
      currency: {
        type: 'varchar',
        notNull: true,
        default: 'cad'
      },
      type: {
        type: 'varchar',
        notNull: true
      },
      affiliate_id: {
        type: 'varchar',
        references: 'affiliates (id)',
        onUpdate: 'cascade',
        onDelete: 'set null'
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

  pgm.createIndex({ name: 'product_urls', schema: 'public' }, ['product_id', 'country', 'variant_id'], {
    name: 'product_urls_unique_product_id_variant_id_country',
    unique: true,
    where: 'variant_id IS NOT NULL'
  });

  pgm.createIndex({ name: 'product_urls', schema: 'public' }, ['product_id', 'country'], {
    name: 'product_urls_unique_product_id_country',
    unique: true,
    where: 'variant_id IS NULL'
  });
};

exports.down = (pgm) => {
  pgm.dropTable({ name: 'product_urls', schema: 'public' });
};
