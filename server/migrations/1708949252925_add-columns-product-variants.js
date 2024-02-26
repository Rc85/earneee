/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns(
    { name: 'product_variants', schema: 'public' },
    {
      about: {
        type: 'varchar'
      },
      details: {
        type: 'varchar'
      }
    }
  );
};

exports.down = (pgm) => {
  pgm.dropColumns({ name: 'product_variants', schema: 'public' }, ['about', 'details']);
};
