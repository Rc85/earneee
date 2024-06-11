import { Container, Skeleton } from '@mui/material';

const Loading = () => {
  return (
    <Container maxWidth='sm' sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <Skeleton width={400} height={100} />

      <Skeleton width={100} height={100} sx={{ transform: 'none', my: 3 }} />

      <Skeleton width='100%' height={35} />
    </Container>
  );
};

export default Loading;
