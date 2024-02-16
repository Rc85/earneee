import { Container, Paper, Typography, useTheme } from '@mui/material';
import Login from '../../pages/Login/Login';
import { Icon } from '@mdi/react';
import { mdiShieldOff } from '@mdi/js';
import { authenticate } from '../../../../_shared/api';
import { Loading } from '../../../../_shared/components';

interface Props {
  children: any;
}

const AuthenticatedRoute = ({ children }: Props) => {
  const { isLoading, data } = authenticate('admin');
  const { user } = data || {};
  const theme = useTheme();

  if (isLoading) {
    return <Loading />;
  } else if (user) {
    if (!user.isAdmin) {
      return (
        <Container
          disableGutters
          maxWidth='md'
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}
        >
          <Paper
            variant='outlined'
            sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1 }}
          >
            <Icon path={mdiShieldOff} size={5} color={theme.palette.error.main} />

            <Typography variant='h3' sx={{ mb: 3 }}>
              Unauthorized
            </Typography>

            <Typography>You do not have permission to access this page.</Typography>
          </Paper>
        </Container>
      );
    }

    return children;
  }

  return <Login />;
};

export default AuthenticatedRoute;
