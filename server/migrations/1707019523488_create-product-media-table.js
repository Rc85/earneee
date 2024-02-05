/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable(
    { name: 'product_media', schema: 'public' },
    {
      id: {
        type: 'varchar',
        primaryKey: true
      },
      url: {
        type: 'varchar',
        notNull: true
      },
      path: {
        type: 'varchar'
      },
      type: {
        type: 'varchar',
        notNull: true
      },
      width: {
        type: 'int',
        notNull: true
      },
      height: {
        type: 'int',
        notNull: true
      },
      variant_id: {
        type: 'varchar',
        notNull: true,
        references: 'product_variants (id)',
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      ordinance: {
        type: 'int'
      },
      status: {
        type: 'varchar',
        notNull: true,
        default: 'enable'
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
        unique: ['url', 'path', 'variant_id']
      }
    }
  );
};

exports.down = (pgm) => {
  pgm.dropTable({ name: 'product_media', schema: 'public' });
};
