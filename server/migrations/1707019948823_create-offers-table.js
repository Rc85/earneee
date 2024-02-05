/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable(
    { name: 'offers', schema: 'public' },
    {
      id: {
        type: 'varchar',
        primaryKey: true
      },
      name: {
        type: 'varchar',
        notNull: true
      },
      url: {
        type: 'varchar',
        notNull: true
      },
      logo_url: {
        type: 'varchar',
        notNull: true
      },
      logo_path: {
        type: 'varchar',
        notNull: true
      },
      logo_width: {
        type: 'int',
        notNull: true
      },
      logo_height: {
        type: 'int',
        notNull: true
      },
      details: {
        type: 'varchar'
      },
      ordinance: {
        type: 'int'
      },
      start_date: {
        type: 'timestamptz'
      },
      end_date: {
        type: 'timestamptz'
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
  pgm.dropTable({ name: 'offers', schema: 'public' });
};
