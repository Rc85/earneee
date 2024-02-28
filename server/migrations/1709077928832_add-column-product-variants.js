/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns(
    { name: 'product_variants', schema: 'public' },
    {
      excerpt: {
        type: 'varchar'
      }
    }
  );
};

exports.down = (pgm) => {
  pgm.dropColumns({ name: 'product_variants', schema: 'public' }, ['excerpt']);
};
