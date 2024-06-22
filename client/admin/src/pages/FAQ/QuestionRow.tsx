import { IconButton, ListItem, ListItemButton, ListItemText, Switch } from '@mui/material';
import { FaqsInterface } from '../../../../../_shared/types';
import { useSnackbar } from 'notistack';
import { useCreateQuestion, useDeleteQuestion } from '../../../../_shared/api';
import { useNavigate } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiTrashCan } from '@mdi/js';
import { useState } from 'react';
import { Modal } from '../../../../_shared/components';

interface Props {
  question: FaqsInterface;
}

const QuestionRow = ({ question }: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [status, setStatus] = useState('');

  const handleError = (err: any) => {
    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }
  };

  const updateQuestion = useCreateQuestion(undefined, handleError);
  const deleteQuestion = useDeleteQuestion(undefined, handleError);

  const handleToggle = () => {
    const status = question.status === 'show' ? 'hide' : 'show';

    updateQuestion.mutate({ ...question, status });
  };

  const handleDelete = () => {
    setStatus('Deleting');

    deleteQuestion.mutate({ questionId: question.id });
  };

  return (
    <ListItem disableGutters disablePadding divider>
      <Modal
        open={status === 'Confirm Delete'}
        title='Are you sure you want to delete this question?'
        subtitle='This action cannot be reverted'
        submit={handleDelete}
        cancel={() => setStatus('')}
      />

      <ListItemButton onClick={() => navigate(`/faq/create/${question.id}`)}>
        <ListItemText primary={question.question} />
      </ListItemButton>

      <IconButton size='small' color='error' onClick={() => setStatus('Confirm Delete')}>
        <Icon path={mdiTrashCan} size={1} />
      </IconButton>

      <Switch color='success' checked={question.status === 'show'} sx={{ ml: 1 }} onChange={handleToggle} />
    </ListItem>
  );
};

export default QuestionRow;
