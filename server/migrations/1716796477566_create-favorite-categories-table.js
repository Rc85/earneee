/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('favorite_categories', {
    id: {
      type: 'int',
      primaryKey: true,
      sequenceGenerated: {
        precedence: 'by default'
      }
    },
    user_id: {
      type: 'uuid',
      notNull: true,
      references: 'users (id)',
      onUpdate: 'cascade',
      onDelete: 'cascade'
    },
    category_id: {
      type: 'int',
      notNull: true,
      references: 'categories (id)',
      onUpdate: 'cascade',
      onDelete: 'cascade'
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
  pgm.dropTable('favorite_categories');
};
