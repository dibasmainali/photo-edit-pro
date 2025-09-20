import { forwardRef } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CleanInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
}

const CleanInput = forwardRef<HTMLInputElement, CleanInputProps>(
  ({ className, label, error, success, helperText, ...props }, ref) => {
    const hasError = !!error;
    const hasSuccess = !!success;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-800 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            className={cn(
              "input-clean w-full",
              hasError && "border-red-500 focus:border-red-500 focus:ring-red-500",
              hasSuccess && "border-green-500 focus:border-green-500 focus:ring-green-500",
              className
            )}
            ref={ref}
            {...props}
          />
          {hasError && (
            <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
          )}
          {hasSuccess && (
            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </p>
        )}
        {success && (
          <p className="mt-1 text-sm text-green-600 flex items-center">
            <CheckCircle className="h-4 w-4 mr-1" />
            {success}
          </p>
        )}
        {helperText && !error && !success && (
          <p className="mt-1 text-sm text-gray-600">{helperText}</p>
        )}
      </div>
    );
  }
);

CleanInput.displayName = "CleanInput";

export { CleanInput };
