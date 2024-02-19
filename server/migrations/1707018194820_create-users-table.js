/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable(
    { name: 'users', schema: 'public' },
    {
      id: {
        type: 'uuid',
        primaryKey: true,
        default: pgm.func('uuid_generate_v1()')
      },
      email: {
        type: 'varchar',
        notNull: true,
        unique: true
      },
      password: {
        type: 'varchar',
        notNull: true
      },
      status: {
        type: 'varchar',
        notNull: true,
        default: 'inactive'
      },
      is_admin: {
        type: 'boolean',
        notNull: true,
        default: false
      },
      banned_until: {
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
  pgm.dropTable({ name: 'users', schema: 'public' });
};
