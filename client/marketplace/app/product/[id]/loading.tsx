import { Container, Box, Skeleton } from '@mui/material';

const Loading = () => {
  return (
    <Container maxWidth='xl' disableGutters>
      <Box sx={{ display: 'flex' }}>
        <Skeleton width='10%' height={35} sx={{ mr: 2 }} />

        <Skeleton width='10%' height={35} sx={{ mr: 2 }} />

        <Skeleton width='10%' height={35} />
      </Box>

      <Skeleton width='50%' height={100} />

      <Skeleton width='55%' height={35} />

      <Box sx={{ display: 'flex' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Skeleton width='100%' height={500} sx={{ transform: 'none', my: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Skeleton width={100} height={100} sx={{ mr: 1 }} />

            <Skeleton width={100} height={100} sx={{ mr: 1 }} />

            <Skeleton width={100} height={100} />
          </Box>

          <Skeleton width='75%' height={100} />

          <Skeleton width='100%' height={400} sx={{ transform: 'none', mt: 3 }} />
        </Box>

        <Box sx={{ width: '35%', minWidth: '400px', maxWidth: '400px', ml: 2 }}>
          <Skeleton width='100%' height={125} />

          <Skeleton width='100%' height={125} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Skeleton width='30%' height={50} />

            <Skeleton width='30%' height={50} />
          </Box>

          <Skeleton width='40%' height={35} />

          <Skeleton width='55%' height={30} />

          <Skeleton width='55%' height={30} />

          <Skeleton width='55%' height={30} />

          <Skeleton width='55%' height={30} />

          <Skeleton width='100%' height={400} />
        </Box>
      </Box>
    </Container>
  );
};

export default Loading;
