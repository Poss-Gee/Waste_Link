"use client";

import React, { useState } from "react";
import { useWasteApp } from "@/context/WasteAppContext";
import { CollectorUser } from "@/types";
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Upload,
} from "lucide-react";

export default function CollectorVerificationView() {
  const { currentUser } = useWasteApp();
  const collector = currentUser as CollectorUser;

  const [isEditing, setIsEditing] = useState(false);
  const [ghanaCard, setGhanaCard] = useState(collector.ghanaCardNumber);
  const [tricycleReg, setTricycleReg] = useState(collector.tricycleRegNumber);
  const [model, setModel] = useState(collector.tricycleModel);
  const [saveNotice, setSaveNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveNotice(true);
    setIsEditing(false);
    setTimeout(() => setSaveNotice(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Status Banner */}
      <div className={`rounded-2xl p-6 text-white shadow-card ${
        collector.isVerified
          ? "bg-[#14532D]"
          : collector.verificationStatus === "pending"
          ? "bg-amber-600"
          : "bg-rose-700"
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold tracking-wider opacity-80">
              Accra Municipal Environmental Safety Permit
            </span>
            <h2 className="text-2xl font-black">
              {collector.isVerified
                ? "Verified Operator Status: Active"
                : collector.verificationStatus === "pending"
                ? "Verification Pending Administrator Review"
                : "Verification Resubmission Required"}
            </h2>
            <p className="text-xs opacity-90">
              {collector.isVerified
                ? "Your National Ghana Card and tricycle registration are fully authenticated. You are authorized to accept jobs."
                : "Your submitted documents are currently in the administrator audit queue."}
            </p>
          </div>

          <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-xs text-center border border-white/20 self-start sm:self-auto">
            <span className="text-xs font-bold uppercase tracking-wider block">Badge ID</span>
            <span className="font-mono text-sm font-black">{collector.id.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {saveNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Vehicle details updated successfully and queued for audit!</span>
        </div>
      )}

      {/* Verified Credentials Details */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            Registered Legal Credentials
          </h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
          >
            {isEditing ? "Cancel" : "Update Documents"}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                National Ghana Card PIN
              </label>
              <input
                type="text"
                required
                value={ghanaCard}
                onChange={(e) => setGhanaCard(e.target.value)}
                placeholder="GHA-000000000-0"
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-300 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Tricycle Registration Plate
              </label>
              <input
                type="text"
                required
                value={tricycleReg}
                onChange={(e) => setTricycleReg(e.target.value)}
                placeholder="GW-0000-24"
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-300 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Tricycle Make &amp; Engine Spec
              </label>
              <input
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. Motor King 200cc Heavy Duty"
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-300"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border rounded-xl text-xs font-semibold text-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#14532D] text-white rounded-xl text-xs font-bold hover:bg-emerald-800"
              >
                Save &amp; Resubmit
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-gray-50 rounded-xl space-y-1">
              <span className="text-gray-400 block text-[11px]">National Ghana Card</span>
              <p className="font-mono font-bold text-gray-900 text-sm">
                {collector.ghanaCardNumber || "GHA-712398452-9"}
              </p>
              <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Verified with National Identification Authority
              </span>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl space-y-1">
              <span className="text-gray-400 block text-[11px]">Tricycle License Plate</span>
              <p className="font-mono font-bold text-gray-900 text-sm">
                {collector.tricycleRegNumber || "GW-4821-23"}
              </p>
              <span className="text-[10px] text-gray-500">
                DVLA Commercial Tricycle Tag
              </span>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl space-y-1">
              <span className="text-gray-400 block text-[11px]">Vehicle Specifications</span>
              <p className="font-bold text-gray-900 text-sm">
                {collector.tricycleModel}
              </p>
              <span className="text-[10px] text-gray-500">
                Payload capacity: ~600 kg cart
              </span>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl space-y-1">
              <span className="text-gray-400 block text-[11px]">Authorized Municipal Zones</span>
              <p className="font-bold text-gray-900 text-sm">
                {collector.operatingAreas.join(", ")}
              </p>
              <span className="text-[10px] text-emerald-700 font-semibold">
                Accra Waste Assembly Registered
              </span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
