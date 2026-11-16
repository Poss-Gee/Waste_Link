"use client";

import React, { useState } from "react";
import { useWasteApp } from "@/context/WasteAppContext";
import {
  Users,
  Truck,
  ShieldCheck,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  Filter,
  Activity,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  Banknote,
} from "lucide-react";
import ReceiptModal from "@/components/common/ReceiptModal";
import { CollectionRequest } from "@/types";

interface AdminDashboardViewProps {
  initialTab?: string;
}

export default function AdminDashboardView({ initialTab = "overview" }: AdminDashboardViewProps) {
  const {
    households,
    collectors,
    requests,
    complaints,
    activityLogs,
    verifyCollector,
    resolveComplaint,
  } = useWasteApp();

  const [activeSubTab, setActiveSubTab] = useState<string>(initialTab);
  const [collectorSearch, setCollectorSearch] = useState("");
  const [householdSearch, setHouseholdSearch] = useState("");
  const [requestFilter, setRequestFilter] = useState("all");
  const [selectedReceipt, setSelectedReceipt] = useState<CollectionRequest | null>(null);

  // Resolution modal state
  const [resolvingComplaintId, setResolvingComplaintId] = useState<string | null>(null);
  const [adminResolutionNotes, setAdminResolutionNotes] = useState("");

  // DYNAMIC KPI CALCULATIONS (strictly from state!)
  const totalHouseholds = households.length;
  const registeredCollectors = collectors.length;
  const verifiedCollectors = collectors.filter((c) => c.isVerified).length;
  const pendingVerifications = collectors.filter((c) => c.verificationStatus === "pending").length;
  const totalRequests = requests.length;
  const completedCollections = requests.filter((r) => r.status === "paid").length;
  const cancelledCollections = requests.filter((r) => r.status === "cancelled").length;
  const activeOnlineCollectors = collectors.filter((c) => c.isOnline).length;
  
  const totalTransactionValue = requests
    .filter((r) => r.status === "paid")
    .reduce((sum, r) => sum + (r.agreedPrice || r.initialEstimatedPrice || 0), 0);

  const cashTransactions = requests.filter((r) => r.status === "paid" && r.paymentMethod === "cash");
  const momoTransactions = requests.filter((r) => r.status === "paid" && r.paymentMethod === "momo");

  const cashValue = cashTransactions.reduce((sum, r) => sum + (r.agreedPrice || r.initialEstimatedPrice || 0), 0);
  const momoValue = momoTransactions.reduce((sum, r) => sum + (r.agreedPrice || r.initialEstimatedPrice || 0), 0);

  const openComplaintsCount = complaints.filter((c) => c.status !== "resolved").length;

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingComplaintId || !adminResolutionNotes.trim()) return;
    resolveComplaint(resolvingComplaintId, adminResolutionNotes);
    setResolvingComplaintId(null);
    setAdminResolutionNotes("");
  };

  return (
    <div className="space-y-6">
      
      {/* Admin Sub Navigation Bar */}
      <div className="bg-white rounded-2xl p-2 border border-gray-200 shadow-xs flex flex-wrap gap-1.5">
        {[
          { id: "overview", label: "Executive Overview", badge: undefined },
          { id: "verifications", label: "Verification Queue", badge: pendingVerifications > 0 ? pendingVerifications : undefined },
          { id: "collections", label: "All Collections", badge: undefined },
          { id: "collectors", label: "Tricycles Fleet", badge: undefined },
          { id: "households", label: "Households", badge: undefined },
          { id: "payments", label: "Payments & MoMo", badge: undefined },
          { id: "disputes", label: "Disputes & Support", badge: openComplaintsCount > 0 ? openComplaintsCount : undefined },
          { id: "analytics", label: "Audit Logs", badge: undefined },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeSubTab === tab.id
                ? "bg-[#14532D] text-white shadow-xs font-bold"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeSubTab === tab.id ? "bg-amber-400 text-black" : "bg-rose-600 text-white"
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 1. EXECUTIVE OVERVIEW TAB */}
      {activeSubTab === "overview" && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Top KPI Cards (Calculated directly from live state) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
              <span className="text-[11px] text-gray-400 font-semibold uppercase">Total Households</span>
              <div className="text-2xl font-black text-gray-900 mt-1">{totalHouseholds}</div>
              <span className="text-[10px] text-emerald-700 font-medium">Verified Accounts</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
              <span className="text-[11px] text-gray-400 font-semibold uppercase">Tricycle Collectors</span>
              <div className="text-2xl font-black text-[#14532D] mt-1">{registeredCollectors}</div>
              <span className="text-[10px] text-emerald-600 font-medium">{verifiedCollectors} Verified &bull; {activeOnlineCollectors} Online</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
              <span className="text-[11px] text-gray-400 font-semibold uppercase">Pending Audits</span>
              <div className="text-2xl font-black text-amber-600 mt-1">{pendingVerifications}</div>
              <span className="text-[10px] text-amber-700 font-medium">Awaiting Ghana Card check</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
              <span className="text-[11px] text-gray-400 font-semibold uppercase">Total Pickups</span>
              <div className="text-2xl font-black text-gray-900 mt-1">{totalRequests}</div>
              <span className="text-[10px] text-emerald-700 font-medium">{completedCollections} Done &bull; {cancelledCollections} Cancelled</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs bg-emerald-50/30">
              <span className="text-[11px] text-emerald-900 font-semibold uppercase">Gross GMV (GH₵)</span>
              <div className="text-2xl font-black text-[#14532D] mt-1">GH₵ {totalTransactionValue.toFixed(0)}</div>
              <span className="text-[10px] text-emerald-800 font-medium">100% Settled</span>
            </div>

          </div>

          {/* Graphical Analytics & Breakdown Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Payment Distribution Chart */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-gray-900 flex items-center justify-between">
                <span>Payment Channels Ratio</span>
                <span className="text-xs font-semibold text-emerald-700">Live Breakdown</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-gray-600 flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                      Mobile Money (MTN / Telecel / AT)
                    </span>
                    <span className="font-bold text-gray-900">
                      GH₵ {momoValue.toFixed(2)} ({momoTransactions.length} tx)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all"
                      style={{
                        width: `${totalTransactionValue > 0 ? (momoValue / totalTransactionValue) * 100 : 50}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Banknote className="w-3.5 h-3.5 text-amber-600" />
                      Direct Cash to Tricycle Rider
                    </span>
                    <span className="font-bold text-gray-900">
                      GH₵ {cashValue.toFixed(2)} ({cashTransactions.length} tx)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all"
                      style={{
                        width: `${totalTransactionValue > 0 ? (cashValue / totalTransactionValue) * 100 : 50}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl text-[11px] text-gray-600 border border-gray-100">
                Independent platform model: 0% extractive commission applied during pilot. 100% of negotiated amount goes directly to independent tricycle waste operators.
              </div>
            </div>

            {/* Waste Categories Haul Distribution */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-gray-900">Waste Categories Collected</h3>
              
              <div className="space-y-2 text-xs">
                {[
                  "General Household Rubbish",
                  "Kitchen & Organic Waste",
                  "Plastic & Recyclable Materials",
                  "Bulky / Garden / E-Waste",
                  "Commercial Small-Shop Waste",
                ].map((cat) => {
                  const count = requests.filter((r) => r.wasteCategory === cat).length;
                  const pct = Math.round((count / Math.max(1, requests.length)) * 100);

                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-gray-700 truncate max-w-[200px]">{cat}</span>
                        <span className="font-bold text-gray-900">{count} ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#14532D] rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Pending Verifications Callout */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Verification Action Needed
                </h3>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                  {pendingVerifications} Pending
                </span>
              </div>

              {pendingVerifications === 0 ? (
                <div className="p-6 text-center text-xs text-gray-400">
                  All collector verification applications have been reviewed.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {collectors
                    .filter((c) => c.verificationStatus === "pending")
                    .map((col) => (
                      <div
                        key={col.id}
                        className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 flex items-center justify-between gap-2"
                      >
                        <div>
                          <p className="text-xs font-bold text-gray-900">{col.name}</p>
                          <p className="text-[10px] text-gray-500 font-mono">
                            Ghana Card: {col.ghanaCardNumber}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            Tricycle: {col.tricycleRegNumber}
                          </p>
                        </div>

                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            onClick={() => verifyCollector(col.id, true)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => verifyCollector(col.id, false)}
                            className="px-2 py-1 bg-gray-100 hover:bg-rose-50 hover:text-rose-600 text-gray-600 rounded-lg text-xs font-medium transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              <button
                onClick={() => setActiveSubTab("verifications")}
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-colors mt-2"
              >
                Open Full Verification Queue &rarr;
              </button>
            </div>

          </div>

          {/* Real-time Activity Feed */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                Real-Time Platform Activity Audit Trail
              </h3>
              <span className="text-xs text-gray-400">Live system events</span>
            </div>

            <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
              {activityLogs.slice(0, 8).map((log) => (
                <div key={log.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {log.action}
                    </span>
                    <p className="text-gray-800 font-medium mt-1">{log.details}</p>
                    <span className="text-[10px] text-gray-400">
                      Actor: {log.actor} ({log.actorRole})
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 2. VERIFICATION QUEUE TAB */}
      {activeSubTab === "verifications" && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-gray-900">
                Independent Tricycle Operator Verification Queue
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Audit National Ghana Cards, Driver&apos;s Permits, and DVLA Tricycle Commercial Registrations.
              </p>
            </div>
            <span className="px-3 py-1 bg-amber-50 text-amber-800 font-bold text-xs rounded-full border border-amber-200">
              {pendingVerifications} Pending Approvals
            </span>
          </div>

          <div className="divide-y divide-gray-200">
            {collectors.map((c) => (
              <div key={c.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-emerald-100 flex-shrink-0">
                    <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-900 text-sm">{c.name}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.isVerified
                          ? "bg-emerald-100 text-emerald-800"
                          : c.verificationStatus === "pending"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}>
                        {c.verificationStatus.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 font-mono">
                      Ghana Card: <strong>{c.ghanaCardNumber}</strong> &bull; Plate: <strong>{c.tricycleRegNumber}</strong>
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Model: {c.tricycleModel} &bull; Operating Zones: {c.operatingAreas.join(", ")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {!c.isVerified ? (
                    <>
                      <button
                        onClick={() => verifyCollector(c.id, true)}
                        className="px-4 py-2 bg-[#14532D] text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors shadow-xs"
                      >
                        Approve &amp; Authenticate
                      </button>
                      <button
                        onClick={() => verifyCollector(c.id, false)}
                        className="px-3 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-semibold hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Approved &amp; Certified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ALL COLLECTIONS TAB */}
      {activeSubTab === "collections" && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-gray-900">
                All Platform Collection Requests ({requests.length})
              </h3>
              <p className="text-xs text-gray-500">Real-time status of all household bookings in Greater Accra</p>
            </div>

            {/* Filter */}
            <select
              value={requestFilter}
              onChange={(e) => setRequestFilter(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-gray-300 bg-white"
            >
              <option value="all">All Lifecycles</option>
              <option value="requested">1. Requested (Open)</option>
              <option value="negotiating">2. Negotiating Price</option>
              <option value="price_agreed">3. Price Agreed</option>
              <option value="collector_en_route">4. Collector En Route</option>
              <option value="collector_arrived">5. Arrived</option>
              <option value="in_progress">6. In Progress</option>
              <option value="completed">7. Completed</option>
              <option value="paid">8. Paid &amp; Closed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 font-semibold uppercase text-[10px]">
                  <th className="py-2.5">ID</th>
                  <th className="py-2.5">Household</th>
                  <th className="py-2.5">Tricycle Collector</th>
                  <th className="py-2.5">Category &amp; Volume</th>
                  <th className="py-2.5">Area</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Fee (GH₵)</th>
                  <th className="py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests
                  .filter((r) => requestFilter === "all" || r.status === requestFilter)
                  .map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50/50">
                      <td className="py-3 font-mono font-bold text-gray-600">#{r.id}</td>
                      <td className="py-3 font-semibold text-gray-900">{r.householdName}</td>
                      <td className="py-3 text-gray-700">{r.collectorName || "Unassigned"}</td>
                      <td className="py-3 text-gray-600">{r.wasteCategory} ({r.quantity.split(" ")[0]})</td>
                      <td className="py-3 text-emerald-800 font-medium">{r.area}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.status === "paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : r.status === "cancelled"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {r.status.replace(/_/g, " ").toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 text-right font-black text-[#14532D]">
                        GH₵ {r.agreedPrice || r.initialEstimatedPrice}
                      </td>
                      <td className="py-3 text-right">
                        {r.status === "paid" && (
                          <button
                            onClick={() => setSelectedReceipt(r)}
                            className="text-xs text-emerald-700 hover:underline font-semibold"
                          >
                            Receipt
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. DISPUTES & COMPLAINTS TAB */}
      {activeSubTab === "disputes" && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-gray-900">Complaints &amp; Dispute Mediation</h3>
              <p className="text-xs text-gray-500">Protecting both households and independent collectors</p>
            </div>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              {openComplaintsCount} Open Dispute(s)
            </span>
          </div>

          <div className="divide-y divide-gray-200">
            {complaints.map((c) => (
              <div key={c.id} className="py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-gray-500">#{c.id}</span>
                    <h4 className="font-bold text-sm text-gray-900">{c.category}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      c.status === "resolved"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    }`}>
                      {c.status.toUpperCase()}
                    </span>
                  </div>

                  <span className="text-xs text-gray-400">
                    {new Date(c.createdAt).toLocaleDateString("en-GB")}
                  </span>
                </div>

                <div className="text-xs text-gray-700 bg-gray-50 p-3 rounded-xl">
                  <p><strong>Complainant:</strong> {c.complainantName} ({c.complainantRole})</p>
                  <p><strong>Target Party:</strong> {c.targetName}</p>
                  <p className="mt-1 italic">&quot;{c.description}&quot;</p>
                </div>

                {c.adminNotes && (
                  <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-950 border border-emerald-100">
                    <p className="font-bold text-emerald-900">Resolution:</p>
                    <p className="text-[11px] text-emerald-800">{c.adminNotes}</p>
                  </div>
                )}

                {c.status !== "resolved" && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => setResolvingComplaintId(c.id)}
                      className="px-4 py-2 bg-[#14532D] text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors shadow-xs"
                    >
                      Mediate &amp; Resolve Dispute
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. HOUSEHOLDS MANAGEMENT TAB */}
      {activeSubTab === "households" && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-gray-900">
              Registered Household Directory ({households.length})
            </h3>
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={householdSearch}
                onChange={(e) => setHouseholdSearch(e.target.value)}
                placeholder="Search households..."
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl border border-gray-300"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 font-semibold uppercase text-[10px]">
                  <th className="py-2.5">Name</th>
                  <th className="py-2.5">Area &amp; Landmark</th>
                  <th className="py-2.5">Phone Number</th>
                  <th className="py-2.5 text-right">Total Pickups</th>
                  <th className="py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {households
                  .filter((h) => h.name.toLowerCase().includes(householdSearch.toLowerCase()))
                  .map((h) => (
                    <tr key={h.id} className="hover:bg-gray-50/50">
                      <td className="py-3 font-bold text-gray-900 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full overflow-hidden bg-emerald-100 flex-shrink-0">
                          <img src={h.avatar} alt={h.name} className="w-full h-full object-cover" />
                        </div>
                        <span>{h.name}</span>
                      </td>
                      <td className="py-3 text-gray-700">{h.area} &bull; {h.landmark}</td>
                      <td className="py-3 font-mono text-gray-600">{h.phone}</td>
                      <td className="py-3 text-right font-bold text-emerald-800">{h.totalRequests}</td>
                      <td className="py-3 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. PAYMENTS & MOMO TAB */}
      {activeSubTab === "payments" && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-gray-900">
                Payments &amp; Mobile Money Ledger
              </h3>
              <p className="text-xs text-gray-500">Gross transaction monitoring for Accra pilot</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400">Total Volume</span>
              <p className="text-xl font-black text-[#14532D]">GH₵ {totalTransactionValue.toFixed(2)}</p>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {requests
              .filter((r) => r.status === "paid")
              .map((r) => (
                <div key={r.id} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-gray-800">{r.paymentReference}</span>
                      <span className="text-gray-500">&bull;</span>
                      <span className="font-semibold text-gray-900">{r.householdName} &rarr; {r.collectorName}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {r.paymentMethod === "momo" ? `${r.momoProvider || "Mobile Money"} (${r.momoPhoneNumber || "Direct"})` : "Direct Cash to Rider"} &bull; {r.area}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-[#14532D]">
                      GH₵ {(r.agreedPrice || 45).toFixed(2)}
                    </span>
                    <button
                      onClick={() => setSelectedReceipt(r)}
                      className="px-3 py-1 bg-gray-100 hover:bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold"
                    >
                      Audit Receipt
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 7. AUDIT LOGS TAB */}
      {activeSubTab === "analytics" && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4 animate-in fade-in">
          <h3 className="font-bold text-base text-gray-900">Complete Platform Audit Logs</h3>
          <div className="divide-y divide-gray-100">
            {activityLogs.map((log) => (
              <div key={log.id} className="py-2.5 flex items-start justify-between text-xs gap-3">
                <div>
                  <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {log.action}
                  </span>
                  <p className="text-gray-800 mt-1">{log.details}</p>
                  <span className="text-[10px] text-gray-400">
                    By: {log.actor} ({log.actorRole})
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString("en-GB")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mediation Resolution Modal */}
      {resolvingComplaintId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4 animate-in zoom-in-95">
            <h3 className="font-bold text-base text-gray-900">
              Admin Dispute Resolution &bull; #{resolvingComplaintId}
            </h3>
            <p className="text-xs text-gray-500">
              Enter official findings and resolution notes. Both household and collector will be informed.
            </p>

            <form onSubmit={handleResolveSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Official Resolution Findings
                </label>
                <textarea
                  rows={4}
                  required
                  value={adminResolutionNotes}
                  onChange={(e) => setAdminResolutionNotes(e.target.value)}
                  placeholder="e.g. Spilled waste cleaned by collector; verified via follow-up call. Case concluded amicably."
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setResolvingComplaintId(null)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#14532D] text-white rounded-xl text-xs font-bold hover:bg-emerald-800"
                >
                  Confirm Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {selectedReceipt && (
        <ReceiptModal
          request={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}

    </div>
  );
}
