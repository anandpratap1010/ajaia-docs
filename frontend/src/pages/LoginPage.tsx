import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { FileText, Sparkles } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../contexts/AuthContext'
import { errorMessage } from '../api/client'
import { Button } from '../components/ui/Button'

const schema = z.object({ email: z.string().email(), password: z.string().min(1, 'Enter your password') })
type LoginFields = z.infer<typeof schema>
const demos = [{ label: 'Owner', email: 'owner@ajaia.demo' }, { label: 'Collaborator', email: 'collaborator@ajaia.demo' }, { label: 'Reviewer', email: 'reviewer@ajaia.demo' }]
export function LoginPage() {
  const { user, login } = useAuth(); const navigate = useNavigate(); const [serverError, setServerError] = useState('')
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<LoginFields>({ resolver: zodResolver(schema), defaultValues: { email: 'owner@ajaia.demo', password: 'Password123!' } })
  if (user) return <Navigate to="/documents" replace/>
  const submit = handleSubmit(async (values) => { try { setServerError(''); await login(values.email, values.password); navigate('/documents') } catch (error) { setServerError(errorMessage(error)) } })
  return <main className="grid min-h-screen bg-paper lg:grid-cols-[1.05fr_.95fr]">
    <section className="hidden bg-ink p-16 text-white lg:flex lg:flex-col lg:justify-between"><div className="flex items-center gap-3 font-bold"><span className="grid h-11 w-11 place-items-center rounded-xl bg-lime text-ink"><FileText/></span>Ajaia Docs</div><div><p className="mb-5 text-sm font-bold uppercase tracking-[.22em] text-lime">Write. Share. Keep moving.</p><h1 className="max-w-xl text-6xl font-bold leading-[1.05]">A calmer place for documents that matter.</h1><p className="mt-7 max-w-lg text-lg leading-8 text-stone-300">Create rich documents, import your notes, and invite teammates without the weight of a full office suite.</p></div><p className="text-sm text-stone-400">Built for focused collaboration.</p></section>
    <section className="flex items-center justify-center p-6"><div className="w-full max-w-md"><div className="mb-9 lg:hidden"><h1 className="text-3xl font-bold">Ajaia Docs</h1><p className="text-stone-500">Lightweight collaborative document editor</p></div><div className="rounded-3xl bg-white p-8 shadow-[0_20px_70px_rgba(23,33,27,.1)]"><h2 className="text-3xl font-bold">Welcome back</h2><p className="mt-2 text-stone-500">Sign in to continue to your workspace.</p>
      <form onSubmit={submit} className="mt-7 space-y-5"><label className="block text-sm font-semibold">Email<input {...register('email')} className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 font-normal outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"/><span className="text-xs text-red-600">{errors.email?.message}</span></label><label className="block text-sm font-semibold">Password<input type="password" {...register('password')} className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 font-normal outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"/><span className="text-xs text-red-600">{errors.password?.message}</span></label>{serverError && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{serverError}</p>}<Button disabled={isSubmitting} className="w-full py-3">{isSubmitting ? 'Signing in…' : 'Sign in'}</Button></form>
      <div className="mt-7 rounded-2xl bg-paper p-4"><p className="flex items-center gap-2 text-sm font-bold"><Sparkles size={16}/> Demo accounts</p><div className="mt-3 flex flex-wrap gap-2">{demos.map(d => <button key={d.email} onClick={() => { setValue('email', d.email); setValue('password', 'Password123!') }} className="rounded-full border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold hover:border-brand">{d.label}</button>)}</div><p className="mt-3 text-xs text-stone-500">All accounts use <strong>Password123!</strong></p></div>
    </div></div></section>
  </main>
}
