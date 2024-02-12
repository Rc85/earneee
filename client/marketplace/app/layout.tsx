'use client';

import '../index.css';
import { Footer, ThemeRegistry, TopBar } from '../components';
import { Box, Container, LinearProgress } from '@mui/material';
import { Suspense, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';
import { store } from '../../_shared/redux/store';
import axios from 'axios';
import { brandName } from '../../_shared/constants';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_URL;

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false } } })
  );

  return (
    <html lang='en'>
      <head>
        <title>{brandName}</title>

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
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <SnackbarProvider>
              <ThemeRegistry>
                <TopBar />

                <Container maxWidth='xl' sx={{ display: 'flex', flexGrow: 1 }}>
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
      </body>
    </html>
  );
};

export default RootLayout;
