import { Container, Skeleton } from '@mui/material';

const Loading = () => {
  return (
    <Container maxWidth='md' disableGutters>
      <Skeleton width='25%' height={100} />

      <Skeleton width='100%' height={75} />
      <Skeleton width='100%' height={75} />
      <Skeleton width='100%' height={75} />
      <Skeleton width='100%' height={75} />
    </Container>
  );
};

export default Loading;
