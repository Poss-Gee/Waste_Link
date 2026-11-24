"use client";

import React from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

const TOAST_STYLES: Record<ToastType, string> = {
  success: "bg-[#14532D] text-white border-[#16A34A]",
  error: "bg-rose-700 text-white border-rose-500",
  warning: "bg-amber-500 text-[#17231B] border-amber-600",
  info: "bg-slate-800 text-white border-slate-600",
};

const TOAST_ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />,
  error: <AlertCircle className="w-4 h-4 text-rose-200 flex-shrink-0" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-950 flex-shrink-0" />,
  info: <Info className="w-4 h-4 text-sky-300 flex-shrink-0" />,
};

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-20 lg:bottom-6 right-4 z-[90] flex flex-col gap-2 max-w-sm w-[calc(100%-2rem)] pointer-events-none"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl border shadow-lg text-xs font-semibold transition-all animate-in slide-in-from-bottom-3 fade-in ${TOAST_STYLES[toast.type]}`}
        >
          <div className="flex items-center gap-2.5">
            {TOAST_ICONS[toast.type]}
            <span className="leading-snug">{toast.message}</span>
          </div>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss notification"
            className="p-1 rounded-lg hover:bg-black/15 transition-colors flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

