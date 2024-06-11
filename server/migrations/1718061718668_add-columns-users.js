/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns(
    { name: 'users', schema: 'public' },
    {
      confirmation_key: {
        type: 'uuid',
        default: pgm.func('uuid_generate_v1()'),
        notNull: true
      }
    }
  );
};

exports.down = (pgm) => {
  pgm.dropColumn({ name: 'users', schema: 'public' }, ['confirmation_key']);
};
