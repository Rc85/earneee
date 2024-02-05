'use client';
import { Box, Typography } from '@mui/material';

const NotFound = () => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Typography variant='h3'>404</Typography>

      <Typography>The page you're trying to access cannot be found.</Typography>
    </Box>
  );
};

export default NotFound;
