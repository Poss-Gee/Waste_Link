"use client";

import React, { useState } from "react";
import { useWasteApp } from "@/context/WasteAppContext";
import { Complaint } from "@/types";
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Clock,
  PlusCircle,
  Send,
  MessageSquare,
} from "lucide-react";

export default function ComplaintsView() {
  const { currentUser, complaints, submitComplaint, requests } = useWasteApp();
  const [showNewForm, setShowNewForm] = useState(false);

  // Form State
  const [selectedReqId, setSelectedReqId] = useState("");
  const [category, setCategory] = useState<Complaint["category"]>("Spilled Waste");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  const myComplaints = complaints.filter((c) => c.complainantId === currentUser.id);
  const myRequests = requests.filter((r) => r.householdId === currentUser.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const relatedReq = requests.find((r) => r.id === selectedReqId);

    setTimeout(() => {
      submitComplaint({
        requestId: selectedReqId || (myRequests[0]?.id ?? "req-general"),
        targetId: relatedReq?.collectorId || "col-1",
        targetName: relatedReq?.collectorName || "Independent Collector",
        category,
        description,
      });

      setIsSubmitting(false);
      setShowNewForm(false);
      setDescription("");
      setSuccessNotice(true);
      setTimeout(() => setSuccessNotice(false), 4000);
    }, 500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            Customer Protection &amp; Dispute Resolution
          </div>
          <h2 className="text-xl font-bold text-gray-900">Complaints &amp; Support Inquiries</h2>
          <p className="text-xs text-gray-500 mt-1">
            Report any service issues such as spilled waste, no-shows, or fee disputes. Platform administrators mediate every report.
          </p>
        </div>

        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="px-4 py-2.5 bg-[#14532D] text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{showNewForm ? "Close Form" : "File a Complaint"}</span>
        </button>
      </div>

      {successNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Dispute submitted successfully! An administrator will review your case within 2 hours.</span>
        </div>
      )}

      {/* New Complaint Form */}
      {showNewForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-rose-200 shadow-card space-y-4 animate-in slide-in-from-top-2">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            Submit Issue Report
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Related Collection Request
              </label>
              <select
                value={selectedReqId}
                onChange={(e) => setSelectedReqId(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
              >
                <option value="">Select a collection (or General Inquiry)</option>
                {myRequests.map((r) => (
                  <option key={r.id} value={r.id}>
                    #{r.id} - {r.wasteCategory} ({r.collectorName || "Pending"})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Dispute Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
              >
                <option value="Spilled Waste">Spilled Waste on Ground</option>
                <option value="Overcharging Dispute">Overcharging / Asking above agreed price</option>
                <option value="No-Show">Collector did not show up</option>
                <option value="Rude Behavior">Unprofessional Conduct</option>
                <option value="Damaged Property">Property Damage</option>
                <option value="Other">Other Inquiry</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Detailed Incident Explanation
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain clearly what transpired, approximate time, and any agreements made with the collector..."
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setShowNewForm(false)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Submitting..." : "Submit Complaint"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Existing Complaints List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Your Filed Reports ({myComplaints.length})
        </h3>

        {myComplaints.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center text-xs text-gray-400 border border-gray-200">
            No complaints currently on record. Your previous collections have concluded cleanly.
          </div>
        ) : (
          myComplaints.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-gray-600">#{c.id}</span>
                  <span className="text-xs font-bold text-gray-900">{c.category}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      c.status === "resolved"
                        ? "bg-emerald-100 text-emerald-800"
                        : c.status === "under_review"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {c.status.replace(/_/g, " ").toUpperCase()}
                  </span>
                </div>
                <span className="text-[11px] text-gray-400">
                  {new Date(c.createdAt).toLocaleDateString("en-GB")}
                </span>
              </div>

              <div className="text-xs text-gray-700">
                <span className="text-gray-400 block text-[11px]">Regarding Request: #{c.requestId} (Collector: {c.targetName})</span>
                <p className="mt-1 bg-gray-50 p-3 rounded-xl border border-gray-100 italic">
                  &quot;{c.description}&quot;
                </p>
              </div>

              {c.adminNotes && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
                  <span className="font-bold flex items-center gap-1 text-emerald-900">
                    <ShieldAlert className="w-3.5 h-3.5 text-emerald-700" />
                    Platform Admin Resolution Note:
                  </span>
                  <p className="text-emerald-800 text-[11px]">{c.adminNotes}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
}
