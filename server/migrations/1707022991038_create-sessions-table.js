/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable(
    { name: 'sessions', schema: 'public' },
    {
      id: {
        type: 'varchar',
        primaryKey: true
      },
      user_id: {
        type: 'uuid',
        notNull: true,
        references: 'users (id)',
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      ip_address: {
        type: 'varchar',
        notNull: true
      },
      application: {
        type: 'varchar',
        notNull: true
      },
      status: {
        type: 'varchar',
        notNull: true
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
  pgm.dropTable({ name: 'sessions', schema: 'public' });
};
