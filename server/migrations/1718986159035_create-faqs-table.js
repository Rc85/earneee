/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable(
    { name: 'faqs', schema: 'public' },
    {
      id: {
        type: 'varchar',
        primaryKey: true
      },
      question: {
        type: 'varchar',
        notNull: true,
        unique: true
      },
      answer: {
        type: 'varchar',
        notNull: true
      },
      category: {
        type: 'varchar'
      },
      status: {
        type: 'varchar',
        notNull: true,
        default: 'show'
      },
      created_at: {
        type: 'timestamptz',
        default: pgm.func('now()'),
        notNull: true
      },
      updated_at: {
        type: 'timestamptz'
      }
    }
  );
};

exports.down = (pgm) => {
  pgm.dropTable({ name: 'faqs', schema: 'public' });
};
