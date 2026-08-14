import type { CSSProperties, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: "div" | "section" | "article" | "ul" | "span";
};

/** White or gray inset panel — Henry's contentInner / border-field look. */
export function OsInset({ children, className, style, as: Tag = "div" }: Props) {
  return (
    <Tag className={`os-inset${className ? ` ${className}` : ""}`} style={style}>
      <div className="os-inset__body">{children}</div>
    </Tag>
  );
}

/** Flat white reading surface inside a window. */
export function OsPanel({ children, className, style }: Omit<Props, "as">) {
  return (
    <div className={`os-panel${className ? ` ${className}` : ""}`} style={style}>
      {children}
    </div>
  );
}
