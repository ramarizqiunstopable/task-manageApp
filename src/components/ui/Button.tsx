import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'icon'
  size?: 'sm' | 'md'
  isLoading?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  disabled,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`btn btn--${variant} btn--${size} ${className}`}
      disabled={disabled ?? isLoading}
      aria-busy={isLoading}
      {...rest}
    >
      {isLoading ? (
        <span className="btn__spinner" aria-hidden="true" />
      ) : (
        children
      )}
    </button>
  )
}
