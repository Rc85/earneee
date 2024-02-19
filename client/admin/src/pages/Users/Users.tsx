import { List } from '@mui/material';
import { retrieveUsers } from '../../../../_shared/api';
import { Section } from '../../../../_shared/components';
import UserRow from './UserRow';

const Users = () => {
  const { data } = retrieveUsers();
  const { users } = data || {};

  return (
    <Section title='Users' titleVariant='h3' position='center' sx={{ p: 2 }}>
      {users && users.length > 0 ? (
        <List disablePadding>
          {users?.map((user) => (
            <UserRow key={user.id} user={user} />
          ))}
        </List>
      ) : null}
    </Section>
  );
};

export default Users;
