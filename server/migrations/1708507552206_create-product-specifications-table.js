/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable(
    'product_specifications',
    {
      id: {
        type: 'varchar',
        primaryKey: true
      },
      specification_id: {
        type: 'varchar',
        primaryKey: true,
        references: 'specifications (id)',
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      product_id: {
        type: 'varchar',
        notNull: true,
        references: 'products (id)',
        onUpdate: 'cascade',
        onDelete: 'cascade'
      }
    },
    { constraints: { unique: ['specification_id', 'product_id'] } }
  );
};

exports.down = (pgm) => {
  pgm.dropTable('product_specifications');
};
