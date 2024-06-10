import { Container, Skeleton } from '@mui/material';

const Loading = () => {
  return (
    <Container maxWidth='xl' disableGutters>
      <Skeleton width='30%' height={100} />

      <Skeleton width='15%' height={25} />

      <Skeleton width='100%' height={125} sx={{ transform: 'none', my: 3 }} />

      <Skeleton width='100%' height={125} sx={{ transform: 'none', my: 3 }} />

      <Skeleton width='100%' height={125} sx={{ transform: 'none' }} />
    </Container>
  );
};

export default Loading;
