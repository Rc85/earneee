import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import { grey } from '@mui/material/colors';
import { Icon } from '@mdi/react';
import { mdiHelpCircle, mdiPlusBox } from '@mdi/js';
import Questions from './Questions';
import CreateQuestion from './CreateQuestion';

const FAQ = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexGrow: 1 }}>
      <Box
        sx={{
          minWidth: '200px',
          borderRightWidth: 1,
          borderRightColor: grey[600],
          borderRightStyle: 'solid'
        }}
      >
        <List disablePadding>
          <ListItem disablePadding disableGutters>
            <ListItemButton onClick={() => navigate(`/faq`)}>
              <ListItemIcon>
                <Icon path={mdiHelpCircle} size={1} />
              </ListItemIcon>

              <ListItemText primary='FAQ' />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding disableGutters>
            <ListItemButton onClick={() => navigate(`/faq/create`)}>
              <ListItemIcon>
                <Icon path={mdiPlusBox} size={1} />
              </ListItemIcon>

              <ListItemText primary='Create Question' />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      <Box sx={{ p: 2, flexGrow: 1, minWidth: 0 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

FAQ.Questions = Questions;
FAQ.Create = CreateQuestion;

export default FAQ;
