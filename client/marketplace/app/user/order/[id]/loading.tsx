import { Box, Skeleton } from '@mui/material';

const Loading = () => {
  return (
    <Box>
      <Skeleton width='35%' height={35} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Skeleton width='50%' height={25} />
        <Skeleton width={100} height={25} />
      </Box>

      <Skeleton width='100%' height={75} />
      <Skeleton width='100%' height={125} />
      <Skeleton width='100%' height={125} />
      <Skeleton width='100%' height={125} />
    </Box>
  );
};

export default Loading;
