import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "error"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md font-label-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          {
            "bg-primary text-on-primary shadow hover:brightness-110": variant === "default",
            "bg-secondary text-on-secondary shadow hover:brightness-110": variant === "secondary",
            "border-2 border-outline-variant bg-transparent hover:bg-surface-container-low text-primary": variant === "outline",
            "hover:bg-surface-container-low text-on-surface-variant hover:text-primary": variant === "ghost",
            "bg-error text-on-error shadow hover:brightness-110": variant === "error",
            "h-12 px-6 py-2": size === "default", // Generous touch target
            "h-9 rounded-md px-4": size === "sm",
            "h-14 rounded-lg px-8 text-lg": size === "lg",
            "h-12 w-12 rounded-full": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
