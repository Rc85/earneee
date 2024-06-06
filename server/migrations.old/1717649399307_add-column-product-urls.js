/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns(
    { name: 'product_urls', schema: 'public' },
    {
      product_id: {
        type: 'varchar',
        references: 'products (id)',
        onUpdate: 'cascade',
        onDelete: 'cascade'
      }
    }
  );

  pgm.alterColumn({ name: 'product_urls', schema: 'public' }, 'variant_id', { notNull: false });
};

exports.down = (pgm) => {
  pgm.dropColumn({ name: 'product_urls', schema: 'public' }, ['product_id']);
};
