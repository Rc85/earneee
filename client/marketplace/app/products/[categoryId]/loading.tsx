import { Box, Container, Skeleton } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

const loading = () => {
  return (
    <Container maxWidth='xl' disableGutters>
      <Skeleton width='20%' height={40} />

      <Skeleton width='40%' height={100} />

      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
        <Box sx={{ width: '25%', minWidth: '200px', maxWidth: '300px', flexShrink: 0 }}>
          <Skeleton width='35%' height={50} />

          <Skeleton width='50%' height={25} />
          <Skeleton width='50%' height={25} />
          <Skeleton width='50%' height={25} />
          <Skeleton width='50%' height={25} />
          <Skeleton width='50%' height={25} />

          <Skeleton width='100%' height={50} />
          <Skeleton width='100%' height={50} />
          <Skeleton width='100%' height={50} />
          <Skeleton width='100%' height={50} />
        </Box>

        <Box sx={{ flexGrow: 1, ml: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}>
            <Skeleton width='20%' height={75} />

            <Skeleton width='10%' height={75} sx={{ ml: 1 }} />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Skeleton width='20%' height={50} />
          </Box>

          <Grid2 container spacing={1} sx={{ mt: 3 }}>
            <Grid2 xs={12} sm={6} md={4} xl={3}>
              <Skeleton width='100%' height={300} sx={{ transform: 'none' }} />
            </Grid2>

            <Grid2 xs={12} sm={6} md={4} xl={3}>
              <Skeleton width='100%' height={300} sx={{ transform: 'none' }} />
            </Grid2>

            <Grid2 xs={12} sm={6} md={4} xl={3}>
              <Skeleton width='100%' height={300} sx={{ transform: 'none' }} />
            </Grid2>

            <Grid2 xs={12} sm={6} md={4} xl={3}>
              <Skeleton width='100%' height={300} sx={{ transform: 'none' }} />
            </Grid2>

            <Grid2 xs={12} sm={6} md={4} xl={3}>
              <Skeleton width='100%' height={300} sx={{ transform: 'none' }} />
            </Grid2>

            <Grid2 xs={12} sm={6} md={4} xl={3}>
              <Skeleton width='100%' height={300} sx={{ transform: 'none' }} />
            </Grid2>
          </Grid2>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Skeleton width='20%' height={50} />
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default loading;
