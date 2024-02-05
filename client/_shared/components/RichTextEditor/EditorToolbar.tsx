import {
  mdiCodeTags,
  mdiFormatAlignCenter,
  mdiFormatAlignJustify,
  mdiFormatAlignLeft,
  mdiFormatAlignRight,
  mdiFormatBold,
  mdiFormatColorText,
  mdiFormatHeader1,
  mdiFormatHeader2,
  mdiFormatHeader3,
  mdiFormatHeader4,
  mdiFormatHeader5,
  mdiFormatHeader6,
  mdiFormatItalic,
  mdiFormatListBulleted,
  mdiFormatListNumbered,
  mdiFormatParagraph,
  mdiFormatStrikethroughVariant,
  mdiFormatSubscript,
  mdiFormatSuperscript,
  mdiFormatUnderline,
  mdiImagePlus,
  mdiMenuDown,
  mdiTable,
  mdiYoutube
} from '@mdi/js';
import { Icon } from '@mdi/react';
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  Popover,
  ToggleButton,
  ToggleButtonGroup,
  useTheme
} from '@mui/material';
import { Editor } from '@tiptap/react';
import React, { useState } from 'react';
import ColorPicker, { ColorObject } from 'react-pick-color';

interface Props {
  editor: Editor | null;
}

const EditorToolbar = ({ editor }: Props) => {
  const theme = useTheme();
  const [textFormatMenu, setTextFormatMenu] = useState<HTMLElement | null>(null);
  const [textColorMenu, setTextColorMenu] = useState<HTMLElement | null>(null);
  const [tableMenu, setTableMenu] = useState<HTMLElement | null>(null);
  const [alignmentMenu, setAlignmentMenu] = useState<HTMLElement | null>(null);

  const handleAlignmentMenuClick = (e: React.MouseEvent<HTMLElement>) => {
    setAlignmentMenu(e.currentTarget);
  };

  const handleTableMenuClick = (e: React.MouseEvent<HTMLElement>) => {
    setTableMenu(e.currentTarget);
  };

  const handleTextColorMenuClick = (e: React.MouseEvent<HTMLElement>) => {
    setTextColorMenu(e.currentTarget);
  };

  const handleTextFormatMenuClick = (e: React.MouseEvent<HTMLElement>) => {
    setTextFormatMenu(e.currentTarget);
  };

  const handleMenuOnClose = () => {
    setTextColorMenu(null);
    setTextFormatMenu(null);
    setTableMenu(null);
    setAlignmentMenu(null);
  };

  const handleTextFormatClick = (format: string) => {
    if (format === 'h1') {
      editor?.chain().focus().toggleHeading({ level: 1 }).run();
    } else if (format === 'h2') {
      editor?.chain().focus().toggleHeading({ level: 2 }).run();
    } else if (format === 'h3') {
      editor?.chain().focus().toggleHeading({ level: 3 }).run();
    } else if (format === 'h4') {
      editor?.chain().focus().toggleHeading({ level: 4 }).run();
    } else if (format === 'h5') {
      editor?.chain().focus().toggleHeading({ level: 5 }).run();
    } else if (format === 'h6') {
      editor?.chain().focus().toggleHeading({ level: 6 }).run();
    } else if (format === 'p') {
      editor?.chain().focus().setParagraph().run();
    } else if (format === 'code') {
      editor?.chain().focus().toggleCodeBlock().run();
    }

    setTextFormatMenu(null);
  };

  const handleColorChange = (color: ColorObject) => {
    editor?.chain().focus().setColor(color.hex.toUpperCase()).run();
  };

  const handleAddImageClick = () => {
    const url = window.prompt('URL');

    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  };

  const handleYoutubeClick = () => {
    const url = prompt('Enter YouTube URL');

    if (url) {
      editor?.commands.setYoutubeVideo({ src: url });
    }
  };

  const handleAlignmentClick = (alignment: string) => {
    editor?.chain().focus().setTextAlign(alignment).run();

    setAlignmentMenu(null);
  };

  const handleTableClick = (operation: string) => {
    console.log(operation);

    if (operation === 'insert table') {
      editor?.chain().focus().insertTable().run();
    } else if (operation === 'delete table') {
      editor?.chain().focus().deleteTable().run();
    } else if (operation === 'add row above') {
      editor?.chain().focus().addRowBefore().run();
    } else if (operation === 'add row below') {
      editor?.chain().focus().addRowAfter().run();
    } else if (operation === 'delete row') {
      editor?.chain().focus().deleteRow().run();
    } else if (operation === 'add column left') {
      editor?.chain().focus().addColumnBefore().run();
    } else if (operation === 'add column right') {
      editor?.chain().focus().addColumnAfter().run();
    } else if (operation === 'delete column') {
      editor?.chain().focus().deleteColumn().run();
    } else if (operation === 'toggle header row') {
      editor?.chain().focus().toggleHeaderRow().run();
    } else if (operation === 'toggle header column') {
      editor?.chain().focus().toggleHeaderColumn().run();
    } else if (operation === 'merge cells') {
      editor?.chain().focus().mergeCells().run();
    } else if (operation === 'split cell') {
      editor?.chain().focus().splitCell().run();
    } else if (operation === 'add borders') {
      editor?.chain().focus().setCellAttribute('class', undefined).run();
    } else if (operation === 'remove borders') {
      editor?.chain().focus().setCellAttribute('class', 'no-border').run();
    }

    setTableMenu(null);
  };

  return (
    <>
      <ToggleButtonGroup
        sx={{
          display: 'flex',
          width: '100%',
          position: 'sticky',
          backgroundColor: 'white',
          zIndex: 1,
          top: 0
        }}
      >
        <ToggleButton
          selected={editor?.isActive('bold')}
          value='bold'
          size='small'
          sx={{ borderColor: '#4f4f4f', borderBottomLeftRadius: 0, flexGrow: 1 }}
          onClick={() => editor?.chain().focus().toggleBold().run()}
          disabled={!editor?.can().setBold()}
        >
          <Icon path={mdiFormatBold} size={1} />
        </ToggleButton>

        <ToggleButton
          selected={editor?.isActive('underline')}
          value='underline'
          size='small'
          sx={{ borderColor: '#4f4f4f', flexGrow: 1 }}
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          disabled={!editor?.can().setUnderline()}
        >
          <Icon path={mdiFormatUnderline} size={1} />
        </ToggleButton>

        <ToggleButton
          selected={editor?.isActive('italic')}
          value='italic'
          size='small'
          sx={{ borderColor: '#4f4f4f', flexGrow: 1 }}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          disabled={!editor?.can().setItalic()}
        >
          <Icon path={mdiFormatItalic} size={1} />
        </ToggleButton>

        <ToggleButton
          selected={editor?.isActive('strike')}
          value='strike'
          size='small'
          sx={{ borderColor: '#4f4f4f', flexGrow: 1 }}
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          disabled={!editor?.can().setStrike()}
        >
          <Icon path={mdiFormatStrikethroughVariant} size={1} />
        </ToggleButton>

        <ToggleButton
          value='left'
          size='small'
          sx={{ borderColor: '#4f4f4f', flexGrow: 1 }}
          onClick={handleAlignmentMenuClick}
        >
          {editor?.isActive({ textAlign: 'left' }) ? (
            <Icon path={mdiFormatAlignLeft} size={1} />
          ) : editor?.isActive({ textAlign: 'center' }) ? (
            <Icon path={mdiFormatAlignCenter} size={1} />
          ) : editor?.isActive({ textAlign: 'right' }) ? (
            <Icon path={mdiFormatAlignRight} size={1} />
          ) : editor?.isActive({ textAlign: 'justify' }) ? (
            <Icon path={mdiFormatAlignJustify} size={1} />
          ) : (
            <></>
          )}

          <Icon path={mdiMenuDown} size={1} />
        </ToggleButton>

        <ToggleButton
          selected={editor?.isActive('bulletList')}
          value='bulleted'
          size='small'
          sx={{ borderColor: '#4f4f4f', flexGrow: 1 }}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <Icon path={mdiFormatListBulleted} size={1} />
        </ToggleButton>

        <ToggleButton
          selected={editor?.isActive('orderedList')}
          value='ordered'
          size='small'
          sx={{ borderColor: '#4f4f4f', flexGrow: 1 }}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <Icon path={mdiFormatListNumbered} size={1} />
        </ToggleButton>

        <ToggleButton
          value='heading'
          size='small'
          onClick={handleTextFormatMenuClick}
          sx={{ borderColor: '#4f4f4f', flexGrow: 1 }}
        >
          {editor?.isActive('heading', { level: 1 }) ? (
            <Icon path={mdiFormatHeader1} size={1} />
          ) : editor?.isActive('heading', { level: 2 }) ? (
            <Icon path={mdiFormatHeader2} size={1} />
          ) : editor?.isActive('heading', { level: 3 }) ? (
            <Icon path={mdiFormatHeader3} size={1} />
          ) : editor?.isActive('heading', { level: 4 }) ? (
            <Icon path={mdiFormatHeader4} size={1} />
          ) : editor?.isActive('heading', { level: 5 }) ? (
            <Icon path={mdiFormatHeader5} size={1} />
          ) : editor?.isActive('heading', { level: 6 }) ? (
            <Icon path={mdiFormatHeader6} size={1} />
          ) : editor?.isActive('paragraph') ? (
            <Icon path={mdiFormatParagraph} size={1} />
          ) : editor?.isActive('codeBlock') ? (
            <Icon path={mdiCodeTags} size={1} />
          ) : (
            <></>
          )}

          <Icon path={mdiMenuDown} size={1} />
        </ToggleButton>

        <ToggleButton
          selected={editor?.isActive('superscript')}
          value='superscript'
          size='small'
          sx={{ borderColor: '#4f4f4f', flexGrow: 1 }}
          onClick={() => editor?.chain().focus().toggleSuperscript().run()}
          disabled={!editor?.can().setSuperscript()}
        >
          <Icon path={mdiFormatSuperscript} size={1} />
        </ToggleButton>

        <ToggleButton
          selected={editor?.isActive('subscript')}
          value='subscript'
          size='small'
          sx={{ borderColor: '#4f4f4f', flexGrow: 1 }}
          onClick={() => editor?.chain().focus().toggleSubscript().run()}
          disabled={!editor?.can().setSubscript()}
        >
          <Icon path={mdiFormatSubscript} size={1} />
        </ToggleButton>

        <ToggleButton
          value='textColor'
          size='small'
          sx={{ borderColor: '#4f4f4f', flexGrow: 1 }}
          onClick={handleTextColorMenuClick}
        >
          <Icon path={mdiFormatColorText} size={1} />

          <Box
            sx={{
              backgroundColor: editor?.getAttributes('textStyle').color || '#fff',
              width: 15,
              height: 15,
              borderWidth: 1,
              borderColor: '#4f4f4f',
              borderStyle: 'solid',
              borderRadius: '3px'
            }}
          />
        </ToggleButton>

        <ToggleButton
          value='table'
          size='small'
          sx={{ borderColor: '#4f4f4f', flexGrow: 1 }}
          onClick={handleTableMenuClick}
        >
          <Icon path={mdiTable} size={1} />

          <Icon path={mdiMenuDown} size={1} />
        </ToggleButton>

        <ToggleButton
          value='image'
          size='small'
          sx={{ borderColor: '#4f4f4f', flexGrow: 1 }}
          onClick={handleAddImageClick}
        >
          <Icon path={mdiImagePlus} size={1} />
        </ToggleButton>

        <ToggleButton
          value='video'
          size='small'
          sx={{ borderColor: '#4f4f4f', borderBottomRightRadius: 0, flexGrow: 1 }}
          onClick={handleYoutubeClick}
        >
          <Icon path={mdiYoutube} size={1} />
        </ToggleButton>
      </ToggleButtonGroup>

      <Popover
        open={Boolean(textColorMenu)}
        anchorEl={textColorMenu}
        onClose={handleMenuOnClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <ColorPicker
          color={editor?.getAttributes('textStyle').color}
          onChange={handleColorChange}
          presets={[
            theme.palette.primary.main,
            theme.palette.secondary.main,
            theme.palette.success.main,
            theme.palette.error.main,
            theme.palette.info.main,
            theme.palette.warning.main
          ]}
        />

        <Button fullWidth onClick={() => editor?.chain().focus().unsetColor().run()}>
          Unset color
        </Button>
      </Popover>

      <Menu anchorEl={alignmentMenu} open={Boolean(alignmentMenu)} onClose={handleMenuOnClose}>
        <IconButton size='small' onClick={() => handleAlignmentClick('left')}>
          <Icon path={mdiFormatAlignLeft} size={1} />
        </IconButton>

        <IconButton size='small' onClick={() => handleAlignmentClick('center')}>
          <Icon path={mdiFormatAlignCenter} size={1} />
        </IconButton>

        <IconButton size='small' onClick={() => handleAlignmentClick('right')}>
          <Icon path={mdiFormatAlignRight} size={1} />
        </IconButton>

        <IconButton size='small' onClick={() => handleAlignmentClick('justify')}>
          <Icon path={mdiFormatAlignJustify} size={1} />
        </IconButton>
      </Menu>

      <Menu anchorEl={tableMenu} open={Boolean(tableMenu)} onClose={handleMenuOnClose}>
        <List disablePadding>
          <ListItem disableGutters disablePadding>
            <ListItemButton
              onClick={() => handleTableClick('insert table')}
              disabled={!editor?.can().insertTable()}
            >
              <ListItemText primary='Insert table' />
            </ListItemButton>
          </ListItem>

          <ListItem disableGutters disablePadding>
            <ListItemButton
              onClick={() => handleTableClick('delete table')}
              disabled={!editor?.can().deleteTable()}
            >
              <ListItemText primary='Delete table' />
            </ListItemButton>
          </ListItem>

          <ListItem disableGutters disablePadding>
            <ListItemButton onClick={() => handleTableClick('add row above')}>
              <ListItemText primary='Add row above' />
            </ListItemButton>
          </ListItem>

          <ListItem disableGutters disablePadding>
            <ListItemButton onClick={() => handleTableClick('add row below')}>
              <ListItemText primary='Add row below' />
            </ListItemButton>
          </ListItem>

          <ListItem disableGutters disablePadding>
            <ListItemButton onClick={() => handleTableClick('delete row')}>
              <ListItemText primary='Delete row' />
            </ListItemButton>
          </ListItem>

          <ListItem disableGutters disablePadding>
            <ListItemButton onClick={() => handleTableClick('add column left')}>
              <ListItemText primary='Add column to the left' />
            </ListItemButton>
          </ListItem>

          <ListItem disableGutters disablePadding>
            <ListItemButton onClick={() => handleTableClick('add column right')}>
              <ListItemText primary='Add column to the right' />
            </ListItemButton>
          </ListItem>

          <ListItem disableGutters disablePadding>
            <ListItemButton onClick={() => handleTableClick('delete column')}>
              <ListItemText primary='Delete column' />
            </ListItemButton>
          </ListItem>

          <ListItem disableGutters disablePadding>
            <ListItemButton onClick={() => handleTableClick('toggle header row')}>
              <ListItemText primary='Toggle header row' />
            </ListItemButton>
          </ListItem>

          <ListItem disableGutters disablePadding>
            <ListItemButton onClick={() => handleTableClick('toggle header column')}>
              <ListItemText primary='Toggle header column' />
            </ListItemButton>
          </ListItem>

          <ListItem disableGutters disablePadding>
            <ListItemButton onClick={() => handleTableClick('merge cells')}>
              <ListItemText primary='Merge cells' />
            </ListItemButton>
          </ListItem>

          <ListItem disableGutters disablePadding>
            <ListItemButton onClick={() => handleTableClick('split cell')}>
              <ListItemText primary='Split cell' />
            </ListItemButton>
          </ListItem>

          <List disablePadding>
            <ListItem disableGutters disablePadding>
              <ListItemButton
                onClick={() => handleTableClick('add borders')}
                disabled={!editor?.can().insertTable()}
              >
                <ListItemText primary='Add borders' />
              </ListItemButton>
            </ListItem>

            <ListItem disableGutters disablePadding>
              <ListItemButton
                onClick={() => handleTableClick('remove borders')}
                disabled={!editor?.can().deleteTable()}
              >
                <ListItemText primary='Remove borders' />
              </ListItemButton>
            </ListItem>
          </List>
        </List>
      </Menu>

      <Menu anchorEl={textFormatMenu} open={Boolean(textFormatMenu)} onClose={handleMenuOnClose}>
        <List disablePadding>
          <ListItem disableGutters disablePadding>
            <ListItemButton onClick={() => handleTextFormatClick('h1')}>
              <ListItemText primary='Heading 1' />
            </ListItemButton>
          </ListItem>

          <ListItem disableGutters disablePadding>
            <ListItemButton onClick={() => handleTextFormatClick('h2')}>
              <ListItemText primary='Heading 2' />
            </ListItemButton>
          </ListItem>

          <ListItem disableGutters disablePadding>
            <ListItemButton onClick={() => handleTextFormatClick('h3')}>
              <ListItemText primary='Heading 3' />
            </ListItemButton>
          </ListItem>

          <ListItem disableGutters disablePadding>
            <ListItemButton onClick={() => handleTextFormatClick('h4')}>
              <ListItemText primary='Heading 4' />
            </ListItemButton>
          </ListItem>

          <ListItem disableGutters disablePadding>
            <ListItemButton onClick={() => handleTextFormatClick('h5')}>
              <ListItemText primary='Heading 5' />
            </ListItemButton>
          </ListItem>

          <ListItem disableGutters disablePadding>
            <ListItemButton onClick={() => handleTextFormatClick('h6')}>
              <ListItemText primary='Heading 6' />
            </ListItemButton>
          </ListItem>

          <ListItem disableGutters disablePadding>
            <ListItemButton onClick={() => handleTextFormatClick('p')}>
              <ListItemText primary='Paragraph' />
            </ListItemButton>
          </ListItem>

          <ListItem disableGutters disablePadding>
            <ListItemButton onClick={() => handleTextFormatClick('code')}>
              <ListItemText primary='Code Block' />
            </ListItemButton>
          </ListItem>
        </List>
      </Menu>
    </>
  );
};

export default EditorToolbar;
