'use client';

import { Container, List, ListItem, Typography } from '@mui/material';
import { brandName } from '../../../_shared/constants';
import Link from 'next/link';

const TermsOfService = () => {
  return (
    <Container maxWidth='xl' disableGutters sx={{ py: 2 }}>
      <Typography variant='h3'>Terms of Service</Typography>

      <Typography>
        These Terms of Service ("Terms") govern your use of {brandName} (the "Website", "us", "we", or "our").
        By accessing or using the Website, you agree to be bound by these Terms. If you disagree with any part
        of the terms, you may not access the Website.
      </Typography>

      <Typography variant='h6' sx={{ mt: 3 }}>
        Use of Website
      </Typography>

      <List disablePadding>
        <ListItem disableGutters>
          Content: The Website provides information and links to various affiliate products. While we strive
          to ensure the accuracy and reliability of the information provided, we make no representations or
          warranties of any kind, express or implied, about the completeness, accuracy, reliability,
          suitability, or availability of the products or services mentioned on the Website.
        </ListItem>

        <ListItem disableGutters>
          Affiliate Links: The Website may contain affiliate links, which means we may earn a commission if
          you click on the link and make a purchase. However, the inclusion of affiliate links does not
          influence our editorial content or product recommendations. We aim to provide honest and unbiased
          information to our users.
        </ListItem>

        <ListItem disableGutters>
          User Conduct: You agree to use the Website only for lawful purposes and in a manner consistent with
          all applicable laws and regulations. You are prohibited from using the Website in any way that could
          damage, disable, overburden, or impair the Website or interfere with any other party's use and
          enjoyment of the Website.
        </ListItem>
      </List>

      <Typography variant='h6' sx={{ mt: 3 }}>
        Limitation of Liability
      </Typography>

      <Typography>
        In no event shall we be liable for any indirect, incidental, special, consequential, or punitive
        damages, including but not limited to loss of profits, data, or goodwill, arising out of or in
        connection with your use of the Website or the products or services mentioned on the Website.
      </Typography>

      <Typography variant='h6' sx={{ mt: 3 }}>
        Indemnification
      </Typography>

      <Typography>
        You agree to indemnify, defend, and hold harmless us and our affiliates, officers, directors,
        employees, agents, and licensors from and against any and all claims, liabilities, damages, losses,
        costs, expenses, or fees (including reasonable attorneys' fees) arising out of or in connection with
        your use of the Website or any violation of these Terms.
      </Typography>

      <Typography variant='h6' sx={{ mt: 3 }}>
        Changes to Terms
      </Typography>

      <Typography>
        We reserve the right to update or modify these Terms at any time without prior notice. By continuing
        to access or use the Website after any such changes, you agree to be bound by the revised Terms.
      </Typography>

      <Typography variant='h6' sx={{ mt: 3 }}>
        Contact Us
      </Typography>

      <Typography>
        If you have any questions about these Terms, please <Link href='/contact'>contact us</Link>.
      </Typography>
    </Container>
  );
};

export default TermsOfService;
