/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable(
    { name: 'products', schema: 'public' },
    {
      id: {
        type: 'varchar',
        primaryKey: true
      },
      name: {
        type: 'varchar',
        notNull: true,
        unique: true
      },
      price: {
        type: 'double precision'
      },
      currency: {
        type: 'varchar'
      },
      category_id: {
        type: 'int',
        notNull: true,
        references: 'categories (id)',
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      brand_id: {
        type: 'varchar',
        references: 'product_brands (id)',
        onUpdate: 'cascade',
        onDelete: 'set null'
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
};

exports.down = (pgm) => {
  pgm.dropTable({ name: 'products', schema: 'public' });
};
