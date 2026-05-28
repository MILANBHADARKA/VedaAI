import type { Difficulty } from '@/lib/types'
import { cn } from '@/lib/cn'

const STYLES: Record<Difficulty, string> = {
  easy: 'bg-easy-bg text-easy-fg',
  moderate: 'bg-moderate-bg text-moderate-fg',
  challenging: 'bg-challenging-bg text-challenging-fg',
}

const LABEL: Record<Difficulty, string> = {
  easy: 'Easy',
  moderate: 'Moderate',
  challenging: 'Challenging',
}

export default function DifficultyBadge({
  difficulty,
}: {
  difficulty: Difficulty
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium align-middle',
        STYLES[difficulty],
      )}
    >
      {LABEL[difficulty]}
    </span>
  )
}
