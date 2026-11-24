"use client";

import React, { useState } from "react";
import { useWasteApp } from "@/context/WasteAppContext";
import { CollectionRequest, CollectorUser, CollectionStatus } from "@/types";
import {
  Truck,
  Navigation,
  MapPin,
  CheckCircle2,
  Clock,
  Phone,
  Camera,
  DollarSign,
  ShieldCheck,
  AlertCircle,
  WifiOff,
  Upload,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import PriceNegotiationChat from "@/components/household/PriceNegotiationChat";

interface ActiveJobExecutionViewProps {
  requestId?: string;
  onJobFinished: () => void;
}

const SAMPLE_COMPLETION_PHOTOS = [
  "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=400&q=80",
];

export default function ActiveJobExecutionView({
  requestId,
  onJobFinished,
}: ActiveJobExecutionViewProps) {
  const {
    currentUser,
    requests,
    updateCollectionStatus,
    isOfflineSimulated,
    offlineQueue,
  } = useWasteApp();
  const collector = currentUser as CollectorUser;

  // Find job: if requestId passed, use it; otherwise find active job
  const activeJob =
    (requestId ? requests.find((r) => r.id === requestId) : null) ||
    requests.find(
      (r) =>
        r.collectorId === collector.id &&
        r.status !== "paid" &&
        r.status !== "cancelled"
    ) ||
    requests.find((r) => r.status === "negotiating" && r.collectorId === collector.id);

  const [callAlert, setCallAlert] = useState(false);
  const [completionPhoto, setCompletionPhoto] = useState<string>(SAMPLE_COMPLETION_PHOTOS[0]);
  const [offlineToast, setOfflineToast] = useState<string | null>(null);

  if (!activeJob) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center text-xs text-gray-500 border border-gray-200">
        <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-gray-800">No Active Job Selected</h3>
        <p className="mt-1">
          Pick an incoming request from the &quot;Incoming Requests&quot; tab or wait for households to accept your proposals.
        </p>
      </div>
    );
  }

  const handleStatusStep = (nextStatus: CollectionStatus, photo?: string) => {
    updateCollectionStatus(activeJob.id, nextStatus, photo);

    if (isOfflineSimulated) {
      setOfflineToast(`Action [${nextStatus.replace(/_/g, " ")}] queued offline in local storage!`);
      setTimeout(() => setOfflineToast(null), 3500);
    }
  };

  const handleSimulatedCall = () => {
    setCallAlert(true);
    setTimeout(() => setCallAlert(false), 3500);
  };

  const isAgreed = activeJob.status !== "requested" && activeJob.status !== "negotiating";

  return (
    <div className="space-y-6">
      
      {/* Offline Alert Banner if queued */}
      {isOfflineSimulated && (
        <div className="p-3.5 bg-amber-500 text-black font-semibold text-xs rounded-xl flex items-center justify-between shadow-sm animate-pulse">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4" />
            <span>PWA Offline Mode: Status updates are safely queued in local storage without network.</span>
          </div>
          <span className="bg-black/20 px-2 py-0.5 rounded text-[11px] font-bold">
            {offlineQueue.length} Queued
          </span>
        </div>
      )}

      {offlineToast && (
        <div className="p-3 bg-amber-100 text-amber-950 font-bold text-xs rounded-xl border border-amber-300 animate-in fade-in">
          📦 {offlineToast}
        </div>
      )}

      {/* Top Job Overview */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-gray-400">#{activeJob.id}</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#14532D] text-white capitalize">
              {activeJob.status.replace(/_/g, " ")}
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mt-1">
            {activeJob.wasteCategory} ({activeJob.quantity})
          </h2>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            {activeJob.address}, {activeJob.area} &bull; {activeJob.landmark}
          </p>
        </div>

        <div className="text-left md:text-right">
          <span className="text-[10px] text-gray-400 font-semibold block uppercase">
            {isAgreed ? "Agreed Payment Fee" : "Current Negotiation"}
          </span>
          <span className="text-2xl font-black text-[#14532D]">
            GH₵ {activeJob.agreedPrice || activeJob.initialEstimatedPrice || 45}
          </span>
        </div>
      </div>

      {/* If currently negotiating, show Price Negotiation thread */}
      {activeJob.status === "negotiating" && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span>Price negotiation is in progress. Once both you and {activeJob.householdName} agree on the amount, you can start the journey.</span>
          </div>

          <PriceNegotiationChat
            request={activeJob}
            onNegotiationComplete={() => {
              handleStatusStep("collector_en_route");
            }}
          />
        </div>
      )}

      {/* STEP-BY-STEP COLLECTION WORKFLOW CONTROLS */}
      {isAgreed && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600" />
              Tricycle Step-by-Step Collection Process
            </h3>
            <span className="text-xs font-semibold text-emerald-700">
              One-Hand Mobile Friendly
            </span>
          </div>

          {/* Current Step Instruction Banner */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                Current Operational Phase:
              </span>
              <h4 className="text-base font-extrabold text-[#14532D] capitalize mt-0.5">
                {activeJob.status === "price_agreed" && "Ready for Departure"}
                {activeJob.status === "collector_en_route" && "En Route to Household"}
                {activeJob.status === "collector_arrived" && "Arrived at Household Gate"}
                {activeJob.status === "in_progress" && "Loading Waste onto Tricycle"}
                {activeJob.status === "completed" && "Waste Loaded & Awaiting Payment"}
                {activeJob.status === "paid" && "Job Closed & Payment Received"}
              </h4>
              <p className="text-xs text-emerald-900/80 mt-0.5">
                {activeJob.status === "price_agreed" && "Click 'Start Trip to Household' to activate live GPS dispatch."}
                {activeJob.status === "collector_en_route" && "Navigate to gate. When at the location, tap 'I Have Arrived'."}
                {activeJob.status === "collector_arrived" && "Inspect waste with customer and tap 'Start Loading Waste'."}
                {activeJob.status === "in_progress" && "Pack bags securely into the cart. Take an evidence photo and mark completed."}
                {activeJob.status === "completed" && "Ask customer to authorize cash or Mobile Money on their device."}
                {activeJob.status === "paid" && "Great job! This pickup has been credited to your earnings."}
              </p>
            </div>

            {/* Main Primary Action Button */}
            <div className="w-full sm:w-auto flex-shrink-0">
              {activeJob.status === "price_agreed" && (
                <button
                  onClick={() => handleStatusStep("collector_en_route")}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#14532D] text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4 text-emerald-300" />
                  <span>Start Trip to Household</span>
                </button>
              )}

              {activeJob.status === "collector_en_route" && (
                <button
                  onClick={() => handleStatusStep("collector_arrived")}
                  className="w-full sm:w-auto px-6 py-3.5 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>I Have Arrived at Location</span>
                </button>
              )}

              {activeJob.status === "collector_arrived" && (
                <button
                  onClick={() => handleStatusStep("in_progress")}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#14532D] text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Truck className="w-4 h-4 text-emerald-300" />
                  <span>Start Loading Waste</span>
                </button>
              )}

              {activeJob.status === "in_progress" && (
                <button
                  onClick={() => handleStatusStep("completed", completionPhoto)}
                  className="w-full sm:w-auto px-6 py-3.5 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Mark Collection Completed</span>
                </button>
              )}

              {activeJob.status === "completed" && (
                <div className="text-center sm:text-right">
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 font-bold rounded-lg text-xs inline-block">
                    Awaiting Customer Payment
                  </span>
                  <span className="text-[10px] text-gray-500 block mt-1">
                    (Customer pays GH₵{activeJob.agreedPrice} via MoMo/Cash)
                  </span>
                </div>
              )}

              {activeJob.status === "paid" && (
                <button
                  onClick={onJobFinished}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#14532D] text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors shadow-md"
                >
                  Finish Job &amp; Return to Hub
                </button>
              )}
            </div>
          </div>

          {/* Evidence photo upload if in progress */}
          {activeJob.status === "in_progress" && (
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
              <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-600" />
                Upload Loaded Tricycle Proof (Municipal Landfill Compliance)
              </span>

              <div className="grid grid-cols-2 gap-3">
                {SAMPLE_COMPLETION_PHOTOS.map((url, i) => (
                  <div
                    key={url}
                    onClick={() => setCompletionPhoto(url)}
                    className={`rounded-xl overflow-hidden border-2 cursor-pointer aspect-video relative group ${
                      completionPhoto === url ? "border-emerald-600 ring-2 ring-emerald-400" : "border-gray-200"
                    }`}
                  >
                    <img src={url} alt="Proof" className="w-full h-full object-cover" />
                    <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded">
                      Sample Photo {i + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer Contact & GPS Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-gray-50 rounded-xl space-y-2 text-xs border border-gray-100">
              <span className="text-gray-400 font-semibold block uppercase text-[10px]">Customer Phone &amp; Gate</span>
              <p className="font-bold text-gray-900">{activeJob.householdName}</p>
              <p className="text-gray-600">{activeJob.householdPhone}</p>
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={handleSimulatedCall}
                  className="flex-1 py-2 bg-white hover:bg-emerald-50 text-gray-800 rounded-lg border border-gray-200 font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Call Customer</span>
                </button>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl space-y-2 text-xs border border-gray-100">
              <span className="text-gray-400 font-semibold block uppercase text-[10px]">Accra Route Instructions</span>
              <p className="text-gray-700 font-medium">
                {activeJob.landmark || "Near junction"} &bull; {activeJob.address}
              </p>
              <div className="pt-2">
                <div className="text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-100 font-medium">
                  GPS Dispatch Lat: {activeJob.lat} &bull; Lng: {activeJob.lng}
                </div>
              </div>
            </div>
          </div>

          {callAlert && (
            <div className="p-3 bg-emerald-100 text-emerald-950 text-xs rounded-xl text-center font-bold animate-in fade-in">
              📞 Connecting simulated hands-free call to {activeJob.householdName} ({activeJob.householdPhone})...
            </div>
          )}

        </div>
      )}

    </div>
  );
}

