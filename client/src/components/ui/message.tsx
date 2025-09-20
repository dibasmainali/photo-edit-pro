import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MessageProps {
  type: "error" | "success" | "warning" | "info";
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const Message = ({ type, title, children, onClose, className }: MessageProps) => {
  const icons = {
    error: AlertCircle,
    success: CheckCircle,
    warning: AlertTriangle,
    info: Info
  };

  const styles = {
    error: "error-message",
    success: "success-message", 
    warning: "warning-message",
    info: "bg-blue-50 border-blue-200 text-blue-800"
  };

  const Icon = icons[type];

  return (
    <div className={cn(styles[type], className)}>
      <Icon className="h-4 w-4 flex-shrink-0" />
      <div className="flex-1">
        {title && <p className="font-medium">{title}</p>}
        <div className={title ? "mt-1" : ""}>{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-2 hover:opacity-70 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export { Message };
