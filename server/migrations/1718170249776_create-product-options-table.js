/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable(
    { name: 'product_options', schema: 'public' },
    {
      id: {
        type: 'varchar',
        primaryKey: true
      },
      name: {
        type: 'varchar',
        notNull: true
      },
      description: {
        type: 'varchar'
      },
      minimum_selections: {
        type: 'int',
        default: 1,
        notNull: true
      },
      maximum_selections: {
        type: 'int'
      },
      required: {
        type: 'boolean',
        notNull: true,
        default: false
      },
      product_id: {
        type: 'varchar',
        notNull: true,
        references: 'products (id)',
        onUpdate: 'cascade',
        onDelete: 'cascade'
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
    },
    {
      constraints: {
        unique: ['product_id', 'name']
      }
    }
  );

  pgm.createTable(
    { name: 'option_selections', schema: 'public' },
    {
      id: {
        type: 'varchar',
        primaryKey: true
      },
      name: {
        type: 'varchar',
        notNull: true
      },
      price: {
        type: 'double precision',
        notNull: true,
        default: 0
      },
      ordinance: {
        type: 'int'
      },
      option_id: {
        type: 'varchar',
        notNull: true,
        references: 'product_options (id)',
        onUpdate: 'cascade',
        onDelete: 'cascade'
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
    },
    {
      constraints: {
        unique: ['name', 'option_id']
      }
    }
  );
};

exports.down = (pgm) => {
  pgm.dropTable({ name: 'option_selections', schema: 'public' });
  pgm.dropTable({ name: 'product_options', schema: 'public' });
};
