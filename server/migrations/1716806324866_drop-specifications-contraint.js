/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.dropConstraint({ schema: 'public', name: 'specifications' }, 'specifications_uniq_name_value', {
    ifExists: true
  });
};

exports.down = (pgm) => {};
