"use client";

import React from "react";
import { CollectionRequest } from "@/types";
import { 
  CheckCircle2, 
  Printer, 
  Download, 
  X, 
  ShieldCheck, 
  Truck, 
  Calendar, 
  CreditCard,
  QrCode
} from "lucide-react";

interface ReceiptModalProps {
  request: CollectionRequest;
  onClose: () => void;
}

export default function ReceiptModal({ request, onClose }: ReceiptModalProps) {
  const handlePrint = () => {
    window.print();
  };

  const amount = request.agreedPrice || request.initialEstimatedPrice || 50;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-200 overflow-hidden animate-in zoom-in-95 print:shadow-none print:border-none print:m-0 print:w-full">
        
        {/* Receipt Header */}
        <div className="bg-[#14532D] text-white p-5 text-center relative print:bg-white print:text-black print:border-b">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-200 hover:text-white p-1 rounded-full hover:bg-white/10 print:hidden"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2 text-emerald-300">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">WasteLink Ghana</h2>
          <p className="text-xs text-emerald-200 mt-0.5">Official Service & Payment Receipt</p>
          <div className="mt-3 inline-block bg-white/10 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider">
            {request.receiptNumber || `REC-GH-2026-${request.id.slice(-4)}`}
          </div>
        </div>

        {/* Receipt Details Body */}
        <div className="p-6 space-y-4 text-xs text-gray-700">
          
          {/* Amount Box */}
          <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100">
            <span className="text-gray-500 text-[11px] uppercase tracking-wider block font-semibold">
              Amount Paid
            </span>
            <span className="text-3xl font-extrabold text-[#14532D] block mt-1">
              GH₵ {amount.toFixed(2)}
            </span>
            <span className="text-[11px] text-emerald-700 font-medium mt-1 inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Negotiated Rate &bull; Payment Verified
            </span>
          </div>

          {/* Details Table */}
          <div className="space-y-2.5 divide-y divide-gray-100">
            <div className="pt-2 flex justify-between">
              <span className="text-gray-500">Transaction Ref:</span>
              <span className="font-mono font-semibold text-gray-800">
                {request.paymentReference || `WL-TX-${request.id}`}
              </span>
            </div>

            <div className="pt-2 flex justify-between">
              <span className="text-gray-500">Date & Time:</span>
              <span className="font-medium text-gray-800">
                {request.paidAt ? new Date(request.paidAt).toLocaleString("en-GB") : new Date().toLocaleString("en-GB")}
              </span>
            </div>

            <div className="pt-2 flex justify-between">
              <span className="text-gray-500">Payment Mode:</span>
              <span className="font-semibold text-gray-800 capitalize flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
                {request.paymentMethod === "momo" 
                  ? `${request.momoProvider || "Mobile Money"} (${request.momoPhoneNumber || "Direct"})` 
                  : "Direct Cash to Collector"}
              </span>
            </div>

            <div className="pt-2 flex justify-between">
              <span className="text-gray-500">Customer:</span>
              <span className="font-medium text-gray-800">{request.householdName}</span>
            </div>

            <div className="pt-2 flex justify-between">
              <span className="text-gray-500">Collection Location:</span>
              <span className="font-medium text-gray-800 text-right max-w-[200px]">
                {request.address}, {request.area}
              </span>
            </div>

            <div className="pt-2 flex justify-between">
              <span className="text-gray-500">Waste Category:</span>
              <span className="font-medium text-gray-800">{request.wasteCategory}</span>
            </div>

            <div className="pt-2 flex justify-between">
              <span className="text-gray-500">Volume:</span>
              <span className="font-medium text-gray-800">{request.quantity}</span>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <span className="text-gray-500">Collector / Tricycle:</span>
              <div className="text-right">
                <div className="font-bold text-gray-900">{request.collectorName || "Independent Operator"}</div>
                <div className="text-[10px] text-gray-500 flex items-center justify-end gap-1">
                  <Truck className="w-3 h-3 text-emerald-600" />
                  {request.collectorTricycle || "Verified Tricycle"}
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Simulation & Security Footer */}
          <div className="pt-3 border-t border-dashed border-gray-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[10px] font-semibold text-gray-800">Tamper-Proof Verification</p>
              <p className="text-[9px] text-gray-500">Scan QR to authenticate in WasteLink Registry</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center p-1">
              <QrCode className="w-9 h-9 text-gray-700" />
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-gray-50 p-4 border-t border-gray-100 flex items-center justify-end gap-2 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-xs font-semibold hover:bg-gray-100 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
          
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#14532D] text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
