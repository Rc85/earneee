/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable(
    { name: 'categories', schema: 'public' },
    {
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
      parent_id: {
        type: 'int',
        references: 'categories (id)',
        onUpdate: 'cascade',
        onDelete: 'set null'
      },
      type: {
        type: 'varchar'
      },
      ordinance: {
        type: 'int'
      },
      status: {
        type: 'varchar',
        notNull: true,
        default: 'available'
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
  pgm.dropTable({ name: 'categories', schema: 'public' });
};
