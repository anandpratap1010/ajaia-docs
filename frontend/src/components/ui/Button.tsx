import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary'
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

const variants: Record<ButtonVariant, string> = {
  primary: 'border border-ink bg-ink text-white hover:border-brand hover:bg-brand',
  secondary: 'border border-stone-300 bg-white text-ink hover:border-brand hover:bg-stone-50',
}

export function Button({ className = '', variant = 'primary', ...props }: ButtonProps) {
  return <button className={`inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`} {...props} />
}
