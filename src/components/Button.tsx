import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { ButtonHTMLAttributes, forwardRef } from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium  transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transform active:scale-95 cursor-pointer disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary:
          'bg-[#005635] text-white border-2 border-[#005635] hover:bg-white hover:text-[#005635] hover:border-[#005635] focus:ring-[#005635] focus:ring-offset-white shadow-lg hover:shadow-xl active:bg-gray-100 active:text-[#005635]',
        gold: 'bg-gold-400 text-white hover:bg-gold-500 focus:ring-gold-400 focus:ring-offset-white shadow-lg hover:shadow-xl active:bg-gold-600',
        green:
          'bg-green-600 text-white hover:bg-green-700 focus:ring-green-600 focus:ring-offset-white shadow-lg hover:shadow-xl active:bg-green-800',
        outline:
          'border-2 border-[#005635] text-[#005635] hover:bg-[#005635] hover:text-white focus:ring-[#005635] focus:ring-offset-white transition-colors',
        ghost:
          'hover:bg-gray-100 text-gray-700 hover:text-gray-900 focus:ring-gray-500 focus:ring-offset-white',
      },
      size: {
        sm: 'px-4 py-2 text-sm gap-2',
        md: 'px-6 py-3 text-base gap-2',
        lg: 'px-8 py-4 text-lg font-semibold gap-3',
        xl: 'px-10 py-5 text-xl font-bold gap-3',
      },
      highlight: {
        true: 'bg-black text-[#DCB875] border-2 border-[#DCB875] hover:bg-[#DCB875] hover:text-black focus:ring-[#DCB875] focus:ring-offset-black shadow-lg hover:shadow-xl active:bg-[#DCB875] active:text-black',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      highlight: false,
    },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      highlight,
      isLoading,
      leftIcon,
      rightIcon,
      fullWidth,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        className={cn(
          buttonVariants({ variant, size, highlight, className }),
          fullWidth && 'w-full',
          isLoading && 'cursor-wait',
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    )
  },
)
Button.displayName = 'Button'

export default Button
