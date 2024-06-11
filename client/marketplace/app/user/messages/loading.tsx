import { Box, Skeleton } from '@mui/material';

const loading = () => {
  return (
    <Box sx={{ px: 2, pb: 2, flexGrow: 1 }}>
      <Skeleton width='100%' height={75} />
      <Skeleton width='100%' height={75} />
      <Skeleton width='100%' height={75} />
      <Skeleton width='100%' height={75} />
      <Skeleton width='100%' height={75} />
    </Box>
  );
};

export default loading;
