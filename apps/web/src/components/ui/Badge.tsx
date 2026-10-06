import React from "react";
import { clsx } from "clsx";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "brand" | "accent" | "error" | "neutral" | "success";
  size?: "sm" | "md";
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "brand",
  size = "md",
  className,
  children,
  ...props
}) => {
  const getStyles = () => {
    switch (variant) {
      case "brand":
        return {
          background: "rgba(var(--brand-rgb), 0.12)",
          color: "var(--brand)",
          border: "1px solid var(--border)",
        };
      case "accent":
        return {
          background: "rgba(245, 158, 11, 0.12)",
          color: "var(--accent)",
          border: "1px solid rgba(245, 158, 11, 0.25)",
        };
      case "error":
        return {
          background: "rgba(248, 113, 113, 0.15)",
          color: "var(--error)",
          border: "1px solid rgba(248, 113, 113, 0.25)",
        };
      case "success":
        return {
          background: "rgba(74, 222, 128, 0.15)",
          color: "var(--success)",
          border: "1px solid rgba(74, 222, 128, 0.25)",
        };
      case "neutral":
        return {
          background: "var(--surface3)",
          color: "var(--text-muted)",
          border: "1px solid var(--border)",
        };
    }
  };

  const sizeClasses = {
    sm: "text-[9px] px-2 py-0.5",
    md: "text-[10px] px-2.5 py-0.5",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 font-bold uppercase tracking-wider rounded-full select-none",
        sizeClasses[size],
        className
      )}
      style={getStyles()}
      {...props}
    >
      {children}
    </span>
  );
};
