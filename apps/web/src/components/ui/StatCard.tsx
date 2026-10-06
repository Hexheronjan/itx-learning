"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { clsx } from "clsx";

const AnimatedCounter: React.FC<{ value: number | string; suffix?: string }> = ({
  value,
  suffix = "",
}) => {
  const [count, setCount] = useState(0);
  const num = typeof value === "number" ? value : parseInt(value) || 0;

  useEffect(() => {
    const duration = 1200;
    const steps = 25;
    const increment = num / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= num) {
        setCount(num);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [num]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

export interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  suffix?: string;
  subtext?: string;
  trend?: number;
  delay?: number;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  suffix = "",
  subtext,
  trend,
  delay = 0,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={clsx("relative group", className)}
    >
      <div
        className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-sm pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(var(--brand-rgb), 0.2), transparent)",
        }}
      />
      <div
        className="relative p-6 rounded-2xl transition-all duration-300"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}
      >
        <div className="flex items-start justify-between">
          <div
            className="p-3 rounded-xl"
            style={{
              background: "linear-gradient(135deg, rgba(var(--brand-rgb), 0.15), rgba(var(--brand-rgb), 0.05))",
              border: "1px solid var(--border)",
            }}
          >
            <Icon size={20} style={{ color: "var(--brand)" }} />
          </div>

          {trend !== undefined && (
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: trend >= 0 ? "rgba(var(--brand-rgb), 0.15)" : "rgba(248, 113, 113, 0.15)",
                color: trend >= 0 ? "var(--brand)" : "var(--error)",
                border: `1px solid ${trend >= 0 ? "var(--border)" : "rgba(248, 113, 113, 0.3)"}`,
              }}
            >
              {trend >= 0 ? "+" : ""}
              {trend}%
            </span>
          )}
        </div>

        <div className="mt-4">
          <h3
            className="text-2xl font-bold font-serif"
            style={{ color: "var(--text)" }}
          >
            <AnimatedCounter value={value} suffix={suffix} />
          </h3>
          <p className="text-xs font-medium mt-1 text-muted">{label}</p>
          {subtext && <p className="text-[11px] mt-0.5 text-dim">{subtext}</p>}
        </div>
      </div>
    </motion.div>
  );
};
