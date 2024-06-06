/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('user_bans', {
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
    banned_until: {
      type: 'timestamptz',
      notNull: true
    },
    reason: {
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
  });
};

exports.down = (pgm) => {
  pgm.dropTable('user_bans');
};
