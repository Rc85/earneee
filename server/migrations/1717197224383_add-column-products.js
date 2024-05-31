/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns(
    { name: 'products', schema: 'public' },
    {
      type: {
        type: 'varchar',
        notNull: true,
        default: 'affiliate'
      }
    }
  );
};

exports.down = (pgm) => {
  pgm.dropColumn({ name: 'products', schema: 'public' }, ['type']);
};
