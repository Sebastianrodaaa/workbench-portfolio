import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  compact?: boolean;
};

/** Raised gray control — matches Henry's site-button / window chrome buttons. */
export function OsButton({ children, compact, className, ...props }: Props) {
  return (
    <button
      type="button"
      className={`os-button${compact ? " os-button--compact" : ""}${
        className ? ` ${className}` : ""
      }`}
      {...props}
    >
      <span className="os-button__inner">{children}</span>
    </button>
  );
}
