/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.dropColumn({ name: 'products', schema: 'public' }, ['affiliate_id']);

  pgm.addColumns(
    { name: 'product_urls', schema: 'public' },
    {
      affiliate_id: {
        type: 'varchar',
        references: 'affiliates (id)',
        onUpdate: 'cascade',
        onDelete: 'set null'
      }
    }
  );
};

exports.down = (pgm) => {
  pgm.addColumns(
    { name: 'products', schema: 'public' },
    {
      affiliate_id: {
        type: 'varchar',
        references: 'affiliates (id)',
        onUpdate: 'cascade',
        onDelete: 'set null'
      }
    }
  );

  pgm.dropColumn({ name: 'product_urls', schema: 'public' }, ['affiliate_id']);
};
