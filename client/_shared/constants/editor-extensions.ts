import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';

const ExtendedTable = Table.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: null,
        parseHTML: (element) => element.getAttribute('class'),
        renderHTML(attributes) {
          if (attributes.class) {
            return { class: attributes.class };
          }
        }
      }
    };
  }
});

const ExtendedTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: null,
        parseHTML: (element) => element.getAttribute('class'),
        renderHTML(attributes) {
          if (attributes.class) {
            return { class: attributes.class };
          }
        }
      }
    };
  }
});

export const editorExtensions = [
  StarterKit,
  Underline,
  TextAlign.configure({
    types: ['heading', 'paragraph', 'image', 'video']
  }),
  Superscript,
  Subscript,
  TextStyle,
  Color.configure({
    types: ['textStyle']
  }),
  ExtendedTable.configure({
    resizable: true,
    allowTableNodeSelection: true
  }),
  ExtendedTableCell,
  TableHeader,
  TableRow,
  Image.configure({
    inline: true
  }),
  Youtube.configure({
    controls: false
  })
];
