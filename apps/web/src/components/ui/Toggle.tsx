"use client";

import React from "react";
import { motion } from "framer-motion";

export interface ToggleProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
}) => {
  return (
    <label className={`inline-flex items-center gap-3 cursor-pointer ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <div
        className="w-12 h-6 rounded-full relative transition-colors duration-300 p-0.5"
        style={{
          background: checked ? "var(--brand)" : "var(--surface3)",
          border: `1px solid ${checked ? "var(--brand)" : "var(--border)"}`,
        }}
      >
        <motion.div
          className="w-5 h-5 rounded-full bg-white shadow-md"
          animate={{ x: checked ? 24 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
      {label && <span className="text-sm font-medium text-text">{label}</span>}
    </label>
  );
};
