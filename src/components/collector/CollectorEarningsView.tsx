"use client";

import React, { useState } from "react";
import { useWasteApp } from "@/context/WasteAppContext";
import { CollectorUser } from "@/types";
import {
  DollarSign,
  Coins,
  TrendingUp,
  CreditCard,
  Banknote,
  Calendar,
  CheckCircle2,
  Download,
  Filter,
} from "lucide-react";

export default function CollectorEarningsView() {
  const { currentUser, requests } = useWasteApp();
  const collector = currentUser as CollectorUser;

  // Filter completed jobs for this collector
  const completedJobs = requests.filter(
    (r) => r.collectorId === collector.id && r.status === "paid"
  );

  const [filterMethod, setFilterMethod] = useState<"all" | "cash" | "momo">("all");

  const filtered = completedJobs.filter((j) => {
    if (filterMethod === "all") return true;
    return j.paymentMethod === filterMethod;
  });

  const cashTotal = completedJobs
    .filter((j) => j.paymentMethod === "cash")
    .reduce((sum, j) => sum + (j.agreedPrice || j.initialEstimatedPrice || 0), 0);

  const momoTotal = completedJobs
    .filter((j) => j.paymentMethod === "momo")
    .reduce((sum, j) => sum + (j.agreedPrice || j.initialEstimatedPrice || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Collector Earnings &amp; Payouts</h2>
          <p className="text-xs text-gray-500 mt-1">
            Real-time breakdown of your gross revenue from household rubbish collections in Ghana cedis (GH₵).
          </p>
        </div>

        <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 text-right">
          <span className="text-[10px] text-blue-800 uppercase font-semibold block">Total Revenue</span>
          <span className="text-xl font-black text-[#123B66]">
            GH₵ {collector.earnings.total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* 4 Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Today</span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-gray-900">
            GH₵ {collector.earnings.today.toFixed(2)}
          </div>
          <span className="text-[11px] text-gray-400">Directly settled</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">This Week</span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-[#123B66]">
            GH₵ {collector.earnings.thisWeek.toFixed(2)}
          </div>
          <span className="text-[11px] text-blue-700 font-medium">Past 7 days</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Cash Collected</span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-gray-900">
            GH₵ {cashTotal.toFixed(2)}
          </div>
          <span className="text-[11px] text-gray-400">Retained in hand</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Mobile Money</span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-gray-900">
            GH₵ {momoTotal.toFixed(2)}
          </div>
          <span className="text-[11px] text-blue-600 font-medium">MTN / Telecel wallet</span>
        </div>
      </div>

      {/* Transactions Ledger */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-gray-900">Transaction History</h3>

          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            {(["all", "cash", "momo"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setFilterMethod(m)}
                className={`text-xs px-3 py-1.5 rounded-lg capitalize font-semibold transition-all ${
                  filterMethod === m
                    ? "bg-[#123B66] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {m === "all" ? "All Methods" : m === "cash" ? "Cash Only" : "Mobile Money"}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-400">
            No completed paid transactions under this filter.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((job) => (
              <div
                key={job.id}
                className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-gray-500">
                      {job.receiptNumber || `REC-GH-${job.id.slice(-4)}`}
                    </span>
                    <span className="text-xs font-bold text-gray-900">{job.householdName}</span>
                    <span className="text-[10px] text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full font-semibold">
                      {job.area}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <span>{job.wasteCategory}</span>
                    <span>&bull;</span>
                    <span className="font-mono text-[11px] text-gray-400">
                      Ref: {job.paymentReference || "Direct"}
                    </span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-base font-black text-[#123B66] block">
                    + GH₵ {(job.agreedPrice || job.initialEstimatedPrice || 45).toFixed(2)}
                  </span>
                  <span className="text-[10px] text-gray-400 capitalize">
                    {job.paymentMethod === "momo" ? job.momoProvider || "Mobile Money" : "Cash Received"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

