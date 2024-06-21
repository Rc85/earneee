/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable(
    { name: 'password_resets', schema: 'public' },
    {
      id: {
        type: 'int',
        primaryKey: true,
        sequenceGenerated: {
          precedence: 'by default'
        }
      },
      email: {
        type: 'varchar',
        notNull: true,
        references: 'users (email)',
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      token: {
        type: 'varchar',
        notNull: true,
        unique: true
      },
      expire_at: {
        type: 'timestamptz',
        notNull: true,
        default: pgm.func(`now() + interval '10 minutes'`)
      },
      created_at: {
        type: 'timestamptz',
        notNull: true,
        default: pgm.func('now()')
      },
      updated_at: {
        type: 'timestamptz'
      }
    }
  );
};

exports.down = (pgm) => {
  pgm.dropTable({ name: 'password_resets', schema: 'public' });
};
