/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns(
    { name: 'product_media', schema: 'public' },
    {
      sizing: {
        type: 'varchar',
        notNull: true,
        default: 'contain'
      },
      use_as_thumbnail: {
        type: 'boolean',
        default: false,
        notNull: true
      }
    }
  );
};

exports.down = (pgm) => {
  pgm.dropColumn({ name: 'product_media', schema: 'public' }, ['sizing', 'use_as_thumbnail']);
};
