/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable(
    { name: 'user_messages', schema: 'public' },
    {
      id: {
        type: 'uuid',
        default: pgm.func('uuid_generate_v1()'),
        primaryKey: true
      },
      user_id: {
        type: 'uuid',
        notNull: true,
        references: 'users (id)',
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      from: {
        type: 'uuid',
        references: 'users (id)',
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      message: {
        type: 'varchar',
        notNull: true
      },
      type: {
        type: 'varchar',
        notNull: true,
        default: 'p2p'
      },
      status: {
        type: 'varchar',
        notNull: true,
        default: 'new'
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
  pgm.dropTable({ name: 'user_messages', schema: 'public' });
};
