/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable(
    { name: 'product_brands', schema: 'public' },
    {
      id: {
        type: 'varchar',
        primaryKey: true
      },
      name: {
        type: 'varchar',
        notNull: true
      },
      url: {
        type: 'varchar'
      },
      logo_url: {
        type: 'varchar'
      },
      logo_path: {
        type: 'varchar'
      },
      owner: {
        type: 'uuid',
        references: 'users (id)',
        onUpdate: 'cascade',
        onDelete: 'set null'
      },
      status: {
        type: 'varchar',
        notNull: true,
        default: 'active'
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

  pgm.createIndex('product_brands', ['name', 'owner'], { where: 'owner is not null', unique: true });
};

exports.down = (pgm) => {
  pgm.dropTable({ name: 'product_brands', schema: 'public' });
};
