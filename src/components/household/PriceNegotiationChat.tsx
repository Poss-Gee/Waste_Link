"use client";

import React, { useState } from "react";
import { useWasteApp } from "@/context/WasteAppContext";
import { CollectionRequest, PriceOffer } from "@/types";
import {
  MessageSquare,
  DollarSign,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Send,
  AlertCircle,
  Clock,
  Truck,
  RotateCcw,
} from "lucide-react";

interface PriceNegotiationChatProps {
  request: CollectionRequest;
  onNegotiationComplete: () => void;
}

export default function PriceNegotiationChat({
  request,
  onNegotiationComplete,
}: PriceNegotiationChatProps) {
  const { currentUser, proposePrice, acceptPriceOffer, rejectPriceOffer } = useWasteApp();
  const [counterAmount, setCounterAmount] = useState<number>(
    request.initialEstimatedPrice ? Math.max(30, request.initialEstimatedPrice - 5) : 40
  );
  const [counterNote, setCounterNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find latest pending offer
  const latestOffer = [...request.negotiationHistory].reverse()[0];
  const canRespond =
    latestOffer &&
    latestOffer.status === "pending" &&
    latestOffer.proposedBy !== currentUser.role;

  const isAgreed = request.status === "price_agreed" || !!request.agreedPrice;

  const handleSendCounter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!counterAmount || counterAmount <= 0) return;
    setIsSubmitting(true);

    setTimeout(() => {
      proposePrice(
        request.id,
        Number(counterAmount),
        counterNote.trim() || undefined
      );
      setCounterNote("");
      setIsSubmitting(false);
    }, 400);
  };

  const handleAccept = (offerId: string) => {
    acceptPriceOffer(request.id, offerId);
    setTimeout(() => {
      onNegotiationComplete();
    }, 500);
  };

  const handleReject = (offerId: string) => {
    rejectPriceOffer(request.id, offerId);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col">
      
      {/* Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-50 to-white border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#14532D] text-white rounded-xl shadow-xs">
            <MessageSquare className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-sm">
                Price Negotiation Thread &bull; #{request.id}
              </h3>
              {isAgreed ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  ✓ Price Agreed
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  Negotiating
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              WasteLink Fair Pricing &bull; All offers in Ghana Cedis (GH₵)
            </p>
          </div>
        </div>

        {/* Agreed or Baseline Box */}
        <div className="text-right bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shadow-xs">
          <span className="text-[10px] text-gray-400 uppercase font-semibold block">
            {isAgreed ? "Binding Agreed Fee" : "Initial Benchmark"}
          </span>
          <span className="text-base font-black text-[#14532D]">
            GH₵ {request.agreedPrice || request.initialEstimatedPrice || 45}
          </span>
        </div>
      </div>

      {/* Offer Timeline / Chat Bubbles */}
      <div className="p-4 sm:p-6 space-y-4 max-h-[380px] overflow-y-auto bg-gray-50/50">
        
        {/* Initial Request Bubble */}
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">
            WL
          </div>
          <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-200 shadow-xs max-w-md text-xs text-gray-700 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-gray-900">Request Broadcasted</span>
              <span className="text-[10px] text-gray-400">
                {new Date(request.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-gray-600">
              {request.householdName} posted an on-demand collection for <strong>{request.wasteCategory}</strong> ({request.quantity}) in {request.area}. Initial baseline estimate: <strong>GH₵ {request.initialEstimatedPrice}</strong>.
            </p>
          </div>
        </div>

        {/* Negotiation History */}
        {request.negotiationHistory.map((offer) => {
          const isMe = offer.senderId === currentUser.id;
          const isPending = offer.status === "pending";
          const isAccepted = offer.status === "accepted";
          const isRejected = offer.status === "rejected";

          return (
            <div
              key={offer.id}
              className={`flex items-start gap-2.5 ${isMe ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0 ${
                  offer.proposedBy === "collector"
                    ? "bg-[#14532D] text-white"
                    : "bg-emerald-600 text-white"
                }`}
              >
                {offer.senderName.charAt(0)}
              </div>

              <div
                className={`p-4 rounded-2xl border shadow-xs max-w-md text-xs space-y-2 ${
                  isMe
                    ? "bg-emerald-50/80 border-emerald-200 rounded-tr-none text-emerald-950"
                    : "bg-white border-gray-200 rounded-tl-none text-gray-800"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-bold">
                    {offer.senderName} ({offer.proposedBy === "collector" ? "Tricycle Rider" : "Household"})
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {new Date(offer.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-gray-500 font-medium">Offered Price:</span>
                  <span className="text-lg font-black text-[#14532D]">
                    GH₵ {offer.amount}
                  </span>
                  
                  {isAccepted && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full ml-auto">
                      ✓ Accepted
                    </span>
                  )}
                  {isRejected && (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full ml-auto">
                      ✕ Rejected
                    </span>
                  )}
                  {offer.status === "countered" && (
                    <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full ml-auto">
                      Countered
                    </span>
                  )}
                  {isPending && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full ml-auto animate-pulse">
                      Waiting for decision
                    </span>
                  )}
                </div>

                {offer.note && (
                  <p className="text-xs text-gray-600 italic bg-white/70 p-2 rounded-lg border border-gray-100">
                    &quot;{offer.note}&quot;
                  </p>
                )}

                {/* Accept / Reject actions if target party */}
                {isPending && !isMe && (
                  <div className="pt-2 flex items-center gap-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => handleAccept(offer.id)}
                      className="flex-1 py-1.5 px-3 bg-[#14532D] text-white rounded-lg font-bold text-xs hover:bg-emerald-800 transition-colors flex items-center justify-center gap-1 shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Accept GH₵{offer.amount}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(offer.id)}
                      className="py-1.5 px-2.5 bg-gray-100 text-gray-600 rounded-lg font-semibold text-xs hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {request.negotiationHistory.length === 0 && (
          <div className="p-4 text-center text-xs text-gray-500 bg-white rounded-xl border border-dashed border-gray-200">
            Awaiting first price proposal from nearby tricycle collectors. You can also send a custom initial quote below.
          </div>
        )}

      </div>

      {/* Footer / Offer Submission Bar */}
      {isAgreed ? (
        <div className="p-4 bg-emerald-50 border-t border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-emerald-900 text-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <span className="font-bold">Price Confirmed: GH₵ {request.agreedPrice}</span>
              <p className="text-[11px] text-emerald-700">Both parties agreed. The collector is authorized to execute pickup.</p>
            </div>
          </div>
          <button
            onClick={onNegotiationComplete}
            className="w-full sm:w-auto px-4 py-2 bg-[#14532D] text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Proceed to Collection Tracking</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="p-4 bg-white border-t border-gray-100 space-y-3">
          <form onSubmit={handleSendCounter} className="space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative w-full sm:w-44 flex-shrink-0">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500">
                  GH₵
                </span>
                <input
                  type="number"
                  min={10}
                  max={500}
                  step={5}
                  required
                  value={counterAmount}
                  onChange={(e) => setCounterAmount(Number(e.target.value))}
                  placeholder="Offer"
                  className="w-full text-xs font-bold pl-12 pr-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <input
                type="text"
                value={counterNote}
                onChange={(e) => setCounterNote(e.target.value)}
                placeholder="Optional note: e.g. Bags are already bundled near gate..."
                className="flex-1 text-xs px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-[#14532D] text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{latestOffer ? "Send Counteroffer" : "Submit Price"}</span>
              </button>
            </div>

            <p className="text-[11px] text-gray-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Per WasteLink policy, the collection is only confirmed once both customer and collector agree.
            </p>
          </form>
        </div>
      )}

    </div>
  );
}
