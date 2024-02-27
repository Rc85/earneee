/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns(
    { name: 'product_urls', schema: 'public' },
    {
      price: {
        type: 'double precision',
        default: 0,
        notNull: true
      },
      currency: {
        type: 'varchar',
        notNull: true,
        default: 'cad'
      }
    }
  );
};

exports.down = (pgm) => {
  pgm.dropColumns({ name: 'product_urls', schema: 'public' }, ['price', 'currency']);
};
