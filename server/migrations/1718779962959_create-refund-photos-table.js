/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable(
    { name: 'refund_photos', schema: 'public' },
    {
      id: {
        type: 'int',
        primaryKey: true,
        sequenceGenerated: {
          precedence: 'by default'
        }
      },
      url: {
        type: 'varchar',
        notNull: true
      },
      path: {
        type: 'varchar',
        notNull: true
      },
      refund_id: {
        type: 'varchar',
        notNull: true,
        references: 'refunds (id)',
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      created_at: {
        type: 'timestamptz',
        default: pgm.func('now()'),
        notNull: true
      },
      updated_at: {
        type: 'timestamptz'
      }
    },
    {
      constraints: {
        unique: ['url', 'refund_id']
      }
    }
  );
};

exports.down = (pgm) => {
  pgm.dropTable({ name: 'refund_photos', schema: 'public' });
};
