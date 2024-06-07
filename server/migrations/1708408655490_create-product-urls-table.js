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
        notNull: true
      },
      url: {
        type: 'varchar'
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
    },
    { constraints: { unique: ['product_id', 'country'] } }
  );
};

exports.down = (pgm) => {
  pgm.dropTable({ name: 'product_urls', schema: 'public' });
};
