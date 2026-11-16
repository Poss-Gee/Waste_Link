"use client";

import React, { useState } from "react";
import { useWasteApp } from "@/context/WasteAppContext";
import { CollectionRequest } from "@/types";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Printer,
  Search,
  Filter,
  Star,
  MapPin,
  Calendar,
} from "lucide-react";
import ReceiptModal from "@/components/common/ReceiptModal";

interface HouseholdHistoryViewProps {
  onOpenTracker: (requestId: string) => void;
}

export default function HouseholdHistoryView({ onOpenTracker }: HouseholdHistoryViewProps) {
  const { currentUser, requests } = useWasteApp();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState<CollectionRequest | null>(null);

  const myRequests = requests.filter((r) => r.householdId === currentUser.id);

  const filtered = myRequests.filter((req) => {
    const matchesSearch =
      req.wasteCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.collectorName && req.collectorName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      req.area.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && req.status !== "paid" && req.status !== "cancelled") ||
      (statusFilter === "completed" && req.status === "paid") ||
      (statusFilter === "cancelled" && req.status === "cancelled");

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Household Collection History</h2>
          <p className="text-xs text-gray-500 mt-1">
            Complete record of your past and ongoing on-demand rubbish collections, negotiated fees, and digital receipts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, waste type, or collector..."
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            {(["all", "active", "completed", "cancelled"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`text-xs px-3 py-2 rounded-xl capitalize font-semibold transition-all ${
                  statusFilter === st
                    ? "bg-[#14532D] text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History Items */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-gray-500 text-xs border border-gray-200">
          No collection records matching current filter.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((req) => {
            const isCompleted = req.status === "paid";
            const isCancelled = req.status === "cancelled";
            const isActive = !isCompleted && !isCancelled;

            return (
              <div
                key={req.id}
                className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs hover:border-emerald-200 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-gray-600">#{req.id}</span>
                    <span className="text-xs font-bold text-gray-900">{req.wasteCategory}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isCompleted
                          ? "bg-emerald-100 text-emerald-800"
                          : isCancelled
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {req.status.replace(/_/g, " ").toUpperCase()}
                    </span>
                  </div>

                  <span className="text-xs text-gray-400">
                    {new Date(req.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-600">
                  <div>
                    <span className="text-gray-400 block text-[11px]">Pickup Location</span>
                    <p className="font-medium text-gray-900">{req.address}, {req.area}</p>
                    <p className="text-[11px] text-gray-500">{req.landmark}</p>
                  </div>

                  <div>
                    <span className="text-gray-400 block text-[11px]">Tricycle Operator</span>
                    <p className="font-medium text-gray-900">
                      {req.collectorName || "Awaiting Assignment"}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {req.collectorTricycle || "Standard Tricycle Cart"}
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <span className="text-gray-400 block text-[11px]">Total Paid</span>
                    <p className="text-base font-black text-[#14532D]">
                      GH₵ {(req.agreedPrice || req.initialEstimatedPrice || 45).toFixed(2)}
                    </p>
                    <p className="text-[11px] text-gray-500 capitalize">
                      {req.paymentMethod === "momo" ? "Mobile Money" : req.paymentMethod || "Negotiated"}
                    </p>
                  </div>
                </div>

                {/* Reviews note if rated */}
                {req.rating && (
                  <div className="bg-amber-50/60 p-2.5 rounded-xl flex items-center gap-2 text-xs">
                    <div className="flex items-center text-amber-500">
                      {[...Array(req.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-gray-700 italic">&quot;{req.reviewComment}&quot;</span>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-50">
                  {isActive && (
                    <button
                      onClick={() => onOpenTracker(req.id)}
                      className="px-3.5 py-1.5 bg-[#14532D] text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-colors"
                    >
                      Track Active Collection
                    </button>
                  )}

                  {isCompleted && (
                    <button
                      onClick={() => setSelectedReceipt(req)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-emerald-50 hover:text-emerald-800 text-gray-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>View Official Receipt</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedReceipt && (
        <ReceiptModal
          request={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}

    </div>
  );
}
