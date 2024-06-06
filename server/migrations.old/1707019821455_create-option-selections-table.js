/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable(
    { name: 'option_selections', schema: 'public' },
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
      option_id: {
        type: 'varchar',
        notNull: true,
        references: 'product_options (id)',
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      ordinance: {
        type: 'int'
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
        unique: ['name', 'option_id']
      }
    }
  );
};

exports.down = (pgm) => {
  pgm.dropTable({ name: 'option_selections', schema: 'public' });
};
