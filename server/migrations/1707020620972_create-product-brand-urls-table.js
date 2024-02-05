/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable(
    { name: 'product_brand_urls', schema: 'public' },
    {
      id: {
        type: 'varchar',
        primaryKey: true
      },
      brand_id: {
        type: 'varchar',
        notNull: true,
        references: 'product_brands (id)',
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
      created_at: {
        type: 'timestamptz',
        default: pgm.func('now()'),
        notNull: true
      },
      updated_at: {
        type: 'timestamptz'
      }
    },
    {
      constraints: {
        unique: ['brand_id', 'country']
      }
    }
  );
};

exports.down = (pgm) => {
  pgm.dropTable({ name: 'product_brand_urls', schema: 'public' });
};
