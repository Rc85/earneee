import { TextField } from '@mui/material';
import { Modal } from '../../../../_shared/components';
import { FormEvent, useState } from 'react';
import { useSnackbar } from 'notistack';

interface Props {
  cancel: () => void;
  submit: (url: string, type: string, videoId: string) => void;
}

const AddImage = ({ cancel, submit }: Props) => {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [type, setType] = useState('image');
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();

    if (type === 'youtube') {
      if (!videoId) {
        return enqueueSnackbar('Video ID required', { variant: 'error' });
      }

      submit(`https://youtube.com/watch?v=${videoId}`, 'youtube', videoId);
    } else {
      if (!url) {
        return enqueueSnackbar('URL required', { variant: 'error' });
      } else if (!/^https:\/\//.test(url)) {
        return enqueueSnackbar('Invalid URL', { variant: 'error' });
      }

      submit(url, type, videoId);
    }
  };

  return (
    <Modal open title='Add Image' submit={handleSubmit} cancel={cancel} disableBackdropClick component='form'>
      <TextField
        select
        label='Type'
        SelectProps={{ native: true }}
        onChange={(e) => setType(e.target.value)}
        value={type}
        required
      >
        <option value='image'>Image</option>
        <option value='video'>Video</option>
        <option value='youtube'>Youtube</option>
      </TextField>

      {type === 'youtube' ? (
        <TextField
          label='Video ID'
          required
          autoFocus
          onChange={(e) => setVideoId(e.target.value)}
          value={videoId}
        />
      ) : (
        <TextField
          label='URL'
          required
          autoFocus
          onChange={(e) => setUrl(e.target.value)}
          value={url}
          type='url'
        />
      )}
    </Modal>
  );
};

export default AddImage;
