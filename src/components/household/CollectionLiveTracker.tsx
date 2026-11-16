"use client";

import React, { useState, useEffect } from "react";
import { useWasteApp } from "@/context/WasteAppContext";
import { CollectionRequest, CollectionStatus } from "@/types";
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  ShieldCheck,
  AlertCircle,
  CreditCard,
  Camera,
  Navigation,
  Compass,
} from "lucide-react";

interface CollectionLiveTrackerProps {
  request: CollectionRequest;
  onPayNow: () => void;
  onOpenNegotiation: () => void;
}

const STAGES: { key: CollectionStatus; label: string; desc: string }[] = [
  { key: "requested", label: "Request Submitted", desc: "Searching nearby tricycles" },
  { key: "negotiating", label: "Collector Assigned", desc: "Negotiating fair price in GH₵" },
  { key: "price_agreed", label: "Price Agreed", desc: "Fee confirmed by both parties" },
  { key: "collector_en_route", label: "Collector on the Way", desc: "Tricycle traveling to address" },
  { key: "collector_arrived", label: "Collector Arrived", desc: "Tricycle stationed at household" },
  { key: "in_progress", label: "Collection in Progress", desc: "Loading waste onto tricycle" },
  { key: "completed", label: "Collection Completed", desc: "Waste verified & loaded" },
  { key: "paid", label: "Payment Confirmed", desc: "Receipt generated & closed" },
];

export default function CollectionLiveTracker({
  request,
  onPayNow,
  onOpenNegotiation,
}: CollectionLiveTrackerProps) {
  const { updateCollectionStatus, currentUser } = useWasteApp();
  const [callAlert, setCallAlert] = useState(false);
  const [etaMinutes, setEtaMinutes] = useState(7);

  // Calculate current stage index
  const stageOrder: CollectionStatus[] = [
    "requested",
    "negotiating",
    "price_agreed",
    "collector_en_route",
    "collector_arrived",
    "in_progress",
    "completed",
    "paid",
  ];

  let currentIdx = stageOrder.indexOf(request.status);
  if (currentIdx === -1) currentIdx = 0;

  // Simulate countdown if en route
  useEffect(() => {
    if (request.status === "collector_en_route" && etaMinutes > 2) {
      const timer = setTimeout(() => {
        setEtaMinutes((prev) => prev - 1);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [request.status, etaMinutes]);

  const handleSimulatedCall = () => {
    setCallAlert(true);
    setTimeout(() => setCallAlert(false), 3500);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-gray-500">#{request.id}</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              {request.status.replace(/_/g, " ").toUpperCase()}
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mt-1">
            {request.wasteCategory} ({request.quantity})
          </h2>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            {request.address}, {request.area} &bull; {request.landmark}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-gray-400 font-semibold block uppercase">
              Confirmed Price
            </span>
            <span className="text-2xl font-black text-[#14532D]">
              GH₵ {request.agreedPrice || request.initialEstimatedPrice || 45}
            </span>
          </div>

          {request.status === "completed" && (
            <button
              onClick={onPayNow}
              className="px-5 py-3 bg-[#16A34A] text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-md flex items-center gap-1.5 animate-bounce"
            >
              <CreditCard className="w-4 h-4" />
              <span>Proceed to Payment</span>
            </button>
          )}

          {request.status === "negotiating" && (
            <button
              onClick={onOpenNegotiation}
              className="px-4 py-2.5 bg-[#14532D] text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors shadow-sm"
            >
              Open Negotiation
            </button>
          )}
        </div>
      </div>

      {/* 8-Stage Lifecycle Progress Bar */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs">
        <h3 className="text-sm font-bold text-gray-900 mb-6 flex items-center justify-between">
          <span>Collection Lifecycle Tracker</span>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
            Stage {Math.min(currentIdx + 1, 8)} of 8
          </span>
        </h3>

        {/* Stepper Grid */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-4 left-6 right-6 h-1 bg-gray-200 -z-0">
            <div
              className="h-full bg-emerald-600 transition-all duration-500"
              style={{ width: `${(currentIdx / (STAGES.length - 1)) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 relative z-10">
            {STAGES.map((st, idx) => {
              const isPast = idx < currentIdx;
              const isCurrent = idx === currentIdx;
              const isFuture = idx > currentIdx;

              return (
                <div key={st.key} className="flex flex-col items-center text-center space-y-1.5">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isPast
                        ? "bg-emerald-600 text-white shadow-xs"
                        : isCurrent
                        ? "bg-[#14532D] text-white ring-4 ring-emerald-200 shadow-md scale-105"
                        : "bg-gray-100 text-gray-400 border border-gray-200"
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>

                  <span
                    className={`text-[11px] font-bold leading-tight ${
                      isCurrent
                        ? "text-[#14532D]"
                        : isPast
                        ? "text-gray-800"
                        : "text-gray-400"
                    }`}
                  >
                    {st.label}
                  </span>

                  <span className="text-[10px] text-gray-500 leading-tight hidden lg:block">
                    {st.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Live Map & Collector Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Simulated GPS Live Map */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-600 animate-spin" style={{ animationDuration: "10s" }} />
              <h3 className="text-sm font-bold text-gray-900">
                Simulated Live GPS Dispatch Map
              </h3>
            </div>
            <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
              Mock GPS Coordinates &bull; Active
            </span>
          </div>

          {/* Interactive Map Visual */}
          <div className="relative h-64 rounded-xl overflow-hidden border border-emerald-900/10 bg-[#e8efe8] shadow-inner">
            {/* Grid texture */}
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: `radial-gradient(#16a34a 0.75px, transparent 0.75px), linear-gradient(to right, #d5e4d5 1px, transparent 1px), linear-gradient(to bottom, #d5e4d5 1px, transparent 1px)`,
                backgroundSize: "20px 20px, 40px 40px, 40px 40px",
              }}
            />

            {/* Stylized Route Path */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 500 300">
              <path
                d="M 120 70 Q 200 120 280 180 T 400 240"
                fill="none"
                stroke="#16a34a"
                strokeWidth="5"
                strokeDasharray="6 4"
                className="animate-pulse"
              />
            </svg>

            {/* Destination Household Pin */}
            <div className="absolute top-[220px] left-[380px] transform -translate-x-1/2 -translate-y-full">
              <div className="flex flex-col items-center">
                <span className="bg-[#14532D] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap mb-0.5">
                  Household: {request.householdName.split(" ")[0]}
                </span>
                <div className="w-5 h-5 rounded-full bg-emerald-700 border-2 border-white shadow-md flex items-center justify-center text-white">
                  <MapPin className="w-3 h-3" />
                </div>
              </div>
            </div>

            {/* Moving Collector Tricycle Pin */}
            <div 
              className="absolute transform -translate-x-1/2 -translate-y-full transition-all duration-1000"
              style={{
                top: request.status === "collector_arrived" || request.status === "in_progress" || request.status === "completed" || request.status === "paid"
                  ? "220px" 
                  : "110px",
                left: request.status === "collector_arrived" || request.status === "in_progress" || request.status === "completed" || request.status === "paid"
                  ? "380px"
                  : "200px"
              }}
            >
              <div className="flex flex-col items-center">
                <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap flex items-center gap-1 mb-0.5">
                  <Truck className="w-3 h-3" />
                  <span>{request.collectorName ? request.collectorName.split(" ")[0] : "Tricycle Rider"}</span>
                </span>
                <div className="w-7 h-7 rounded-full bg-amber-500 border-2 border-white shadow-lg flex items-center justify-center text-white animate-pulse">
                  <Truck className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Map Telemetry Overlays */}
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-md border border-gray-200 text-xs space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="font-bold text-gray-900">
                  {request.status === "collector_en_route"
                    ? `En Route (~${etaMinutes} mins)`
                    : request.status === "collector_arrived"
                    ? "Tricycle at Household Gate"
                    : request.status === "in_progress"
                    ? "Loading Waste (In Progress)"
                    : request.status === "completed"
                    ? "Waste Loaded Successfully"
                    : "Simulated Dispatch Zone"}
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Target: {request.address}, {request.area}
              </p>
            </div>

            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[9px] px-2.5 py-1 rounded-md font-mono">
              Speed: 24 km/h &bull; Heading: SE &bull; Greater Accra
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 p-3 rounded-xl">
            <span>Simulated GPS location tracking is active for this prototype demonstration.</span>
            <span className="text-emerald-700 font-medium">Auto-refreshes</span>
          </div>
        </div>

        {/* Assigned Collector Details & Actions */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-gray-900">Assigned Tricycle Collector</h3>

          {request.collectorName ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-emerald-100 border-2 border-emerald-300 flex-shrink-0">
                  <img
                    src={request.collectorAvatar || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100"}
                    alt={request.collectorName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-gray-900 text-sm">{request.collectorName}</h4>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-xs text-gray-500">{request.collectorPhone || "+233 24 555 1234"}</p>
                  <p className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                    Verified Independent Operator
                  </p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl space-y-1.5 text-xs border border-gray-100">
                <div className="flex justify-between">
                  <span className="text-gray-500">Vehicle:</span>
                  <span className="font-semibold text-gray-900">{request.collectorTricycle || "Motor King 200cc"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Service:</span>
                  <span className="font-medium text-gray-900">{request.wasteCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Agreed Price:</span>
                  <span className="font-bold text-emerald-800">
                    GH₵ {request.agreedPrice || request.initialEstimatedPrice || 45}
                  </span>
                </div>
              </div>

              {/* Call & SMS Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleSimulatedCall}
                  className="px-3 py-2.5 bg-gray-100 hover:bg-emerald-50 hover:text-emerald-800 text-gray-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Rider</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenNegotiation}
                  className="px-3 py-2.5 bg-gray-100 hover:bg-emerald-50 hover:text-emerald-800 text-gray-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Messages</span>
                </button>
              </div>

              {callAlert && (
                <div className="p-2.5 bg-emerald-100 text-emerald-900 text-xs rounded-xl text-center font-medium animate-in fade-in">
                  📞 Simulated call connected to {request.collectorPhone}!
                </div>
              )}

              {/* Completion Photo Preview (if uploaded by collector) */}
              {request.completionPhotoUrl && (
                <div className="space-y-1 pt-2 border-t border-gray-100">
                  <span className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5 text-emerald-600" />
                    Collection Evidence Photo
                  </span>
                  <div className="rounded-xl overflow-hidden border border-gray-200 aspect-video">
                    <img
                      src={request.completionPhotoUrl}
                      alt="Collection proof"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Payment Action if completed */}
              {request.status === "completed" && (
                <button
                  onClick={onPayNow}
                  className="w-full py-3 bg-[#14532D] text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4 text-emerald-300" />
                  <span>Pay GH₵ {request.agreedPrice || 45} (Cash or MoMo)</span>
                </button>
              )}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-gray-500 bg-gray-50 rounded-xl">
              No collector confirmed yet. Tricycle operators are currently reviewing your location and details.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
