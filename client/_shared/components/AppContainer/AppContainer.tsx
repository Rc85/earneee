import { Box } from '@mui/material';

interface Props {
  children: any;
}

const AppContainer = ({ children }: Props) => {
  return <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>{children}</Box>;
};

export default AppContainer;
