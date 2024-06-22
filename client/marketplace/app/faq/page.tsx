'use client';

import { Box, Link, Paper, Typography } from '@mui/material';
import { retrieveFaqs } from '../../../_shared/api';
import { Section } from '../../../_shared/components';
import Loading from './loading';

const page = () => {
  const { isLoading, data } = retrieveFaqs({ enabled: true });
  const { questions } = data || {};

  return isLoading ? (
    <Loading />
  ) : (
    <Section title='FAQ' position='center' titleVariant='h3' maxWidth='md'>
      <Box sx={{ mb: 3 }}>
        {questions?.map((question) => (
          <a key={question.id} href={`#${question.id}`}>
            <Typography>{question.question}</Typography>
          </a>
        ))}
      </Box>

      {questions?.map((question) => (
        <Paper key={question.id} id={question.id} variant='outlined' sx={{ p: 2, mb: 3 }}>
          <Typography sx={{ fontWeight: 500 }}>{question.question}</Typography>

          <div dangerouslySetInnerHTML={{ __html: question.answer }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Link onClick={() => window.scrollTo(0, 0)}>Back to top</Link>
          </Box>
        </Paper>
      ))}
    </Section>
  );
};

export default page;
