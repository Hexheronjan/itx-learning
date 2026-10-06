"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { clsx } from "clsx";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  danger?: boolean;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  danger = false,
  className,
  children,
  style,
  ...props
}) => {
  return (
    <div
      className={clsx("rounded-2xl p-6 transition-all duration-200", className)}
      style={{
        background: "var(--surface)",
        border: danger ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid var(--border)",
        boxShadow: danger ? "none" : "0 4px 20px rgba(0,0,0,0.15)",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export interface GlowCardProps extends HTMLMotionProps<"div"> {
  gradient?: boolean;
  children: React.ReactNode;
}

export const GlowCard: React.FC<GlowCardProps> = ({
  gradient = true,
  className,
  children,
  style,
  ...props
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      className={clsx(
        "relative group cursor-pointer overflow-hidden rounded-2xl p-6 transition-all duration-300",
        className
      )}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        ...style,
      }}
      {...props}
    >
      {gradient && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: "radial-gradient(circle at top left, rgba(var(--brand-rgb), 0.12), transparent 65%)",
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
