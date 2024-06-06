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
        notNull: true,
        references: 'products (id)',
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
    },
    { constraints: { unique: ['url', 'product_id'] } }
  );
};

exports.down = (pgm) => {
  pgm.dropTable({ name: 'product_media', schema: 'public' });
};
