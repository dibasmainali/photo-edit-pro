import * as React from "react";

export interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement> {}

export function Separator({ className = "my-6 border-border", ...props }: SeparatorProps) {
  return <hr className={`border-t ${className}`} {...props} />;
}

export default Separator;


