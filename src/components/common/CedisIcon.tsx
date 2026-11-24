import React from "react";

interface CedisIconProps {
  className?: string;
}

export default function CedisIcon({ className = "w-5 h-5" }: CedisIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* C curve of Ghana Cedis (₵) */}
      <path d="M16.5 7.5A5.5 5.5 0 1 0 16.5 16.5" />
      {/* Vertical strike-through bar */}
      <line x1="12.5" y1="3.5" x2="12.5" y2="20.5" />
    </svg>
  );
}

