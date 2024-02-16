/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('statuses', {
    id: {
      type: 'int',
      primaryKey: true,
      sequenceGenerated: {
        precedence: 'by default'
      }
    },
    name: {
      type: 'varchar',
      notNull: true,
      unique: true
    },
    online: {
      type: 'boolean',
      notNull: true,
      default: true
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('now()')
    },
    updated_at: {
      type: 'timestamp'
    }
  });
};

exports.down = (pgm) => {
  pgm.dropTable('statuses');
};
