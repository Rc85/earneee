'use client';

import { Container, Typography } from '@mui/material';
import Link from 'next/link';

const PrivacyPolicy = () => {
  return (
    <Container maxWidth='xl' disableGutters sx={{ py: 2 }}>
      <Typography variant='h3'>Privacy Policy</Typography>

      <Typography>
        This Privacy Policy explains how we collect, use, and disclose your personal data when you visit our
        website and interact with the affiliate product links provided. We are committed to protecting your
        privacy and handling your personal data with care and respect.
      </Typography>

      <Typography variant='h6' sx={{ mt: 3 }}>
        Information We Collect
      </Typography>

      <Typography>
        When you visit our website, we may collect certain information about your device and browsing activity
        using cookies and similar tracking technologies. This information may include your IP address, browser
        type, operating system, referring URLs, and pages visited on our website.
      </Typography>

      <Typography>
        When you create an account, your email, password, and country will be required. Your password and all
        other sensitive data will be encrypted and stored. We may also collect other information such as your
        address for shipping and payment information if you decide to purchase anything from our website.
      </Typography>

      <Typography variant='h6' sx={{ mt: 3 }}>
        Affiliate Product Links
      </Typography>

      <Typography>
        Our website may contain affiliate product links, which means that if you click on an affiliate link
        and make a purchase, we may earn a commission. These affiliate links are provided for your convenience
        and to help us maintain our website.
      </Typography>

      <Typography variant='h6' sx={{ mt: 3 }}>
        How We Use Your Information
      </Typography>

      <Typography>
        We use the information we collect to analyze trends, administer the website, track users' movements
        around the website, and gather demographic information. This helps us improve our website and tailor
        it to better meet your needs and preferences.
      </Typography>

      <Typography variant='h6' sx={{ mt: 3 }}>
        Disclosure of Your Information
      </Typography>

      <Typography>
        We may disclose your personal data to third-party service providers who assist us in operating our
        website, conducting our business, or serving you. These third parties are required to use your
        personal data only as necessary to provide the services they offer.
      </Typography>

      <Typography variant='h6' sx={{ mt: 3 }}>
        Your Rights
      </Typography>

      <Typography>
        Under the GDPR, you have certain rights regarding your personal data, including the right to access,
        correct, or delete your personal data. If you would like to exercise any of these rights, please
        contact us using the contact information provided below.
      </Typography>

      <Typography variant='h6' sx={{ mt: 3 }}>
        Changes to This Privacy Policy
      </Typography>

      <Typography>
        We reserve the right to update or change our Privacy Policy at any time. Any changes we make will be
        posted on this page, so please check back periodically for updates.
      </Typography>

      <Typography variant='h6' sx={{ mt: 3 }}>
        Contact Us
      </Typography>

      <Typography>
        If you have any questions or concerns about our Privacy Policy or our use of your personal data,
        please <Link href='/contact'>contact us</Link>.
      </Typography>
    </Container>
  );
};

export default PrivacyPolicy;
