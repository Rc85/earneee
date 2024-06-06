/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable(
    { name: 'product_discounts', schema: 'public' },
    {
      id: {
        type: 'int',
        primaryKey: true,
        sequenceGenerated: {
          precedence: 'by default'
        }
      },
      product_url_id: {
        type: 'varchar',
        notNull: true,
        references: 'product_urls (id)',
        onUpdate: 'cascade',
        onDelete: 'cascade'
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
      expire_at: {
        type: 'timestamptz'
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
