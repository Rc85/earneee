'use client';

import { Footer, ThemeRegistry, TopBar } from '../components';
import { Box, Container, LinearProgress, Typography } from '@mui/material';
import { Suspense, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';
import { store } from '../../_shared/redux/store';
import { brandName } from '../../_shared/constants';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StatusesInterface } from '../../../_shared/types';
import { Loading } from '../../_shared/components';
import axios from 'axios';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_URL;

const Main = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false } } })
  );
  const [status, setStatus] = useState('Loading');

  useEffect(() => {
    (async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/v1/statuses`, {
        next: { revalidate: 5 }
      });
      const data = await response.json();
      const statuses: StatusesInterface[] = data.statuses;
      const marketplaceStatus = statuses.find((status) => status.name === 'marketplace');

      if (!marketplaceStatus?.online) {
        setStatus('Offline');
      } else {
        setStatus('');
      }
    })();
  }, []);

  return status === 'Loading' ? (
    <Loading />
  ) : status === 'Offline' ? (
    <Container
      maxWidth='md'
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Typography variant='h3' sx={{ fontWeight: 900, mb: 5, textAlign: 'center' }}>
        Offline
      </Typography>

      <Typography>
        {brandName} is running some maintenance and will be back online as soon as possible.
      </Typography>
    </Container>
  ) : (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider>
          <ThemeRegistry>
            <TopBar />

            <Container maxWidth='xl' sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <Suspense
                fallback={
                  <Box sx={{ flexGrow: 1 }}>
                    <LinearProgress />
                  </Box>
                }
              >
                {children}
              </Suspense>
            </Container>

            <Footer />
          </ThemeRegistry>
        </SnackbarProvider>

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  );
};

export default Main;
