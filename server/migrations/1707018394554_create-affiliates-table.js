/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable(
    { name: 'affiliates', schema: 'public' },
    {
      id: {
        type: 'varchar',
        primaryKey: true
      },
      name: {
        type: 'varchar',
        notNull: true
      },
      logo_url: {
        type: 'varchar'
      },
      logo_path: {
        type: 'varchar'
      },
      manager_url: {
        type: 'varchar'
      },
      description: {
        type: 'varchar'
      },
      commission_rate: {
        type: 'double precision',
        default: 0,
        notNull: true
      },
      rate_type: {
        type: 'varchar',
        notNull: true,
        default: 'fixed'
      },
      status: {
        type: 'varchar',
        notNull: true,
        default: 'active'
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
  pgm.dropTable({ name: 'affiliates', schema: 'public' });
};
