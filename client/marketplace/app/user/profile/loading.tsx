import { Skeleton, Box } from '@mui/material';

const Loading = () => {
  return (
    <Box sx={{ flexGrow: 1, px: 2, pb: 2 }}>
      <Skeleton width={100} height={35} />

      <Skeleton width='100%' height={50} />
      <Skeleton width='100%' height={50} />

      <Skeleton width={100} height={35} />

      <Skeleton width='100%' height={50} />
      <Skeleton width='100%' height={50} />
      <Skeleton width='100%' height={50} />
      <Skeleton width='100%' height={50} />
      <Skeleton width='100%' height={50} />
      <Skeleton width='100%' height={50} />
    </Box>
  );
};

export default Loading;
