/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns(
    { name: 'products', schema: 'public' },
    {
      published: {
        type: 'boolean',
        default: false,
        notNull: true
      }
    }
  );
};

exports.down = (pgm) => {
  pgm.dropColumn({ name: 'products', schema: 'public' }, ['published']);
};
