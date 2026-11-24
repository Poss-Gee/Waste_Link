"use client";

import React, { useState } from "react";
import { useWasteApp } from "@/context/WasteAppContext";
import { UserRole } from "@/types";
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Users,
  Truck,
  ShieldCheck,
  Globe,
  UserPlus,
  Play,
  Wifi,
  WifiOff,
  RefreshCw,
  RotateCcw,
  LayoutDashboard,
  X,
} from "lucide-react";
import ConfirmDialog from "@/components/common/ConfirmDialog";

interface DemoDeveloperToolbarProps {
  isLandingMode: boolean;
  isAuthMode: boolean;
  onSelectView: (view: "dashboard" | "landing" | "auth") => void;
  onReplayIntro: () => void;
}

export default function DemoDeveloperToolbar({
  isLandingMode,
  isAuthMode,
  onSelectView,
  onReplayIntro,
}: DemoDeveloperToolbarProps) {
  const {
    currentRole,
    switchRole,
    isOfflineSimulated,
    toggleOfflineSimulation,
    offlineQueue,
    syncOfflineQueue,
    isSyncing,
    resetAllDemoData,
  } = useWasteApp();

  const [isOpen, setIsOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role);
    onSelectView("dashboard");
  };

  return (
    <>
      <div className="fixed bottom-20 lg:bottom-5 left-4 z-40">
        {!isOpen ? (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#123B66] text-white text-xs font-semibold shadow-floating border border-[#2563EB]/40 hover:bg-[#1E40AF] transition-all"
            aria-expanded="false"
            aria-label="Open Demo and Developer Controls"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#93C5FD]" />
            <span>Demo Controls</span>
            {offlineQueue.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#2563EB] text-[10px] font-bold">
                {offlineQueue.length}
              </span>
            )}
            <ChevronUp className="w-3.5 h-3.5 text-[#93C5FD]" />
          </button>
        ) : (
          <div className="w-[min(22rem,calc(100vw-2rem))] bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden animate-in fade-in slide-in-from-bottom-2">
            {/* Header */}
            <div className="bg-[#123B66] text-white px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#93C5FD]" />
                <span className="text-xs font-bold tracking-tight">Demo &amp; Developer Toolbar</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Collapse Demo Toolbar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4 text-xs">
              {/* Role Preview */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-1.5">
                  Role Preview
                </span>
                <div className="grid grid-cols-3 gap-1.5 bg-[#F5F8FC] p-1 rounded-xl border border-[#E2E8F0]">
                  {(
                    [
                      { id: "household", label: "Household", Icon: Users },
                      { id: "collector", label: "Collector", Icon: Truck },
                      { id: "admin", label: "Admin", Icon: ShieldCheck },
                    ] as const
                  ).map(({ id, label, Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleRoleSwitch(id)}
                      className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg font-semibold transition-all ${
                        currentRole === id && !isLandingMode && !isAuthMode
                          ? "bg-[#2563EB] text-white shadow-xs"
                          : "text-[#172B43] hover:bg-white"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Platform View & Intro */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-1.5">
                  Platform Views
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => onSelectView("dashboard")}
                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl border font-semibold transition-colors ${
                      !isLandingMode && !isAuthMode
                        ? "bg-[#DBEAFE] text-[#123B66] border-[#2563EB]"
                        : "bg-white text-[#172B43] border-[#E2E8F0] hover:bg-[#F5F8FC]"
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>App Dashboard</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectView("landing")}
                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl border font-semibold transition-colors ${
                      isLandingMode
                        ? "bg-[#DBEAFE] text-[#123B66] border-[#2563EB]"
                        : "bg-white text-[#172B43] border-[#E2E8F0] hover:bg-[#F5F8FC]"
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Public Landing</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectView("auth")}
                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl border font-semibold transition-colors ${
                      isAuthMode
                        ? "bg-[#DBEAFE] text-[#123B66] border-[#2563EB]"
                        : "bg-white text-[#172B43] border-[#E2E8F0] hover:bg-[#F5F8FC]"
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Sign Up / Login</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      onReplayIntro();
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl border border-[#E2E8F0] bg-white text-[#172B43] font-semibold hover:bg-[#F5F8FC] transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Replay Intro</span>
                  </button>
                </div>
              </div>

              {/* Connectivity & Data Reset */}
              <div className="pt-2 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={toggleOfflineSimulation}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold border transition-colors ${
                    isOfflineSimulated
                      ? "bg-amber-50 text-amber-800 border-amber-300"
                      : "bg-[#F5F8FC] text-[#123B66] border-[#E2E8F0] hover:bg-[#DBEAFE]"
                  }`}
                >
                  {isOfflineSimulated ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
                  <span>{isOfflineSimulated ? "Offline Mode" : "Online"}</span>
                </button>

                {offlineQueue.length > 0 && (
                  <button
                    type="button"
                    onClick={syncOfflineQueue}
                    disabled={isSyncing}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#2563EB] text-white font-semibold hover:bg-[#1D4ED8] disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                    <span>Sync ({offlineQueue.length})</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-semibold hover:bg-rose-100 transition-colors ml-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Data</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showResetConfirm}
        title="Reset Prototype Data?"
        description="This will restore all households, collectors, collection requests, negotiations, and receipts back to the initial Ghanaian sample dataset."
        confirmLabel="Reset Data"
        cancelLabel="Keep Changes"
        variant="danger"
        onConfirm={() => {
          setShowResetConfirm(false);
          resetAllDemoData();
        }}
        onCancel={() => setShowResetConfirm(false)}
      />
    </>
  );
}

