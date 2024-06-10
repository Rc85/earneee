import { Container, Skeleton } from '@mui/material';

const loading = () => {
  return (
    <Container maxWidth='xl' disableGutters sx={{ py: 2 }}>
      <Skeleton width='50%' height={100} />

      <Skeleton width='100%' height={150} sx={{ transform: 'none', my: 3 }} />

      <Skeleton width='25%' height={50} />

      <Skeleton width='100%' height={150} sx={{ transform: 'none', my: 3 }} />

      <Skeleton width='25%' height={50} />

      <Skeleton width='100%' height={150} sx={{ transform: 'none', mt: 3 }} />
    </Container>
  );
};

export default loading;
