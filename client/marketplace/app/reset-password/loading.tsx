import { Container, Paper, Skeleton } from '@mui/material';

const loading = () => {
  return (
    <Container maxWidth='sm'>
      <Paper variant='outlined' sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <Skeleton width='60%' height={100} />

        <Skeleton width='100%' height={50} />

        <Skeleton width='100%' height={75} />
      </Paper>
    </Container>
  );
};

export default loading;
