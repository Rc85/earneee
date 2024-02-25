/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.db.query(
    `INSERT INTO users (email, password, status, is_admin)
    VALUES ('admin@earneee.com', crypt('58nihcregor.', gen_salt('bf', 10)), 'active', true)
    ON CONFLICT (email) DO NOTHING`
  );
};

exports.down = (pgm) => {};
