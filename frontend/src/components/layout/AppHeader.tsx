import { FileText, LogOut } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
export function AppHeader() {
  const { user, logout } = useAuth()
  return <header className="border-b border-stone-200 bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
    <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-lime"><FileText/></span><div><p className="font-bold leading-tight">Ajaia Docs</p><p className="text-xs text-stone-500">Lightweight collaborative editor</p></div></div>
    <div className="flex items-center gap-4"><div className="hidden text-right sm:block"><p className="text-sm font-semibold">{user?.name}</p><p className="text-xs text-stone-500">{user?.email}</p></div><button onClick={logout} className="flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-ink"><LogOut size={17}/> Logout</button></div>
  </div></header>
}
