'use client';

import { Typography } from '@mui/material';
import { Section } from '../../../_shared/components';

const About = () => {
  return (
    <Section title='About' titleVariant='h3' position='center' maxWidth='md' sx={{ textAlign: 'justify' }}>
      <Typography>
        Earneee is a website that list affiliate products from around the web. We aggregate the best finds and
        trending products here for the sake of your convenience. We also find deals and offers around the web
        and promote them here because we love discounts and love sharing them. If you like what we do, please
        support us by clicking and purchasing through our affiliate links.
      </Typography>
    </Section>
  );
};

export default About;
