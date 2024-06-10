import { Box, Container, Skeleton } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

const Loading = () => {
  return (
    <Container maxWidth='xl' sx={{ display: 'flex', flexGrow: 1 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden', mr: 2 }}>
        <Skeleton variant='rectangular' width='100%' height={500} />

        <Grid2 container spacing={1} sx={{ mt: 3 }}>
          <Grid2 xs={12} sm={4}>
            <Skeleton height={300} sx={{ transform: 'none' }} />
          </Grid2>
          <Grid2 xs={12} sm={4}>
            <Skeleton height={300} sx={{ transform: 'none' }} />
          </Grid2>
          <Grid2 xs={12} sm={4}>
            <Skeleton height={300} sx={{ transform: 'none' }} />
          </Grid2>
          <Grid2 xs={12} sm={4}>
            <Skeleton height={300} sx={{ transform: 'none' }} />
          </Grid2>
          <Grid2 xs={12} sm={4}>
            <Skeleton height={300} sx={{ transform: 'none' }} />
          </Grid2>
          <Grid2 xs={12} sm={4}>
            <Skeleton height={300} sx={{ transform: 'none' }} />
          </Grid2>
        </Grid2>

        <Skeleton variant='rectangular' width='100%' height={300} sx={{ mt: 5 }} />
      </Box>

      <Box sx={{ width: '30%', minWidth: '250px', maxWidth: '350px' }}>
        <Skeleton variant='rectangular' width='100%' height={400} />
      </Box>
    </Container>
  );
};

export default Loading;
