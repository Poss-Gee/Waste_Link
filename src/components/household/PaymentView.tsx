"use client";

import React, { useState } from "react";
import { useWasteApp } from "@/context/WasteAppContext";
import { CollectionRequest } from "@/types";
import {
  CreditCard,
  Banknote,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  ArrowRight,
  Printer,
  Star,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import ReceiptModal from "@/components/common/ReceiptModal";

interface PaymentViewProps {
  request: CollectionRequest;
  onPaymentSuccess: () => void;
}

export default function PaymentView({ request, onPaymentSuccess }: PaymentViewProps) {
  const { processPayment, submitReview, currentUser, showToast } = useWasteApp();

  const [paymentMethod, setPaymentMethod] = useState<"cash" | "momo">("momo");
  const [momoProvider, setMomoProvider] = useState<"MTN MoMo" | "Telecel Cash" | "AT Money">("MTN MoMo");
  const [phoneNumber, setPhoneNumber] = useState(currentUser.phone || "+233 24 456 7890");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{
    success: boolean;
    receiptNumber: string;
    reference: string;
  } | null>(null);

  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Rating State after payment
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const amount = request.agreedPrice || request.initialEstimatedPrice || 45;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === "momo") {
      const normalized = phoneNumber.replace(/[\s-]/g, "");
      if (!/^(\+233|0)[235]\d{8}$/.test(normalized)) {
        setPhoneError("Enter a valid Ghanaian MoMo number (e.g. 024 456 7890 or +233 24 456 7890).");
        showToast("Please enter a valid Ghanaian Mobile Money number.", "error");
        return;
      }
      setPhoneError(null);
    }

    setIsProcessing(true);

    try {
      // Simulate network / USSD prompt delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const res = await processPayment(
        request.id,
        paymentMethod,
        paymentMethod === "momo"
          ? { provider: momoProvider, phone: phoneNumber }
          : undefined
      );

      setPaymentResult(res);
      setIsProcessing(false);
      showToast(`Payment of GH₵ ${amount.toFixed(2)} confirmed! Receipt #${res.receiptNumber} generated.`, "success");

      // Trigger celebration confetti dynamically
      try {
        const confetti = (await import("canvas-confetti")).default;
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#123B66", "#2563EB", "#86efac", "#eab308"],
        });
      } catch (err) {
        // Safe fallback
      }
    } catch (err) {
      setIsProcessing(false);
      showToast("Payment processing error. Please retry.", "error");
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReview(request.id, rating, reviewComment);
    setReviewSubmitted(true);
    showToast("Thank you! Your rating has been submitted.", "success");
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs text-center">
        <div className="w-12 h-12 bg-blue-100 text-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <CreditCard className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Payment for Waste Collection</h2>
        <p className="text-xs text-gray-500 mt-1">
          Collection #{request.id} &bull; {request.wasteCategory}
        </p>

        {/* Negotiated Amount Callout */}
        <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100 inline-block w-full">
          <span className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold block">
            Binding Negotiated Total
          </span>
          <span className="text-3xl font-black text-[#123B66] mt-1 block">
            GH₵ {amount.toFixed(2)}
          </span>
          <span className="text-[11px] text-blue-700 font-medium inline-flex items-center gap-1 mt-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Collection Completed &amp; Verified
          </span>
        </div>
      </div>

      {paymentResult ? (
        /* Successful Payment State */
        <div className="bg-white rounded-2xl p-6 border border-blue-300 shadow-card space-y-5 animate-in zoom-in-95">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Payment Successfully Recorded!</h3>
            <p className="text-xs text-gray-600 max-w-sm mx-auto">
              Transaction reference <span className="font-mono font-bold">{paymentResult.reference}</span> has been confirmed. Receipt is ready.
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl space-y-2 text-xs border border-gray-100">
            <div className="flex justify-between">
              <span className="text-gray-500">Receipt Number:</span>
              <span className="font-mono font-bold text-gray-900">{paymentResult.receiptNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Collector:</span>
              <span className="font-semibold text-gray-900">{request.collectorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Method:</span>
              <span className="font-semibold text-gray-900 capitalize">
                {paymentMethod === "momo" ? momoProvider : "Cash Direct"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setShowReceiptModal(true)}
              className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>View / Print Receipt</span>
            </button>
            <button
              onClick={onPaymentSuccess}
              className="py-3 px-4 bg-[#123B66] text-white rounded-xl text-xs font-bold hover:bg-blue-800 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Back to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Rating Prompt */}
          {!reviewSubmitted ? (
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <h4 className="text-xs font-bold text-gray-900">
                Rate {request.collectorName ? request.collectorName.split(" ")[0] : "your collector"}
              </h4>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        s <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Leave feedback: e.g. Very fast, polite, and swept gate area..."
                className="w-full text-xs px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleReviewSubmit}
                className="text-xs font-bold text-blue-800 bg-blue-100 hover:bg-blue-200 px-4 py-1.5 rounded-lg transition-colors"
              >
                Submit Rating
              </button>
            </div>
          ) : (
            <div className="text-center p-3 bg-blue-50 rounded-xl text-xs font-medium text-blue-900">
              ✓ Thank you! Your rating has been recorded on the collector&apos;s public profile.
            </div>
          )}

        </div>
      ) : (
        /* Payment Mode Selection Form */
        <form onSubmit={handlePay} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Select Simulated Payment Channel
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("momo")}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                  paymentMethod === "momo"
                    ? "border-blue-600 bg-blue-50/80 text-blue-950 font-bold shadow-xs"
                    : "border-gray-200 text-gray-700 hover:border-gray-300 bg-white"
                }`}
              >
                <Smartphone className="w-5 h-5 text-blue-700" />
                <div>
                  <span className="block text-xs">Mobile Money</span>
                  <span className="text-[10px] text-gray-500 font-normal">MTN / Telecel / AT</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("cash")}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                  paymentMethod === "cash"
                    ? "border-blue-600 bg-blue-50/80 text-blue-950 font-bold shadow-xs"
                    : "border-gray-200 text-gray-700 hover:border-gray-300 bg-white"
                }`}
              >
                <Banknote className="w-5 h-5 text-blue-700" />
                <div>
                  <span className="block text-xs">Direct Cash</span>
                  <span className="text-[10px] text-gray-500 font-normal">Handed to collector</span>
                </div>
              </button>
            </div>
          </div>

          {paymentMethod === "momo" ? (
            <div className="space-y-4 pt-2 border-t border-gray-100">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Select MoMo Provider
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["MTN MoMo", "Telecel Cash", "AT Money"] as const).map((prov) => (
                    <button
                      key={prov}
                      type="button"
                      onClick={() => setMomoProvider(prov)}
                      className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                        momoProvider === prov
                          ? "bg-[#123B66] text-white border-[#123B66]"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {prov}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Ghana Phone Number
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    if (phoneError) setPhoneError(null);
                  }}
                  placeholder="+233 24 000 0000"
                  className={`w-full text-xs px-3 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono ${
                    phoneError ? "border-rose-400 bg-rose-50/40" : "border-gray-300"
                  }`}
                />
                {phoneError ? (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>{phoneError}</span>
                  </p>
                ) : (
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    Simulated USSD PIN authorization prompt will trigger.
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-600 space-y-1">
              <p className="font-semibold text-gray-800">Cash Payment Confirmation</p>
              <p className="text-[11px] text-gray-500">
                Please hand exactly <strong>GH₵ {amount.toFixed(2)}</strong> to {request.collectorName || "the tricycle rider"}. The rider will confirm receipt on their device and a digital proof of payment will be issued.
              </p>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 bg-[#123B66] text-white font-bold rounded-xl text-xs hover:bg-blue-800 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Simulating Secure MoMo Gateway...</span>
              ) : (
                <>
                  <span>
                    Authorize Payment of GH₵ {amount.toFixed(2)}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <p className="text-[10px] text-center text-gray-400">
            Simulated environment for university evaluation &bull; No live bank debits occur.
          </p>
        </form>
      )}

      {/* Digital Receipt Modal */}
      {showReceiptModal && (
        <ReceiptModal
          request={request}
          onClose={() => setShowReceiptModal(false)}
        />
      )}

    </div>
  );
}

