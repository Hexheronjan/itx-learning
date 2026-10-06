"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, LucideIcon } from "lucide-react";
import { clsx } from "clsx";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
  icon?: LucideIcon;
  showPasswordToggle?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      icon: Icon,
      type = "text",
      showPasswordToggle = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const isPasswordType = showPasswordToggle || type === "password";
    const actualType = isPasswordType ? (showPassword ? "text" : "password") : type;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
            {label}
          </label>
        )}

        <motion.div
          animate={{
            boxShadow: error
              ? "0 0 0 1.5px var(--error), 0 0 12px rgba(239, 68, 68, 0.15)"
              : focused
              ? "0 0 0 1.5px rgba(var(--brand-rgb), 0.55), 0 0 20px rgba(var(--brand-rgb), 0.15)"
              : "0 0 0 1px var(--border)",
          }}
          transition={{ duration: 0.2 }}
          className="relative rounded-xl overflow-hidden"
          style={{ background: "var(--surface2)" }}
        >
          {Icon && (
            <div
              className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 pointer-events-none"
              style={{ color: focused ? "var(--brand)" : "var(--text-muted)" }}
            >
              <Icon size={18} />
            </div>
          )}

          <input
            ref={ref}
            type={actualType}
            disabled={disabled}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={clsx(
              "w-full py-3.5 bg-transparent outline-none text-sm placeholder:text-dim transition-all",
              Icon ? "pl-11" : "pl-4",
              isPasswordType ? "pr-11" : "pr-4",
              disabled && "opacity-50 cursor-not-allowed",
              className
            )}
            style={{ color: "var(--text)" }}
            {...props}
          />

          {isPasswordType && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors p-1"
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </motion.div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-medium text-error mt-1"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
