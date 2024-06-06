/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable(
    { name: 'product_options', schema: 'public' },
    {
      id: {
        type: 'varchar',
        primaryKey: true
      },
      name: {
        type: 'varchar',
        notNull: true
      },
      variant_id: {
        type: 'varchar',
        notNull: true,
        references: 'product_variants (id)',
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      required: {
        type: 'boolean',
        notNull: true,
        default: false
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
    { constraints: { unique: ['name', 'variant_id'] } }
  );
};

exports.down = (pgm) => {
  pgm.dropTable({ name: 'product_options', schema: 'public' });
};
