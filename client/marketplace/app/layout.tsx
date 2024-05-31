'use client';

import '../index.css';
import { Footer, ThemeRegistry, TopBar } from '../components';
import { Box, Container, LinearProgress, Typography } from '@mui/material';
import { Suspense, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';
import { store } from '../../_shared/redux/store';
import axios from 'axios';
import { brandName } from '../../_shared/constants';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StatusesInterface } from '../../../_shared/types';
import { Loading } from '../../_shared/components';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_URL;

const RootLayout = ({ children }: { children: React.ReactNode }) => {
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

  return (
    <html lang='en'>
      <head>
        <title>{brandName}</title>

        <script dangerouslySetInnerHTML={{ __html: `<!-- 8D38E63E-BD75-4651-AAE2-F2A241D269D2 -->` }} />

        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Open+Sans:wght@300;400;500;600;700;800&display=swap'
          rel='stylesheet'
        />
      </head>

      <body>
        {status === 'Loading' ? (
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
        )}
      </body>
    </html>
  );
};

export default RootLayout;
