import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="font-label-md text-on-surface">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-12 w-full rounded-md border-2 bg-surface-container-lowest px-4 py-2 text-body-md text-on-surface ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-outline focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
            error ? "border-error focus-visible:border-error focus-visible:ring-error" : "border-outline-variant",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <span className="font-body-sm text-error">{error}</span>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
