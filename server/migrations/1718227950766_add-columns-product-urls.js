/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns(
    { name: 'product_urls', schema: 'public' },
    {
      shipping_time: {
        type: 'varchar'
      },
      refund_time: {
        type: 'varchar'
      }
    }
  );
};

exports.down = (pgm) => {
  pgm.dropColumn({ name: 'product_urls', schema: 'public' }, ['shipping_time', 'refund_time']);
};
