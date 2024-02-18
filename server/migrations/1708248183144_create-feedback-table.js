/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('feedback', {
    id: {
      type: 'int',
      primaryKey: true,
      sequenceGenerated: {
        precedence: 'by default'
      }
    },
    name: {
      type: 'varchar',
      notNull: true
    },
    email: {
      type: 'varchar',
      notNull: true
    },
    message: {
      type: 'varchar',
      notNull: true
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('now()')
    },
    updated_at: {
      type: 'timestamptz'
    }
  });
};

exports.down = (pgm) => {
  pgm.dropTable('feedback');
};
