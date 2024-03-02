/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable(
    { name: 'specifications', schema: 'public' },
    {
      id: {
        type: 'varchar',
        primaryKey: true
      },
      name: {
        type: 'varchar',
        notNull: true
      },
      value: {
        type: 'varchar',
        notNull: true
      },
      ordinance: {
        type: 'int'
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
        unique: ['name', 'value']
      }
    }
  );
};

exports.down = (pgm) => {
  pgm.dropTable({ name: 'specifications', schema: 'public' });
};
