/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable(
    { name: 'product_variants', schema: 'public' },
    {
      id: {
        type: 'varchar',
        primaryKey: true
      },
      name: {
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
        default: 'cdn',
        notNull: true
      },
      description: {
        type: 'varchar'
      },
      details: {
        type: 'varchar'
      },
      about: {
        type: 'varchar'
      },
      excerpt: {
        type: 'varchar'
      },
      featured: {
        type: 'boolean',
        default: false,
        notNull: true
      },
      product_id: {
        type: 'varchar',
        notNull: true,
        references: 'products (id)',
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      ordinance: {
        type: 'int',
        notNull: true,
        default: 0
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
    },
    {
      constraints: {
        unique: ['name', 'product_id']
      }
    }
  );
};

exports.down = (pgm) => {
  pgm.dropTable({ name: 'product_variants', schema: 'public' });
};
