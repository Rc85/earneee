/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('subscribers', {
    id: {
      type: 'uuid',
      default: pgm.func('uuid_generate_v1()'),
      primaryKey: true
    },
    email: {
      type: 'varchar',
      notNull: true,
      unique: true
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
  pgm.dropTable('subscribers');
};
