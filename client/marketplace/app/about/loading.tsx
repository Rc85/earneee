import { Container, Skeleton } from '@mui/material';

const loading = () => {
  return (
    <Container maxWidth='md'>
      <Skeleton width='50%' height={100} />

      <Skeleton width='100%' height={500} sx={{ transform: 'none', mt: 3 }} />
    </Container>
  );
};

export default loading;
