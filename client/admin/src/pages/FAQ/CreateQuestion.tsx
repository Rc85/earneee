import { mdiArrowUpDropCircle } from '@mdi/js';
import Icon from '@mdi/react';
import { LoadingButton } from '@mui/lab';
import { CircularProgress, TextField } from '@mui/material';
import { deepEqual } from '../../../../../_shared/utils';
import { Loading, RichTextEditor, Section } from '../../../../_shared/components';
import { useEditor } from '@tiptap/react';
import { editorExtensions } from '../../../../_shared/constants';
import { useEffect, useState } from 'react';
import { FaqsInterface } from '../../../../../_shared/types';
import { useNavigate, useParams } from 'react-router-dom';
import { retrieveFaqs, useCreateQuestion } from '../../../../_shared/api';
import { useSnackbar } from 'notistack';

const editorStyle = { mb: 1.5 };

const CreateQuestion = () => {
  const params = useParams();
  const { questionId } = params;
  const { isLoading, data } = retrieveFaqs({ questionId, enabled: Boolean(questionId) });
  const { questions } = data || {};
  const question = questions?.[0];
  const initialQuestion: FaqsInterface = {
    id: '',
    question: '',
    answer: '',
    category: null,
    status: 'show',
    createdAt: '',
    updatedAt: null
  };
  const [initialState, setInitialState] = useState(JSON.parse(JSON.stringify(initialQuestion)));
  const [form, setForm] = useState(JSON.parse(JSON.stringify(initialQuestion)));
  const [status, setStatus] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const editor = useEditor(
    {
      content: question?.answer || '',
      extensions: editorExtensions,
      onUpdate: ({ editor }) => {
        setForm({ ...form, answer: editor.getHTML() });
      }
    },
    [question?.answer]
  );

  useEffect(() => {
    console.log(question);

    if (question) {
      setInitialState(JSON.parse(JSON.stringify(question)));
      setForm(JSON.parse(JSON.stringify(question)));
    }
  }, [question]);

  const handleSuccess = (response: any) => {
    if (response.data.statusText) {
      enqueueSnackbar(response.data.statusText, { variant: 'success' });
    }

    navigate(-1);
  };

  const handleError = (err: any) => {
    if (err.response.data.statusText) {
      enqueueSnackbar(err.response.data.statusText, { variant: 'error' });
    }

    setStatus('');
  };

  const createQuestion = useCreateQuestion(handleSuccess, handleError);

  const handleSubmit = () => {
    setStatus('Loading');

    createQuestion.mutate(form);
  };

  return isLoading ? (
    <Loading />
  ) : (
    <Section title='Create Question' titleVariant='h3'>
      <TextField
        label='Question'
        required
        value={form.question}
        onChange={(e) => setForm({ ...form, question: e.target.value })}
      />

      <TextField
        label='Category'
        select
        SelectProps={{ native: true }}
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      >
        <option value=''></option>
      </TextField>

      <RichTextEditor
        sx={editorStyle}
        editor={editor}
        onHtmlChange={(html) => setForm({ ...form, answer: html })}
        rawHtml={form.answer}
      />

      <LoadingButton
        variant='contained'
        fullWidth
        loading={status === 'Loading'}
        startIcon={<Icon path={mdiArrowUpDropCircle} size={1} />}
        loadingIndicator={<CircularProgress size={20} />}
        loadingPosition='start'
        disabled={deepEqual(form, initialState)}
        onClick={handleSubmit}
      >
        Submit
      </LoadingButton>
    </Section>
  );
};

export default CreateQuestion;
