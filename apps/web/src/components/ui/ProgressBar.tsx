"use client";

import React from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";

export interface ProgressBarProps {
  progress: number; // 0 to 100
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  className,
  size = "md",
}) => {
  const heightClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-3.5",
  };

  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div
      className={clsx("w-full rounded-full overflow-hidden", heightClasses[size], className)}
      style={{ background: "var(--surface3)" }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${clampedProgress}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{
          background: "linear-gradient(90deg, var(--brand), var(--brand-light))",
        }}
      />
    </div>
  );
};
