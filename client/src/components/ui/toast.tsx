import * as React from "react";

export type ToastProps = {
  id?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
};

export type ToastActionElement = React.ReactNode;

export function Toast({ title, description, action }: ToastProps) {
  return (
    <div className="rounded-md border bg-card text-foreground p-3 shadow-md flex items-start gap-3">
      <div className="flex-1">
        {title && <div className="font-medium">{title}</div>}
        {description && <div className="text-sm text-muted-foreground">{description}</div>}
      </div>
      {action}
    </div>
  );
}

export function ToastActionButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="text-sm px-2 py-1 rounded bg-primary text-white">
      {children}
    </button>
  );
}


