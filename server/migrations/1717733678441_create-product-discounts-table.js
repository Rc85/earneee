/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable(
    { name: 'product_discounts', schema: 'public' },
    {
      id: {
        type: 'varchar',
        primaryKey: true
      },
      amount: {
        type: 'double precision',
        notNull: true,
        default: 0
      },
      amount_type: {
        type: 'varchar',
        notNull: true,
        default: 'fixed'
      },
      product_url_id: {
        type: 'varchar',
        notNull: true,
        references: 'product_urls (id)',
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      status: {
        type: 'varchar',
        notNull: true,
        default: 'active'
      },
      starts_at: {
        type: 'timestamptz'
      },
      ends_at: {
        type: 'timestamptz'
      },
      limited_time_only: {
        type: 'boolean',
        default: false,
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
    }
  );
};

exports.down = (pgm) => {
  pgm.dropTable({ name: 'product_discounts', schema: 'public' });
};
