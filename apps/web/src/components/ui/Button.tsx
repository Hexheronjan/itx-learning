"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { clsx } from "clsx";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "dangerGhost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  ...props
}) => {
  const sizeClasses = {
    sm: "px-3.5 py-1.5 text-xs rounded-lg gap-1.5",
    md: "px-5 py-2.5 text-sm rounded-xl gap-2",
    lg: "px-7 py-3 text-base rounded-xl gap-2.5",
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          background: "linear-gradient(135deg, var(--brand), var(--brand-light))",
          color: "var(--bg)",
          boxShadow: "0 4px 20px rgba(var(--brand-rgb), 0.25)",
        };
      case "secondary":
        return {
          background: "var(--surface3)",
          border: "1px solid var(--border)",
          color: "var(--text)",
        };
      case "ghost":
        return {
          background: "transparent",
          color: "var(--text-muted)",
        };
      case "danger":
        return {
          background: "var(--error)",
          color: "#ffffff",
          boxShadow: "0 4px 20px rgba(239, 68, 68, 0.25)",
        };
      case "dangerGhost":
        return {
          background: "transparent",
          color: "var(--error)",
        };
    }
  };

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.98 } : undefined}
      disabled={disabled || loading}
      className={clsx(
        "inline-flex items-center justify-center font-medium transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none",
        sizeClasses[size],
        className
      )}
      style={getVariantStyles()}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin w-4 h-4" />
          <span>Memproses...</span>
        </>
      ) : (
        children
      )}
    </motion.button>
  );
};
