import type { Editor } from '@tiptap/react'
import { Bold, Italic, Underline, Heading1, Heading2, Pilcrow, List, ListOrdered, Undo2, Redo2 } from 'lucide-react'
const tools = [
  ['Bold', Bold, (e: Editor) => e.chain().focus().toggleBold().run(), (e: Editor) => e.isActive('bold')],
  ['Italic', Italic, (e: Editor) => e.chain().focus().toggleItalic().run(), (e: Editor) => e.isActive('italic')],
  ['Underline', Underline, (e: Editor) => e.chain().focus().toggleUnderline().run(), (e: Editor) => e.isActive('underline')],
  ['Heading 1', Heading1, (e: Editor) => e.chain().focus().toggleHeading({ level: 1 }).run(), (e: Editor) => e.isActive('heading', { level: 1 })],
  ['Heading 2', Heading2, (e: Editor) => e.chain().focus().toggleHeading({ level: 2 }).run(), (e: Editor) => e.isActive('heading', { level: 2 })],
  ['Paragraph', Pilcrow, (e: Editor) => e.chain().focus().setParagraph().run(), (e: Editor) => e.isActive('paragraph')],
  ['Bulleted list', List, (e: Editor) => e.chain().focus().toggleBulletList().run(), (e: Editor) => e.isActive('bulletList')],
  ['Numbered list', ListOrdered, (e: Editor) => e.chain().focus().toggleOrderedList().run(), (e: Editor) => e.isActive('orderedList')],
  ['Undo', Undo2, (e: Editor) => e.chain().focus().undo().run(), () => false],
  ['Redo', Redo2, (e: Editor) => e.chain().focus().redo().run(), () => false],
] as const
export function EditorToolbar({ editor }: { editor: Editor }) {
  return <div className="flex flex-wrap gap-1 border-b border-stone-200 bg-stone-50 p-2">{tools.map(([label, Icon, action, active]) => <button key={label} title={label} aria-label={label} onClick={() => action(editor)} className={`rounded-md p-2 transition hover:bg-stone-200 ${active(editor) ? 'bg-ink text-white hover:bg-ink' : 'text-stone-600'}`}><Icon size={17}/></button>)}</div>
}
