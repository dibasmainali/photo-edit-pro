import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CleanButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  loadingText?: string;
}

const CleanButton = forwardRef<HTMLButtonElement, CleanButtonProps>(
  ({ 
    className, 
    variant = "primary", 
    size = "md", 
    isLoading = false,
    loadingText = "Loading...",
    children, 
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow-md",
      secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm",
      outline: "border border-gray-300 text-gray-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600",
      ghost: "text-gray-600 hover:text-red-600 hover:bg-red-50"
    };
    
    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base"
    };

    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 loading-spinner" />
        )}
        {isLoading ? loadingText : children}
      </button>
    );
  }
);

CleanButton.displayName = "CleanButton";

export { CleanButton };
