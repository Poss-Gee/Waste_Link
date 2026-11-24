"use client";

import React, { useState } from "react";
import { useWasteApp } from "@/context/WasteAppContext";
import { CollectorUser, CollectionRequest } from "@/types";
import {
  Truck,
  DollarSign,
  CheckCircle2,
  Clock,
  Star,
  MapPin,
  Power,
  Navigation,
  ArrowRight,
  ShieldCheck,
  Phone,
  AlertCircle,
  Camera,
  Coins,
} from "lucide-react";

interface CollectorDashboardProps {
  onNavigate: (tab: string, requestId?: string) => void;
}

export default function CollectorDashboard({ onNavigate }: CollectorDashboardProps) {
  const {
    currentUser,
    collectors,
    requests,
    toggleCollectorOnline,
    updateCollectionStatus,
  } = useWasteApp();

  const collector = currentUser as CollectorUser;

  // Active job for this collector
  const activeJob = requests.find(
    (r) =>
      r.collectorId === collector.id &&
      r.status !== "paid" &&
      r.status !== "cancelled"
  );

  // Incoming pending requests in collector's areas
  const incomingRequests = requests.filter(
    (r) =>
      r.status === "requested" &&
      collector.operatingAreas.some(
        (area) => area.toLowerCase() === r.area.toLowerCase()
      )
  );

  // Completed jobs
  const completedJobs = requests.filter(
    (r) => r.collectorId === collector.id && r.status === "paid"
  );

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Online/Offline Big Switch (One-handed mobile friendly) */}
      <div className={`rounded-2xl p-6 text-white shadow-card transition-all ${
        collector.isOnline
          ? "bg-gradient-to-r from-[#123B66] via-[#1E40AF] to-[#1D4ED8]"
          : "bg-gradient-to-r from-gray-800 to-gray-700"
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-blue-200">
                Tricycle Operator Hub &bull; {collector.tricycleRegNumber}
              </span>
              {collector.isVerified && (
                <span className="px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-[10px] font-bold border border-blue-400/40">
                  ✓ Verified
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {collector.name}
            </h1>
            <p className="text-xs text-blue-100 flex items-center gap-2">
              <span>{collector.tricycleModel}</span>
              <span>&bull;</span>
              <span>{collector.location}</span>
            </p>
          </div>

          {/* Availability Toggle Button */}
          <button
            onClick={() => toggleCollectorOnline(collector.id)}
            className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2.5 ${
              collector.isOnline
                ? "bg-white text-[#123B66] hover:bg-blue-50"
                : "bg-blue-500 text-white hover:bg-blue-600 animate-pulse"
            }`}
          >
            <Power className="w-5 h-5" />
            <span>
              {collector.isOnline ? "YOU ARE ONLINE (Available)" : "GO ONLINE TO RECEIVE JOBS"}
            </span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Today&apos;s Earnings</span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-[#123B66]">
            GH₵ {collector.earnings.today}
          </div>
          <span className="text-[11px] text-blue-700 font-medium">
            This Week: GH₵ {collector.earnings.thisWeek}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Completed Pickups</span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-gray-900">
            {collector.completedJobs}
          </div>
          <span className="text-[11px] text-gray-400">Total loads hauled</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Customer Rating</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-amber-600">
            {collector.rating > 0 ? collector.rating.toFixed(1) : "New"}
          </div>
          <span className="text-[11px] text-gray-400">
            From {collector.totalRatings} households
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Incoming Requests</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-blue-600">
            {incomingRequests.length}
          </div>
          <span className="text-[11px] text-gray-400">Available in your zones</span>
        </div>
      </div>

      {/* ACTIVE JOB CARD (Immediate Action Center) */}
      {activeJob && (
        <div className="bg-white rounded-2xl p-6 border-2 border-[#2563EB] shadow-card space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500 animate-ping"></span>
              <span className="font-bold text-xs uppercase tracking-wider text-blue-800">
                Active Job In Progress &bull; #{activeJob.id}
              </span>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#123B66] text-white self-start sm:self-auto capitalize">
              {activeJob.status.replace(/_/g, " ")}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-gray-400 text-xs block">Customer &amp; Location</span>
              <h4 className="font-bold text-gray-900 text-sm mt-0.5">{activeJob.householdName}</h4>
              <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                {activeJob.address}, {activeJob.area}
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">Near: {activeJob.landmark}</p>
            </div>

            <div>
              <span className="text-gray-400 text-xs block">Waste &amp; Volume</span>
              <h4 className="font-bold text-gray-900 text-sm mt-0.5">{activeJob.wasteCategory}</h4>
              <p className="text-xs text-gray-600 mt-0.5">{activeJob.quantity}</p>
              {activeJob.specialInstructions && (
                <p className="text-[11px] text-amber-800 italic mt-0.5">
                  &quot;{activeJob.specialInstructions}&quot;
                </p>
              )}
            </div>

            <div className="flex flex-col justify-between items-start md:items-end">
              <div>
                <span className="text-gray-400 text-xs block md:text-right">Agreed Earnings</span>
                <span className="text-2xl font-black text-[#123B66]">
                  GH₵ {activeJob.agreedPrice || activeJob.initialEstimatedPrice || 45}
                </span>
              </div>

              <button
                onClick={() => onNavigate("jobs", activeJob.id)}
                className="w-full md:w-auto mt-2 px-5 py-2.5 bg-[#123B66] text-white rounded-xl text-xs font-bold hover:bg-blue-800 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Open Job Execution &amp; Navigation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Incoming Requests & Quick Earnings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Incoming Requests Feed */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Incoming Requests in Your Zone ({incomingRequests.length})
            </h3>
            <button
              onClick={() => onNavigate("requests")}
              className="text-xs font-semibold text-blue-700 hover:text-blue-900"
            >
              View All
            </button>
          </div>

          {incomingRequests.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-400 border border-dashed border-gray-200 rounded-xl">
              No new unassigned requests in your zones at the moment. Keep your status online to receive alerts when households post.
            </div>
          ) : (
            <div className="space-y-3">
              {incomingRequests.slice(0, 3).map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-xl border border-gray-100 hover:border-blue-300 transition-all space-y-2 card-hover"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-gray-400">#{req.id}</span>
                        <h4 className="font-bold text-xs text-gray-900">{req.householdName}</h4>
                        <span className="text-[10px] text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full font-semibold">
                          {req.area}
                        </span>
                      </div>
                      <p className="text-xs text-gray-700 font-medium mt-1">
                        {req.wasteCategory} &bull; {req.quantity}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Landmark: {req.landmark}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-[#123B66] block">
                        Est. GH₵ {req.initialEstimatedPrice}
                      </span>
                      <button
                        onClick={() => onNavigate("requests", req.id)}
                        className="mt-2 px-3.5 py-1.5 bg-[#123B66] text-white rounded-lg text-xs font-bold hover:bg-blue-800 transition-colors shadow-xs"
                      >
                        Propose Price
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Earnings & Tips */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-3">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-600" />
              Earnings Breakdown
            </h3>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Today:</span>
                <span className="font-bold text-gray-900">GH₵ {collector.earnings.today.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">This Week:</span>
                <span className="font-bold text-gray-900">GH₵ {collector.earnings.thisWeek.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">This Month:</span>
                <span className="font-bold text-gray-900">GH₵ {collector.earnings.thisMonth.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-500 font-semibold">Total All-Time:</span>
                <span className="font-extrabold text-blue-800">GH₵ {collector.earnings.total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate("earnings")}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-colors"
            >
              View Full Earnings Ledger
            </button>
          </div>

          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 text-xs text-blue-950 space-y-1.5">
            <p className="font-bold flex items-center gap-1.5 text-blue-900">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              Tricycle Operator Standards
            </p>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              Always cover loaded waste with a net or tarpaulin before entering major Accra highways to avoid municipal road penalties.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}

