import '../index.css';
import { brandName } from '../../_shared/constants/brand-name';
import type { Viewport } from 'next';
import Main from './main';
import { Container, Typography } from '@mui/material';
import { StatusesInterface } from '../../../_shared/types';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 0.1,
  maximumScale: 1
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const status = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/v1/statuses`, {
    next: { revalidate: 5 }
  });
  const statusData = await status.json();
  const statuses: StatusesInterface[] = statusData.statuses;
  const online = statuses?.find((status) => status.name === 'marketplace')?.online;

  return (
    <html lang='en'>
      <head>
        <title>{brandName}</title>

        <meta
          name='description'
          content='Find trendy products as well as deals and discounts from all over the web'
        />
        <meta property='og:title' content='Earneee' />
        <meta
          property='og:description'
          content='Find trendy products as well as deals and discounts from all over the web'
        />
        <meta
          property='og:image'
          content='https://earneee.sfo3.cdn.digitaloceanspaces.com/images/earneee_logo.png'
        />

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
        {!Boolean(online) ? (
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
          <Main>{children}</Main>
        )}
      </body>
    </html>
  );
};

export default RootLayout;
