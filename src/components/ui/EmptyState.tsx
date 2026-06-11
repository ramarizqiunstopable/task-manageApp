interface EmptyStateProps {
  filter: string
}

export function EmptyState({ filter }: EmptyStateProps) {
  const messages: Record<string, { icon: string; text: string }> = {
    all: { icon: '✨', text: 'No tasks yet. Add one above!' },
    completed: { icon: '🎯', text: 'No completed tasks yet. Keep going!' },
    pending: { icon: '🎉', text: "All caught up! No pending tasks." },
  }

  const { icon, text } = messages[filter] ?? messages['all']

  return (
    <div className="empty-state" role="status">
      <span className="empty-state__icon" aria-hidden="true">
        {icon}
      </span>
      <p className="empty-state__text">{text}</p>
    </div>
  )
}
