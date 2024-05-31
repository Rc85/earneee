import { Button, TextField } from '@mui/material';
import { Modal } from '../../../../_shared/components';
import { ChangeEvent, useRef, useState } from 'react';

interface Props {
  cancel: () => void;
  submit: (url: string, width: number, height: number) => void;
}

const AddLogo = ({ cancel, submit }: Props) => {
  const fileInputRef = useRef<any>();
  const [url, setUrl] = useState('');

  const handleSubmit = () => {
    const image = new Image();

    image.onload = () => {
      const { width, height } = image;

      submit(url, width, height);
    };

    image.src = url;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const fileReader = new FileReader();

      fileReader.onload = (e) => {
        const data = e.target?.result;

        if (data && typeof data === 'string') {
          const image = new Image();

          image.onload = () => {
            const { width, height } = image;

            submit(data, width, height);

            fileInputRef.current.value = '';
          };

          image.src = data;
        }
      };

      fileReader.readAsDataURL(file);
    }
  };

  return (
    <Modal open title='Add Logo' cancel={cancel} submit={handleSubmit}>
      <input type='file' ref={fileInputRef} hidden onChange={handleFileChange} />

      <TextField label='URL' onChange={(e) => setUrl(e.target.value)} value={url} />

      <Button fullWidth onClick={() => fileInputRef.current.click()}>
        Browse
      </Button>
    </Modal>
  );
};

export default AddLogo;
