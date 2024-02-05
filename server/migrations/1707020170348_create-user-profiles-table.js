/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable(
    { name: 'user_profiles', schema: 'public' },
    {
      id: {
        type: 'uuid',
        primaryKey: true,
        notNull: true,
        references: 'users (id)',
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      first_name: {
        type: 'varchar'
      },
      last_name: {
        type: 'varchar'
      },
      phone_number: {
        type: 'varchar'
      },
      address: {
        type: 'varchar'
      },
      city: {
        type: 'varchar'
      },
      region: {
        type: 'varchar'
      },
      country: {
        type: 'varchar',
        notNull: true
      },
      postal_code: {
        type: 'varchar'
      },
      logo_url: {
        type: 'varchar'
      },
      logo_path: {
        type: 'varchar'
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
  pgm.dropTable({ name: 'user_profiles', schema: 'public' });
};
