/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable(
    { name: 'refunds', schema: 'public' },
    {
      id: {
        type: 'varchar',
        primaryKey: true
      },
      order_item_id: {
        type: 'varchar',
        notNull: true,
        references: 'order_items (id)',
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      amount: {
        type: 'double precision',
        notNull: true,
        default: 0
      },
      quantity: {
        type: 'int',
        notNull: true,
        default: 1
      },
      reason: {
        type: 'varchar'
      },
      tracking_number: {
        type: 'varchar'
      },
      shipping_provider: {
        type: 'varchar'
      },
      refund_id: {
        type: 'varchar'
      },
      references: {
        type: 'varchar'
      },
      failure_reason: {
        type: 'varchar'
      },
      status: {
        type: 'varchar',
        notNull: true,
        default: 'pending'
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

  pgm.addColumns(
    { name: 'order_items', schema: 'public' },
    {
      delivered_at: {
        type: 'timestamptz'
      }
    }
  );
};

exports.down = (pgm) => {
  pgm.dropTable({ name: 'refunds', schema: 'public' });
  pgm.dropColumn({ name: 'order_items', schema: 'public' }, ['delivered_at']);
};
