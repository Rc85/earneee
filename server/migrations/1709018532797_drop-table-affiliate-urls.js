/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.dropTable({ name: 'affiliate_urls', schema: 'public' });

  pgm.addColumns(
    { name: 'affiliates', schema: 'public' },
    {
      url: {
        type: 'varchar'
      }
    }
  );
};

exports.down = (pgm) => {
  pgm.createTable(
    { name: 'affiliate_urls', schema: 'public' },
    {
      id: {
        type: 'varchar',
        primaryKey: true
      },
      affiliate_id: {
        type: 'varchar',
        notNull: true,
        references: 'affiliates (id)',
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      url: {
        type: 'varchar',
        notNull: true
      },
      country: {
        type: 'varchar',
        notNull: true
      },
      created_at: {
        type: 'timestamptz',
        default: pgm.func('now()'),
        notNull: true
      },
      updated_at: {
        type: 'timestamptz'
      }
    },
    {
      constraints: {
        unique: ['affiliate_id', 'country']
      }
    }
  );

  pgm.dropColumn({ name: 'affiliates', schema: 'public' }, ['url']);
};
