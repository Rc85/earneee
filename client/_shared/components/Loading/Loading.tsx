import { Box, CircularProgress } from '@mui/material';

const Loading = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        flexGrow: 1
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Loading;
