import { Loader2 } from "lucide-react";

interface GlobalLoadingProps {
  isLoading: boolean;
  message?: string;
}

export default function GlobalLoading({ isLoading, message = "Loading..." }: GlobalLoadingProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm animate-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-800 text-center max-w-sm mx-4">
        <div className="relative w-12 h-12 mx-auto mb-4">
          <Loader2 className="w-full h-full text-red-500 animate-spin" aria-hidden="true" />
        </div>
        <p className="text-gray-900 dark:text-white font-medium text-lg">{message}</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Please wait...</p>
      </div>
    </div>
  );
}