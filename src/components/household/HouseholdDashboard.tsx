"use client";

import React, { useState } from "react";
import { useWasteApp } from "@/context/WasteAppContext";
import { HouseholdUser, CollectionRequest } from "@/types";
import {
  PlusCircle,
  Truck,
  Clock,
  CheckCircle2,
  DollarSign,
  ChevronRight,
  MapPin,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Star,
  Activity,
  Calendar,
} from "lucide-react";
import ReceiptModal from "@/components/common/ReceiptModal";

interface HouseholdDashboardProps {
  onNavigate: (tab: string, requestId?: string) => void;
}

export default function HouseholdDashboard({ onNavigate }: HouseholdDashboardProps) {
  const { currentUser, requests, collectors } = useWasteApp();
  const household = currentUser as HouseholdUser;
  const [selectedReceiptReq, setSelectedReceiptReq] = useState<CollectionRequest | null>(null);

  // Filter requests for this household
  const myRequests = requests.filter((r) => r.householdId === household.id);
  
  // Active request (negotiating, agreed, en route, in progress, or completed waiting for payment)
  const activeRequest = myRequests.find(
    (r) => r.status !== "paid" && r.status !== "cancelled"
  );

  // Recent completed requests
  const completedRequests = myRequests
    .filter((r) => r.status === "paid")
    .slice(0, 4);

  // Available nearby verified collectors
  const nearbyCollectors = collectors
    .filter((c) => c.isOnline && c.isVerified)
    .slice(0, 3);

  const totalSpent = myRequests
    .filter((r) => r.status === "paid")
    .reduce((sum, r) => sum + (r.agreedPrice || r.initialEstimatedPrice || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#14532D] via-[#166534] to-[#15803D] rounded-2xl p-6 sm:p-8 text-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle decorative leaf pattern */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-12 translate-y-12">
          <Truck className="w-80 h-80 text-white" />
        </div>

        <div className="space-y-2 max-w-xl z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-xs">
            <MapPin className="w-3.5 h-3.5 text-emerald-300" />
            {household.area || "Accra"}, Greater Accra
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Welcome back, {household.name.split(" ")[0]}!
          </h1>
          <p className="text-sm text-emerald-100 leading-relaxed">
            Need rubbish collected today? Request a verified local tricycle rider, negotiate your price transparently, and pay safely upon completion.
          </p>
        </div>

        <div className="z-10 flex-shrink-0 w-full sm:w-auto">
          <button
            onClick={() => onNavigate("request")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-[#14532D] font-bold rounded-xl shadow-lg hover:bg-emerald-50 transition-all transform hover:scale-[1.02] active:scale-[0.98] text-sm"
          >
            <PlusCircle className="w-5 h-5 text-[#16A34A]" />
            Request Rubbish Collection
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Total Pickups</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-gray-900">{myRequests.length}</div>
          <span className="text-[11px] text-gray-400">All-time bookings</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Completed</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-700">
            {myRequests.filter((r) => r.status === "paid").length}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">100% verified disposed</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Total Invested</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-gray-900">GH₵ {totalSpent.toFixed(0)}</div>
          <span className="text-[11px] text-gray-400">Direct to local collectors</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Active Requests</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-amber-600">
            {activeRequest ? "1 Active" : "0 Active"}
          </div>
          <span className="text-[11px] text-gray-400">On-demand workflow</span>
        </div>
      </div>

      {/* ACTIVE JOB TRACKER CARD (if any) */}
      {activeRequest && (
        <div className="bg-white rounded-2xl p-6 border-2 border-emerald-600 shadow-card animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Active Collection &bull; #{activeRequest.id}
              </span>
            </div>
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-[#14532D]">
              <span className="capitalize">{activeRequest.status.replace(/_/g, " ")}</span>
            </div>
          </div>

          <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div>
              <p className="text-xs text-gray-500">Waste Category &amp; Quantity</p>
              <h4 className="text-base font-bold text-gray-900 mt-0.5">{activeRequest.wasteCategory}</h4>
              <p className="text-xs text-gray-600 mt-0.5">{activeRequest.quantity}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Assigned Collector</p>
              <div className="flex items-center gap-2 mt-1">
                {activeRequest.collectorName ? (
                  <>
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-emerald-100">
                      <img
                        src={activeRequest.collectorAvatar || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100"}
                        alt={activeRequest.collectorName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{activeRequest.collectorName}</h4>
                      <p className="text-[11px] text-gray-500">{activeRequest.collectorTricycle || "Verified Tricycle"}</p>
                    </div>
                  </>
                ) : (
                  <span className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded font-medium">
                    Waiting for collector price proposal...
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-3">
              <div className="text-left sm:text-right">
                <span className="text-[11px] text-gray-500 block">Agreed / Proposed Price</span>
                <span className="text-xl font-black text-[#14532D]">
                  GH₵ {activeRequest.agreedPrice || activeRequest.initialEstimatedPrice || 45}
                </span>
              </div>
              <button
                onClick={() => onNavigate("tracking", activeRequest.id)}
                className="w-full sm:w-auto px-4 py-2.5 bg-[#14532D] text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Open Live Tracker &amp; Chat</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Nearby Collectors & Recent History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Nearby Available Collectors */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-600" />
              Available Nearby Tricycles
            </h3>
            <button
              onClick={() => onNavigate("nearby")}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-0.5"
            >
              View all ({collectors.filter((c) => c.isOnline).length})
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {nearbyCollectors.map((col) => (
              <div
                key={col.id}
                className="p-3 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all card-hover space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-emerald-100 flex-shrink-0">
                      <img src={col.avatar} alt={col.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <h4 className="text-xs font-bold text-gray-900 truncate max-w-[130px]">
                          {col.name}
                        </h4>
                        {col.isVerified && (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-[10px] text-gray-500">{col.tricycleModel}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500 justify-end">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{col.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-[10px] text-gray-400">{col.completedJobs} pickups</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-gray-50 text-[11px]">
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Online in {col.operatingAreas[0]}
                  </span>
                  <button
                    onClick={() => onNavigate("request")}
                    className="font-semibold text-[#14532D] hover:underline"
                  >
                    Request &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-900">
            <p className="font-semibold text-emerald-950 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Verified Operators Only
            </p>
            <p className="text-[11px] text-emerald-800/90 mt-0.5">
              Every tricycle rider carries an active National Ghana Card and verified Accra Municipal permit.
            </p>
          </div>
        </div>

        {/* Recent Collections History */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600" />
              Recent Collection History
            </h3>
            <button
              onClick={() => onNavigate("history")}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-0.5"
            >
              View Full History ({myRequests.length})
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {completedRequests.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-xs">
              No completed pickups yet. Click &quot;Request Rubbish Collection&quot; above to get started!
            </div>
          ) : (
            <div className="space-y-3">
              {completedRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-gray-500">#{req.id}</span>
                      <span className="text-xs font-bold text-gray-900">{req.wasteCategory}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Paid &bull; Disposed
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 flex flex-wrap items-center gap-2">
                      <span>Collector: <strong>{req.collectorName || "Independent Rider"}</strong></span>
                      <span>&bull;</span>
                      <span>{req.area}</span>
                      <span>&bull;</span>
                      <span>{new Date(req.createdAt).toLocaleDateString("en-GB")}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <span className="text-xs font-bold text-[#14532D] block">
                        GH₵ {(req.agreedPrice || req.initialEstimatedPrice || 45).toFixed(2)}
                      </span>
                      <span className="text-[10px] text-gray-400 capitalize">
                        {req.paymentMethod === "momo" ? "MTN MoMo" : "Cash"}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedReceiptReq(req)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-emerald-50 hover:text-emerald-800 text-gray-700 rounded-lg text-xs font-medium transition-colors"
                    >
                      Receipt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>All collections include eco-friendly disposal certification.</span>
            <button
              onClick={() => onNavigate("complaints")}
              className="text-emerald-700 font-semibold hover:underline"
            >
              Report an Issue
            </button>
          </div>
        </div>

      </div>

      {/* Printable Receipt Modal */}
      {selectedReceiptReq && (
        <ReceiptModal
          request={selectedReceiptReq}
          onClose={() => setSelectedReceiptReq(null)}
        />
      )}

    </div>
  );
}
