import { Box, SxProps, TextField } from '@mui/material';
import EditorToolbar from './EditorToolbar';
import { Editor, EditorContent } from '@tiptap/react';
import { useState } from 'react';

interface Props {
  editor: Editor | null;
  sx?: SxProps;
  onHtmlChange: (html: string) => void;
  rawHtml: string;
}

const RichTextEditor = ({ editor, rawHtml, onHtmlChange, sx }: Props) => {
  const [editHtml, setEditHtml] = useState(false);

  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onHtmlChange(e.target.value);
  };

  return (
    <Box sx={sx}>
      <EditorToolbar editor={editor} toggleEdit={() => setEditHtml(!editHtml)} editHtml={editHtml} />

      {editHtml ? (
        <TextField
          multiline
          rows={20}
          defaultValue={rawHtml}
          onChange={handleEditorChange}
          inputProps={{ style: { resize: 'vertical' } }}
          InputProps={{ style: { borderTopLeftRadius: 0, borderTopRightRadius: 0 } }}
        />
      ) : (
        <EditorContent editor={editor} />
      )}
    </Box>
  );
};

export default RichTextEditor;
