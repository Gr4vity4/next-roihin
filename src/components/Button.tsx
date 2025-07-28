import { ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full font-medium font-thai transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transform hover:scale-105",
  {
    variants: {
      variant: {
        gold: "bg-gold text-white hover:bg-gold/90 focus:ring-gold shadow-lg hover:shadow-xl",
        green: "bg-green text-white hover:bg-green/90 focus:ring-green shadow-lg hover:shadow-xl",
        outline: "border-2 border-current hover:bg-black hover:text-white",
      },
      size: {
        sm: "px-6 py-2 text-sm",
        md: "px-8 py-3 text-base",
        lg: "px-10 py-4 text-lg font-semibold",
      },
    },
    defaultVariants: {
      variant: "gold",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export default Button