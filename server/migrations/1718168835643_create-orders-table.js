/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable(
    { name: 'orders', schema: 'public' },
    {
      id: {
        type: 'varchar',
        primaryKey: true
      },
      user_id: {
        type: 'uuid',
        notNull: true,
        references: 'users (id)',
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      status: {
        type: 'varchar',
        notNull: true,
        default: 'draft'
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

  pgm.createTable(
    { name: 'order_items', schema: 'public' },
    {
      id: {
        type: 'varchar',
        primaryKey: true
      },
      name: {
        type: 'varchar',
        notNull: true
      },
      order_id: {
        type: 'varchar',
        notNull: true,
        references: 'orders (id)',
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      product: {
        type: 'jsonb',
        notNull: true
      },
      price: {
        type: 'double precision',
        notNull: true,
        default: 0
      },
      quantity: {
        type: 'int',
        notNull: true,
        default: 1
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
  pgm.dropTable({ name: 'order_items', schema: 'public' });
  pgm.dropTable({ name: 'orders', schema: 'public' });
};
