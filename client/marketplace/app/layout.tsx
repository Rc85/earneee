import '../index.css';
import { Footer, ThemeRegistry, TopBar } from '../components';
import { Box, Container, LinearProgress } from '@mui/material';
import { Suspense } from 'react';

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Next.js and Supabase Starter Kit',
  description: 'The fastest way to build apps with Next.js and Supabase'
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang='en'>
      <head>
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
      </body>
    </html>
  );
};

export default RootLayout;
