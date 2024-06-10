'use client';

import { Footer, ThemeRegistry, TopBar } from '../components';
import { Container } from '@mui/material';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';
import { store } from '../../_shared/redux/store';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import axios from 'axios';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_URL;

const Main = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false } } })
  );

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider>
          <ThemeRegistry>
            <TopBar />

            <Container maxWidth='xl' sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              {children}
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
