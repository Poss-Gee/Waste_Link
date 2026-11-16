"use client";

import React, { useState } from "react";
import { useWasteApp } from "@/context/WasteAppContext";
import { CollectionRequest, CollectorUser } from "@/types";
import {
  Clock,
  MapPin,
  Camera,
  DollarSign,
  Send,
  CheckCircle2,
  XCircle,
  Truck,
  Sparkles,
  Info,
} from "lucide-react";

interface IncomingRequestsViewProps {
  onOpenJob: (requestId: string) => void;
}

export default function IncomingRequestsView({ onOpenJob }: IncomingRequestsViewProps) {
  const { currentUser, requests, proposePrice } = useWasteApp();
  const collector = currentUser as CollectorUser;

  // Selected request for pricing proposal
  const [selectedReq, setSelectedReq] = useState<CollectionRequest | null>(null);
  const [proposedAmount, setProposedAmount] = useState<number>(50);
  const [proposalNote, setProposalNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Available requests: status === "requested" or (status === "negotiating" && collectorId === collector.id)
  const openRequests = requests.filter(
    (r) =>
      r.status === "requested" ||
      (r.status === "negotiating" && r.collectorId === collector.id)
  );

  const handleOpenProposal = (req: CollectionRequest) => {
    setSelectedReq(req);
    setProposedAmount(req.initialEstimatedPrice || 45);
    setProposalNote("I can reach your location with my tricycle in 15 minutes.");
  };

  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq || proposedAmount <= 0) return;
    setIsSubmitting(true);

    setTimeout(() => {
      proposePrice(selectedReq.id, proposedAmount, proposalNote);
      setIsSubmitting(false);
      setSuccessToast(`Price proposal of GH₵${proposedAmount} sent to ${selectedReq.householdName}!`);
      const targetId = selectedReq.id;
      setSelectedReq(null);
      setTimeout(() => {
        setSuccessToast(null);
        onOpenJob(targetId);
      }, 1800);
    }, 600);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs">
        <h2 className="text-xl font-bold text-gray-900">Incoming Collection Requests</h2>
        <p className="text-xs text-gray-500 mt-1">
          Household rubbish pickup opportunities in your operating corridors ({collector.operatingAreas.join(", ")}). Submit your price proposals in Ghana cedis (GH₵).
        </p>
      </div>

      {successToast && (
        <div className="p-4 bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-5 h-5" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {openRequests.length === 0 ? (
          <div className="md:col-span-2 bg-white rounded-2xl p-12 text-center text-xs text-gray-400 border border-gray-200">
            No active unassigned pickup requests in your operational corridors right now. Check back shortly as households post in real-time.
          </div>
        ) : (
          openRequests.map((req, idx) => {
            const isNegotiatingWithMe = req.collectorId === collector.id && req.status === "negotiating";

            return (
              <div
                key={req.id}
                className={`bg-white rounded-2xl p-5 border shadow-xs transition-all flex flex-col justify-between space-y-4 ${
                  isNegotiatingWithMe
                    ? "border-amber-300 ring-2 ring-amber-100"
                    : "border-gray-200 hover:border-emerald-300"
                }`}
              >
                <div className="space-y-3">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-gray-400">#{req.id}</span>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                        {req.area}
                      </span>
                    </div>

                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-emerald-100 flex-shrink-0">
                      <img
                        src={req.householdAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                        alt={req.householdName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{req.householdName}</h4>
                      <p className="text-[11px] text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        {req.address}
                      </p>
                    </div>
                  </div>

                  {/* Waste Details */}
                  <div className="p-3 bg-gray-50 rounded-xl space-y-1.5 text-xs border border-gray-100">
                    <div className="flex justify-between font-medium">
                      <span className="text-gray-500">Category:</span>
                      <span className="text-gray-900 font-bold">{req.wasteCategory}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Quantity:</span>
                      <span className="text-gray-800">{req.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Landmark:</span>
                      <span className="text-gray-700">{req.landmark}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 italic bg-white p-2 rounded-lg border border-gray-100">
                    &quot;{req.description}&quot;
                  </p>

                  {/* Waste Photo Preview (if available) */}
                  {req.photoUrl && (
                    <div className="rounded-xl overflow-hidden border border-gray-200 aspect-video relative group">
                      <img src={req.photoUrl} alt="Waste load" className="w-full h-full object-cover" />
                      <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded flex items-center gap-1">
                        <Camera className="w-3 h-3" />
                        <span>Uploaded by Household</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase font-semibold">
                      Baseline Estimate
                    </span>
                    <span className="text-base font-black text-[#14532D]">
                      GH₵ {req.initialEstimatedPrice}
                    </span>
                  </div>

                  {isNegotiatingWithMe ? (
                    <button
                      onClick={() => onOpenJob(req.id)}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                    >
                      Active Negotiation Thread &rarr;
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenProposal(req)}
                      className="px-4 py-2 bg-[#14532D] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                    >
                      Propose Collection Price
                    </button>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Propose Price Modal Dialog */}
      {selectedReq && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm">
                Propose Price for #{selectedReq.id}
              </h3>
              <button
                onClick={() => setSelectedReq(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Customer:</strong> {selectedReq.householdName}</p>
              <p><strong>Location:</strong> {selectedReq.address}, {selectedReq.area}</p>
              <p><strong>Waste:</strong> {selectedReq.wasteCategory} ({selectedReq.quantity})</p>
            </div>

            <form onSubmit={handleSendProposal} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Proposed Price (Ghana Cedis GH₵)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-gray-500 text-xs">GH₵</span>
                  <input
                    type="number"
                    min={15}
                    max={600}
                    step={5}
                    required
                    value={proposedAmount}
                    onChange={(e) => setProposedAmount(Number(e.target.value))}
                    className="w-full text-base font-black pl-12 pr-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Household can accept immediately or submit a counteroffer.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Message / Availability Note to Household
                </label>
                <input
                  type="text"
                  required
                  value={proposalNote}
                  onChange={(e) => setProposalNote(e.target.value)}
                  placeholder="e.g. In the area, ready to load in 15 mins..."
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSelectedReq(null)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-[#14532D] text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? "Sending..." : "Submit Proposal"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
