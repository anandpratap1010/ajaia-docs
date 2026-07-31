import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { api, errorMessage } from '../../api/client'
import type { DocumentDetail, Share } from '../../types'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
export function ShareModal({ document, onClose }: { document: DocumentDetail; onClose(): void }) {
  const [email, setEmail] = useState(''); const queryClient = useQueryClient()
  const refresh = () => queryClient.invalidateQueries({ queryKey: ['document', document.id] })
  const grant = useMutation({ mutationFn: async () => (await api.post<Share>(`/documents/${document.id}/shares`, { email })).data, onSuccess: () => { setEmail(''); toast.success('Editor access granted'); void refresh() }, onError: e => toast.error(errorMessage(e)) })
  const revoke = useMutation({ mutationFn: async (userId: number) => api.delete(`/documents/${document.id}/shares/${userId}`), onSuccess: () => { toast.success('Access removed'); void refresh() }, onError: e => toast.error(errorMessage(e)) })
  return <Modal title="Share document" onClose={onClose}><p className="mb-5 text-sm text-stone-500">Invite an existing Ajaia Docs user to edit <strong>{document.title}</strong>.</p><form onSubmit={e => { e.preventDefault(); grant.mutate() }} className="flex gap-2"><input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="teammate@example.com" className="min-w-0 flex-1 rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-brand"/><Button disabled={grant.isPending}>{grant.isPending ? 'Granting…' : 'Grant access'}</Button></form><div className="mt-7 space-y-3"><p className="text-xs font-bold uppercase tracking-wider text-stone-500">People with access</p><Person name={document.owner.name} email={document.owner.email} role="Owner"/>{document.shared_users.map(share => <div key={share.id} className="flex items-center justify-between rounded-xl bg-paper p-3"><Person name={share.user.name} email={share.user.email} role="Editor"/><button onClick={() => revoke.mutate(share.user.id)} disabled={revoke.isPending} className="text-xs font-bold text-red-600 hover:underline">Remove</button></div>)}</div></Modal>
}
function Person({ name, email, role }: { name: string; email: string; role: string }) { return <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-sm font-bold text-lime">{name[0]}</span><div><p className="text-sm font-semibold">{name} <span className="font-normal text-stone-400">· {role}</span></p><p className="text-xs text-stone-500">{email}</p></div></div> }
