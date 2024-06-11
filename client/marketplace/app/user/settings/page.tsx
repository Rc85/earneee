'use client';

import { Box, TextField, Typography } from '@mui/material';

const page = () => {
  return (
    <Box sx={{ px: 2, pb: 2, flexGrow: 1 }}>
      <Typography variant='h6'>Change Password</Typography>

      <TextField label='Current Password' type='password' />

      <TextField label='New Password' type='password' />

      <TextField label='Confirm Password' type='password' />
    </Box>
  );
};

export default page;
