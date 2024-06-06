import { mdiTrashCan } from '@mdi/js';
import Icon from '@mdi/react';
import { ListItem, ListItemButton, ListItemText, IconButton } from '@mui/material';
import { ProductUrlsInterface } from '../../../../../_shared/types';
import { useState } from 'react';
import AddUrl from './AddUrl';

interface Props {
  url: ProductUrlsInterface;
  onDelete: () => void;
  submit: (url: ProductUrlsInterface) => void;
}

const UrlRow = ({ url, onDelete, submit }: Props) => {
  const [status, setStatus] = useState('');

  const handleSubmit = (url: ProductUrlsInterface) => {
    submit(url);

    setStatus('');
  };

  return (
    <ListItem disableGutters disablePadding divider>
      {status === 'Edit' && <AddUrl cancel={() => setStatus('')} submit={handleSubmit} url={url} />}

      <ListItemButton onClick={() => setStatus('Edit')}>
        <ListItemText
          primary={url.url}
          secondary={`${url.country} \u2022 $${url.price} ${url.currency.toUpperCase()}${
            url.affiliate ? ` \u2022 ${url.affiliate.name}` : ''
          }`}
          primaryTypographyProps={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        />
      </ListItemButton>

      <IconButton onClick={onDelete}>
        <Icon path={mdiTrashCan} size={1} />
      </IconButton>
    </ListItem>
  );
};

export default UrlRow;
