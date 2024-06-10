import { Paper, Skeleton, Box, Container } from '@mui/material';

const Loading = () => {
  return (
    <Container maxWidth='sm'>
      <Paper variant='outlined' sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <Skeleton width='50%' height={100} />

        <Skeleton width='100%' height={25} />

        <Skeleton width='100%' height={50} />

        <Skeleton width='100%' height={50} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton width='25%' height={50} />

          <Skeleton width='25%' height={50} />
        </Box>

        <Skeleton width='100%' height={75} />

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Skeleton width='50%' height={25} />
        </Box>
      </Paper>
    </Container>
  );
};

export default Loading;
