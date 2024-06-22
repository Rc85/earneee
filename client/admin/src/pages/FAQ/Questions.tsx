import { List, Typography } from '@mui/material';
import { retrieveFaqs } from '../../../../_shared/api';
import { Loading, Section } from '../../../../_shared/components';
import QuestionRow from './QuestionRow';

const Questions = () => {
  const { isLoading, data } = retrieveFaqs({ enabled: true });
  const { questions } = data || {};

  return isLoading ? (
    <Loading />
  ) : (
    <Section title='Questions' titleVariant='h3'>
      {questions && questions.length > 0 ? (
        <List disablePadding>
          {questions?.map((question) => (
            <QuestionRow key={question.id} question={question} />
          ))}
        </List>
      ) : (
        <Typography sx={{ textAlign: 'center' }}>There are no questions</Typography>
      )}
    </Section>
  );
};

export default Questions;
