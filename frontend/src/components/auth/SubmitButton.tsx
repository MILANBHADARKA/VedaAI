import Spinner from '@/components/ui/Spinner'

type Props = {
  children: React.ReactNode
  loading?: boolean
  disabled?: boolean
}

export default function SubmitButton({ children, loading, disabled }: Props) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className="w-full h-12 rounded-full inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-[#2A2A2A] to-[#111111] hover:from-[#333] hover:to-[#1a1a1a] disabled:opacity-60 disabled:cursor-not-allowed shadow-button transition-colors"
    >
      {loading && <Spinner className="h-4 w-4" />}
      {children}
    </button>
  )
}
