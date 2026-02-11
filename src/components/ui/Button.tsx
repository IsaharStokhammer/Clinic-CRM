import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Since I cannot install new packages like radix-ui or class-variance-authority without user approval, 
// and the user asked for "clean code" and "styled components" style, 
// I will implement a robust Button component using standard React props and our new `cn` utility
// conforming to the design system in globals.css.

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {

        const baseStyles = "inline-flex items-center justify-center rounded-xl font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

        const variants = {
            primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md",
            secondary: "bg-blue-50 text-blue-700 hover:bg-blue-100",
            outline: "border-2 border-gray-200 bg-transparent hover:bg-gray-50 text-gray-700",
            ghost: "hover:bg-gray-100 text-gray-600 hover:text-gray-900",
            danger: "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700",
        }

        const sizes = {
            sm: "h-9 px-4 text-xs",
            md: "h-11 px-6 text-sm",
            lg: "h-14 px-8 text-base",
        }

        return (
            <button
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                ref={ref}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading ? (
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : null}
                {children}
            </button>
        )
    }
)
Button.displayName = "Button"

export { Button }
