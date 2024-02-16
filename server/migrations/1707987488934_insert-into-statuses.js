/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.db.query(
    `INSERT INTO statuses (name) VALUES ('login'), ('registration'), ('email_subscription'), ('marketplace')`
  );
};

exports.down = (pgm) => {};
