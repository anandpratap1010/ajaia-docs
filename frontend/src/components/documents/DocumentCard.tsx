import { ArrowUpRight, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { DocumentSummary } from '../../types'
export function DocumentCard({ document }: { document: DocumentSummary }) {
  return <Link to={`/documents/${document.id}`} className="group flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lg">
    <div className="min-w-0"><div className="flex items-center gap-2"><h3 className="truncate font-bold">{document.title}</h3><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${document.access_type === 'owner' ? 'bg-lime/60 text-ink' : 'bg-sky-100 text-sky-800'}`}>{document.access_type}</span></div><p className="mt-2 flex items-center gap-1.5 text-xs text-stone-500"><Clock size={13}/> Updated {new Date(document.updated_at).toLocaleString()} · {document.owner.name}</p></div><ArrowUpRight className="ml-4 text-stone-400 group-hover:text-brand"/>
  </Link>
}
