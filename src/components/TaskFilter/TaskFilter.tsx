import type { FilterType } from '../../types/task'

interface TaskFilterProps {
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
  counts: Record<FilterType, number>
}

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
]

export function TaskFilter({
  activeFilter,
  onFilterChange,
  counts,
}: TaskFilterProps) {
  return (
    <nav className="task-filter" aria-label="Filter tasks">
      <ul className="task-filter__list" role="list">
        {FILTERS.map(({ key, label }) => (
          <li key={key}>
            <button
              id={`filter-${key}`}
              className={`task-filter__btn ${activeFilter === key ? 'task-filter__btn--active' : ''}`}
              onClick={() => onFilterChange(key)}
              aria-pressed={activeFilter === key}
              aria-label={`Show ${label} tasks (${counts[key]})`}
            >
              {label}
              <span className="task-filter__count">{counts[key]}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
