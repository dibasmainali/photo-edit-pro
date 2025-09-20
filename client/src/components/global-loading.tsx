import { Loader2 } from "lucide-react";

interface GlobalLoadingProps {
  isLoading: boolean;
  message?: string;
}

export default function GlobalLoading({ isLoading, message = "Loading..." }: GlobalLoadingProps) {
  if (!isLoading) return null;

  return (
    <div className="global-loading">
      <div className="global-loading-content">
        <Loader2 className="w-8 h-8 text-red-500 loading-spinner mx-auto mb-4" />
        <p className="text-gray-800 font-medium">{message}</p>
        <p className="text-gray-600 text-sm mt-2">Please wait...</p>
      </div>
    </div>
  );
}
