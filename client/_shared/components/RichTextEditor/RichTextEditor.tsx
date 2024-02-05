import { Box, SxProps } from '@mui/material';
import EditorToolbar from './EditorToolbar';
import { Editor, EditorContent } from '@tiptap/react';

interface Props {
  editor: Editor | null;
  sx?: SxProps;
}

const RichTextEditor = ({ editor, sx }: Props) => {
  return (
    <Box sx={sx}>
      <EditorToolbar editor={editor} />

      <EditorContent editor={editor} />
    </Box>
  );
};

export default RichTextEditor;
