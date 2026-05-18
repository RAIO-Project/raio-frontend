import { CATEGORIES, useStreamStore } from '@/entities/stream'
import { cx } from '@/shared'

export function CategoryBar() {
  const category = useStreamStore((state) => state.category)
  const setCategory = useStreamStore((state) => state.setCategory)

  return (
    <nav className="flex gap-2 overflow-x-auto border-b border-border bg-bg-2 px-4 py-2.5 hide-scrollbar">
      {CATEGORIES.map((item) => (
        <button
          key={item}
          onClick={() => setCategory(item)}
          className={cx(
            'whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-black transition',
            category === item ? 'border-accent bg-accent text-black' : 'border-border text-white/45 hover:text-white',
          )}
        >
          {item}
        </button>
      ))}
    </nav>
  )
}
