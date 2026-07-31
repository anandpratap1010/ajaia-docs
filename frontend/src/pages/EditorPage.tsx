import { useEffect, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Check, Save, Share2, Trash2 } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { api, errorMessage } from '../api/client'
import type { DocumentDetail } from '../types'
import { Button } from '../components/ui/Button'
import { EditorToolbar } from '../components/editor/EditorToolbar'
import { ShareModal } from '../components/sharing/ShareModal'

export function EditorPage() {
  const { documentId = '' } = useParams(); const navigate = useNavigate(); const queryClient = useQueryClient()
  const [title, setTitle] = useState(''); const [dirty, setDirty] = useState(false); const [shareOpen, setShareOpen] = useState(false)
  const document = useQuery({ queryKey: ['document', Number(documentId)], queryFn: async () => (await api.get<DocumentDetail>(`/documents/${documentId}`)).data })
  const editor = useEditor({ extensions: [StarterKit, Underline, Placeholder.configure({ placeholder: 'Start writing something worth sharing…' })], content: { type: 'doc', content: [{ type: 'paragraph' }] }, onUpdate: () => setDirty(true), editorProps: { attributes: { class: 'prose prose-stone max-w-none min-h-[60vh] p-10 sm:p-14 outline-none' } } })
  useEffect(() => { if (document.data && editor) { setTitle(document.data.title); editor.commands.setContent(document.data.content); setDirty(false) } }, [document.data?.id, editor])
  useEffect(() => { const warn = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault() }; window.addEventListener('beforeunload', warn); return () => window.removeEventListener('beforeunload', warn) }, [dirty])
  const save = useMutation({ mutationFn: async () => { if (!editor) throw new Error('Editor unavailable'); return (await api.patch<DocumentDetail>(`/documents/${documentId}`, { title, content: editor.getJSON() })).data }, onSuccess: data => { setDirty(false); queryClient.setQueryData(['document', Number(documentId)], data); void queryClient.invalidateQueries({ queryKey: ['documents'] }) }, onError: e => toast.error(errorMessage(e)) })
  const remove = useMutation({ mutationFn: () => api.delete(`/documents/${documentId}`), onSuccess: () => { toast.success('Document deleted'); void queryClient.invalidateQueries({ queryKey: ['documents'] }); navigate('/documents') }, onError: e => toast.error(errorMessage(e)) })
  if (document.isLoading || !editor) return <div className="grid min-h-screen place-items-center text-stone-500">Opening document…</div>
  if (document.isError || !document.data) return <div className="grid min-h-screen place-items-center"><div className="text-center"><p className="text-red-700">{errorMessage(document.error)}</p><Link to="/documents" className="mt-4 inline-block font-bold text-brand">Back to documents</Link></div></div>
  const isOwner = document.data.current_user_access === 'owner'
  return <div className="min-h-screen bg-paper"><header className="sticky top-0 z-20 border-b border-stone-200 bg-white"><div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3"><Link to="/documents" aria-label="Back to documents" className="rounded-lg p-2 hover:bg-stone-100"><ArrowLeft size={20}/></Link><div className="min-w-[180px] flex-1"><input maxLength={150} value={title} onChange={e => { setTitle(e.target.value); setDirty(true) }} className="w-full bg-transparent text-lg font-bold outline-none" aria-label="Document title"/><p className="flex items-center gap-2 text-xs text-stone-500"><span className={`rounded-full px-2 py-0.5 font-bold ${isOwner ? 'bg-lime/60 text-ink' : 'bg-sky-100 text-sky-800'}`}>{isOwner ? 'Owner' : 'Shared editor'}</span>{save.isPending ? 'Saving…' : dirty ? 'Unsaved changes' : <span className="flex items-center gap-1"><Check size={12}/> Saved {new Date(document.data.updated_at).toLocaleTimeString()}</span>}</p></div><div className="flex flex-wrap gap-2">{isOwner && <Button variant="secondary" onClick={() => setShareOpen(true)}><Share2 size={16}/> Share</Button>}{isOwner && <button aria-label="Delete document" onClick={() => { if (confirm('Delete this document permanently?')) remove.mutate() }} className="rounded-lg border border-red-200 p-2.5 text-red-600 hover:bg-red-50"><Trash2 size={17}/></button>}<Button onClick={() => save.mutate()} disabled={!dirty || save.isPending || !title.trim()}><Save size={16}/>{save.isPending ? 'Saving…' : 'Save'}</Button></div></div></header>
    <main className="mx-auto max-w-5xl px-4 py-8"><div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-[0_18px_55px_rgba(23,33,27,.08)]"><EditorToolbar editor={editor}/><EditorContent editor={editor}/></div></main>{shareOpen && <ShareModal document={document.data} onClose={() => setShareOpen(false)}/>}
  </div>
}
