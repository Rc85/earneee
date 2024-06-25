/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns(
    { name: 'refunds', schema: 'public' },
    {
      number: {
        type: 'int',
        notNull: true,
        sequenceGenerated: {
          precedence: 'by default'
        }
      }
    }
  );
};

exports.down = (pgm) => {
  pgm.dropColumn({ name: 'refunds', schema: 'public' }, ['number']);
};
