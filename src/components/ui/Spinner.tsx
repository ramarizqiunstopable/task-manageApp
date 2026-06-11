interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

export function Spinner({ size = 'md', label = 'Loading...' }: SpinnerProps) {
  return (
    <div className={`spinner spinner--${size}`} role="status" aria-label={label}>
      <div className="spinner__ring" />
    </div>
  )
}
