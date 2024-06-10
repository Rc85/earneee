import { Container, Skeleton } from '@mui/material';

const Loading = () => {
  return (
    <Container maxWidth='sm'>
      <Skeleton width='50%' height={100} />

      <Skeleton width='100%' height={50} />

      <Skeleton width='100%' height={50} />

      <Skeleton width='100%' height={300} sx={{ transform: 'none', mt: 3 }} />

      <Skeleton width='100%' height={75} />
    </Container>
  );
};

export default Loading;
