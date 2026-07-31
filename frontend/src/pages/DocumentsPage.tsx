import { useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FilePlus2, Upload } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { api, errorMessage } from '../api/client'
import type { DocumentDetail, DocumentList } from '../types'
import { AppHeader } from '../components/layout/AppHeader'
import { Button } from '../components/ui/Button'
import { DocumentCard } from '../components/documents/DocumentCard'

export function DocumentsPage() {
  const navigate = useNavigate(); const queryClient = useQueryClient(); const fileInput = useRef<HTMLInputElement>(null)
  const documents = useQuery({ queryKey: ['documents'], queryFn: async () => (await api.get<DocumentList>('/documents')).data })
  const create = useMutation({ mutationFn: async () => (await api.post<DocumentDetail>('/documents', {})).data, onSuccess: (doc) => { void queryClient.invalidateQueries({ queryKey: ['documents'] }); navigate(`/documents/${doc.id}`) }, onError: e => toast.error(errorMessage(e)) })
  const importFile = useMutation({ mutationFn: async (file: File) => { const body = new FormData(); body.append('file', file); return (await api.post<DocumentDetail>('/documents/import', body)).data }, onSuccess: doc => { toast.success('Document imported'); void queryClient.invalidateQueries({ queryKey: ['documents'] }); navigate(`/documents/${doc.id}`) }, onError: e => toast.error(errorMessage(e)) })
  return <div className="min-h-screen bg-paper"><AppHeader/><main className="mx-auto max-w-6xl px-5 py-10"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-sm font-bold uppercase tracking-[.18em] text-brand">Your workspace</p><h1 className="mt-2 text-4xl font-bold">Documents</h1><p className="mt-2 text-stone-500">Pick up where you left off, or start something new.</p></div><div className="flex flex-wrap gap-3"><input ref={fileInput} type="file" accept=".txt,.md" className="hidden" onChange={e => { const file = e.target.files?.[0]; if (file) importFile.mutate(file); e.target.value = '' }}/><Button variant="secondary" onClick={() => fileInput.current?.click()} disabled={importFile.isPending}><Upload size={17}/>{importFile.isPending ? 'Importing…' : 'Import file'}</Button><Button onClick={() => create.mutate()} disabled={create.isPending}><FilePlus2 size={17}/> New document</Button></div></div><p className="mt-3 text-xs text-stone-500">Imports support UTF-8 .txt and .md files up to 2 MB.</p>
    {documents.isLoading ? <p className="py-24 text-center text-stone-500">Loading your documents…</p> : documents.isError ? <p className="mt-10 rounded-xl bg-red-50 p-4 text-red-700">{errorMessage(documents.error)}</p> : <div className="mt-12 space-y-12"><DocumentSection title="Owned by me" empty="You do not own any documents yet. Create your first document to get started." items={documents.data?.owned ?? []}/><DocumentSection title="Shared with me" empty="No documents have been shared with you." items={documents.data?.shared ?? []}/></div>}
  </main></div>
}
function DocumentSection({ title, empty, items }: { title: string; empty: string; items: DocumentList['owned'] }) {
  return <section><div className="mb-4 flex items-center gap-3"><h2 className="text-xl font-bold">{title}</h2><span className="rounded-full bg-stone-200 px-2 py-0.5 text-xs font-bold">{items.length}</span></div>{items.length ? <div className="grid gap-3 lg:grid-cols-2">{items.map(document => <DocumentCard key={document.id} document={document}/>)}</div> : <div className="rounded-2xl border border-dashed border-stone-300 p-8 text-center text-sm text-stone-500">{empty}</div>}</section>
}
