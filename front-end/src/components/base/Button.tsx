import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'
type ButtonVariant = 'primary' | 'secondary' | 'error' | 'ghost' | 'glass' | 'outline'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize
  variant?: ButtonVariant
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-label-sm rounded-md',
  md: 'h-10 px-4 text-label-md rounded-lg',
  lg: 'h-12 px-6 text-label-lg rounded-xl',
  xl: 'h-14 px-8 text-title-md rounded-2xl',
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-on-primary hover:bg-primary/90 active:scale-[0.98] shadow-sm hover:shadow-md shadow-primary/20',
  secondary: 'bg-secondary text-on-secondary hover:bg-secondary/90 active:scale-[0.98] shadow-sm hover:shadow-md shadow-secondary/20',
  error: 'bg-error text-on-error hover:bg-error/90 active:scale-[0.98] shadow-sm hover:shadow-md shadow-error/20',
  ghost: 'bg-transparent text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface active:bg-surface-container-highest',
  glass: 'bg-glass-bg backdrop-blur-md border border-glass-border text-on-surface hover:bg-surface-container-high/60 active:scale-[0.98] shadow-glass shadow-sm',
  outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary/5 active:scale-[0.98]',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  size = 'md',
  variant = 'primary',
  isLoading = false,
  disabled,
  leftIcon,
  rightIcon,
  children,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(
        // Base reset and flex centering
        'inline-flex items-center justify-center gap-2 font-bold transition-all duration-200 outline-none',
        // Interaction disabled states
        'disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none',
        // Focus rings for accessibility
        'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
      {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span className="truncate">{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  )
})

Button.displayName = 'Button'
