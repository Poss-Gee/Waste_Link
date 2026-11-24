"use client";

import React, { useState } from "react";
import { useWasteApp } from "@/context/WasteAppContext";
import { 
  Users, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  ChevronDown, 
  Sparkles,
  Info,
  CheckCircle2
} from "lucide-react";
import ConfirmDialog from "@/components/common/ConfirmDialog";

export default function DemoBanner() {
  const {
    currentUser,
    currentRole,
    switchRole,
    switchUserById,
    households,
    collectors,
    admin,
    resetAllDemoData,
    isOfflineSimulated,
    toggleOfflineSimulation,
    offlineQueue,
    syncOfflineQueue,
    isSyncing,
  } = useWasteApp();

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetNotice, setResetNotice] = useState(false);

  const handleReset = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    setShowResetConfirm(false);
    resetAllDemoData();
    setResetNotice(true);
    setTimeout(() => setResetNotice(false), 3000);
  };

  return (
    <>
      <aside aria-label="Prototype Evaluator Control Bar" className="bg-[#14532D] text-white text-xs border-b border-[#0e3b20] z-50 relative shadow-md">
        <div className="max-w-7xl mx-auto px-3 py-2 flex flex-wrap items-center justify-between gap-2">
          
          {/* Brand & Badge */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 font-bold tracking-tight text-white text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              WasteLink Ghana
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-900/80 text-emerald-200 text-[11px] font-medium border border-emerald-700/50">
              Interactive Prototype
            </span>
          </div>

          {/* Role Switcher Pills */}
          <div className="flex items-center bg-black/20 p-1 rounded-lg border border-white/10 gap-1">
            <button
              onClick={() => switchRole("household")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
                currentRole === "household"
                  ? "bg-white text-[#14532D] shadow-sm font-semibold"
                  : "text-emerald-100 hover:bg-white/10"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Household</span>
            </button>

            <button
              onClick={() => switchRole("collector")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
                currentRole === "collector"
                  ? "bg-white text-[#14532D] shadow-sm font-semibold"
                  : "text-emerald-100 hover:bg-white/10"
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Collector</span>
              {currentRole === "collector" && (
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              )}
            </button>

            <button
              onClick={() => switchRole("admin")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
                currentRole === "admin"
                  ? "bg-white text-[#14532D] shadow-sm font-semibold"
                  : "text-emerald-100 hover:bg-white/10"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>

          {/* Quick Active User Switcher & Tools */}
          <div className="flex items-center gap-2">
            
            {/* Active User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-2 py-1 rounded border border-white/10 transition-colors"
              >
                <div className="w-5 h-5 rounded-full overflow-hidden bg-emerald-700 flex-shrink-0">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-[10px]">
                      {currentUser.name.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="max-w-[110px] truncate font-medium text-emerald-100">
                  {currentUser.name}
                </span>
                <ChevronDown className="w-3 h-3 text-emerald-300" />
              </button>

              {/* User selection menu */}
              {showUserDropdown && (
                <div 
                  className="absolute right-0 mt-1 w-64 bg-white text-[#17231B] rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setShowUserDropdown(false)}
                >
                  <div className="px-3 py-1 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    Switch Test Account
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto py-1">
                    <div className="px-3 py-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50">
                      Households
                    </div>
                    {households.slice(0, 5).map((h) => (
                      <button
                        key={h.id}
                        onClick={() => {
                          switchUserById(h.id);
                          setShowUserDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-gray-100 text-xs ${
                          currentUser.id === h.id ? "bg-emerald-50/80 font-bold text-emerald-800" : ""
                        }`}
                      >
                        <span className="truncate">{h.name}</span>
                        <span className="text-[10px] text-gray-400">{h.area}</span>
                      </button>
                    ))}

                    <div className="px-3 py-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 mt-1">
                      Collectors (Tricycles)
                    </div>
                    {collectors.slice(0, 5).map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          switchUserById(c.id);
                          setShowUserDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-gray-100 text-xs ${
                          currentUser.id === c.id ? "bg-emerald-50/80 font-bold text-emerald-800" : ""
                        }`}
                      >
                        <span className="truncate">{c.name.split(" ")[0]} ({c.tricycleModel.split(" ")[0]})</span>
                        <span className="text-[10px] text-gray-400">
                          {c.isVerified ? "✓ Verified" : "⏳ Pending"}
                        </span>
                      </button>
                    ))}

                    <div className="px-3 py-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 mt-1">
                      Platform Admin
                    </div>
                    <button
                      onClick={() => {
                        switchUserById(admin.id);
                        setShowUserDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-gray-100 text-xs ${
                        currentUser.id === admin.id ? "bg-emerald-50/80 font-bold text-emerald-800" : ""
                      }`}
                    >
                      <span>{admin.name}</span>
                      <span className="text-[10px] text-gray-400">Chief Coordinator</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Offline Simulation Button */}
            <button
              onClick={toggleOfflineSimulation}
              title={isOfflineSimulated ? "Switch back to Online" : "Simulate Offline PWA Mode"}
              className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                isOfflineSimulated
                  ? "bg-amber-500 text-black font-bold animate-pulse"
                  : "bg-white/10 hover:bg-white/20 text-emerald-200"
              }`}
            >
              {isOfflineSimulated ? (
                <>
                  <WifiOff className="w-3.5 h-3.5" />
                  <span>Offline Active</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Online</span>
                </>
              )}
            </button>

            {/* Offline Queue Badge & Sync button */}
            {offlineQueue.length > 0 && (
              <button
                onClick={syncOfflineQueue}
                disabled={isSyncing}
                className="flex items-center gap-1 px-2 py-1 rounded bg-amber-400 text-black font-semibold hover:bg-amber-300"
                title="Synchronize queued offline actions"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} />
                <span>Sync ({offlineQueue.length})</span>
              </button>
            )}

            {/* Reset Data */}
            <button
              onClick={handleReset}
              title="Reset all mock data to fresh prototype state"
              className="flex items-center gap-1 bg-white/10 hover:bg-red-500/80 text-white px-2 py-1 rounded transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden lg:inline">Reset Data</span>
            </button>

            {/* Guide Info */}
            <button
              onClick={() => setShowHelpModal(true)}
              title="View Evaluator Scenario & Roles Guide"
              className="p-1 rounded bg-white/10 hover:bg-white/20 text-emerald-200"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Reset Notification banner */}
        {resetNotice && (
          <div className="bg-emerald-600 text-white text-center py-1 text-xs font-semibold flex items-center justify-center gap-1.5 animate-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Prototype state reset to clean Ghanaian sample dataset!
          </div>
        )}
      </aside>

      {/* Evaluator Guide Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-200 text-[#17231B] animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">WasteLink Ghana Evaluator Guide</h3>
                  <p className="text-xs text-gray-500">Step-by-step walkthrough for academic demonstration</p>
                </div>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs text-gray-600 max-h-[70vh] overflow-y-auto pr-1">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-900">
                <p className="font-semibold text-emerald-950 mb-1">🎯 Complete End-to-End Test Workflow:</p>
                <ol className="list-decimal pl-4 space-y-1">
                  <li><strong>Household:</strong> Switch to Household. View active negotiation for Request #req-101. Propose counteroffer or accept Kofi Mensah&apos;s GH₵55 proposal!</li>
                  <li><strong>Collector:</strong> Switch to Collector. View &quot;Accepted Jobs&quot; or &quot;Incoming Requests&quot;. Propose a price in GH₵ or update collection progress (En Route &rarr; Arrived &rarr; Completed).</li>
                  <li><strong>Payment:</strong> Switch back to Household to pay Request #req-104 via cash or Mobile Money (MTN MoMo simulation). Instant printable receipt is generated!</li>
                  <li><strong>Admin:</strong> Switch to Admin dashboard to verify collector Emmanuel Osei, monitor transactions, and inspect dispute resolutions.</li>
                  <li><strong>Offline PWA:</strong> Toggle &quot;Offline Active&quot; in the top bar. Mark an action as collector; observe queued status. Turn online and click &quot;Sync&quot;!</li>
                </ol>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[11px]">
                <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="font-bold text-gray-800 flex items-center gap-1 mb-1">
                    <Users className="w-3.5 h-3.5 text-emerald-600" /> Household
                  </div>
                  <p className="text-gray-500">Akosua Mensah (East Legon), Kwame Osei (Madina), + 8 more accounts.</p>
                </div>

                <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="font-bold text-gray-800 flex items-center gap-1 mb-1">
                    <Truck className="w-3.5 h-3.5 text-emerald-600" /> Collector
                  </div>
                  <p className="text-gray-500">Kofi Mensah (Speedy Kofi), Kwesi Appiah, Ibrahim Tanko + 5 more.</p>
                </div>

                <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="font-bold text-gray-800 flex items-center gap-1 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Admin
                  </div>
                  <p className="text-gray-500">Dr. Kwabena Asare (Chief Platform Coordinator).</p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 bg-[#14532D] text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-colors"
              >
                Close & Continue Exploring
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog
        isOpen={showResetConfirm}
        title="Reset Prototype Data?"
        description="This will restore all households, collectors, collection requests, negotiations, and receipts back to the initial Ghanaian sample dataset."
        confirmLabel="Reset Data"
        cancelLabel="Keep Changes"
        variant="danger"
        onConfirm={confirmReset}
        onCancel={() => setShowResetConfirm(false)}
      />
    </>
  );
}

