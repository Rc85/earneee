import { Box, Container, Paper, Skeleton } from '@mui/material';

const Loading = () => {
  return (
    <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center' }}>
      <Container maxWidth='sm'>
        <Paper variant='outlined' sx={{ p: 2 }}>
          <Skeleton width='75%' height={100} />

          <Skeleton width='100%' height={50} />

          <Skeleton width='100%' height={50} />

          <Skeleton width='100%' height={50} />

          <Skeleton width='100%' height={50} />

          <Skeleton width='90%' height={25} />

          <Skeleton width='100%' height={75} />
        </Paper>
      </Container>
    </Box>
  );
};
export default Loading;
