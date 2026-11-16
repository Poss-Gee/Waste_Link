"use client";

import React, { useState, useEffect } from "react";
import { useWasteApp } from "@/context/WasteAppContext";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import LandingPageView from "@/components/common/LandingPageView";

// Household Views
import HouseholdDashboard from "@/components/household/HouseholdDashboard";
import RequestCollectionForm from "@/components/household/RequestCollectionForm";
import NearbyCollectorsView from "@/components/household/NearbyCollectorsView";
import PriceNegotiationChat from "@/components/household/PriceNegotiationChat";
import CollectionLiveTracker from "@/components/household/CollectionLiveTracker";
import PaymentView from "@/components/household/PaymentView";
import HouseholdHistoryView from "@/components/household/HouseholdHistoryView";
import ComplaintsView from "@/components/household/ComplaintsView";

// Collector Views
import CollectorDashboard from "@/components/collector/CollectorDashboard";
import IncomingRequestsView from "@/components/collector/IncomingRequestsView";
import ActiveJobExecutionView from "@/components/collector/ActiveJobExecutionView";
import CollectorEarningsView from "@/components/collector/CollectorEarningsView";
import CollectorVerificationView from "@/components/collector/CollectorVerificationView";

// Admin View
import AdminDashboardView from "@/components/admin/AdminDashboardView";

import { 
  Home, 
  PlusCircle, 
  Truck, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  MessageSquare,
  AlertTriangle,
  Menu
} from "lucide-react";

export default function HomeApp() {
  const { currentRole, switchRole, requests, currentUser } = useWasteApp();

  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [selectedRequestId, setSelectedRequestId] = useState<string | undefined>();
  const [isLandingMode, setIsLandingMode] = useState<boolean>(false);

  // Sync tab when role changes
  useEffect(() => {
    if (currentRole === "admin") {
      setActiveTab("overview");
    } else {
      setActiveTab("dashboard");
    }
  }, [currentRole]);

  // Find active request if needed
  const activeRequest = selectedRequestId
    ? requests.find((r) => r.id === selectedRequestId)
    : requests.find((r) => 
        (currentRole === "household" ? r.householdId === currentUser.id : r.collectorId === currentUser.id) &&
        r.status !== "paid" &&
        r.status !== "cancelled"
      ) || requests[0];

  const handleTabChange = (tab: string, reqId?: string) => {
    if (tab === "landing") {
      setIsLandingMode(true);
      return;
    }
    setIsLandingMode(false);
    setActiveTab(tab);
    if (reqId) setSelectedRequestId(reqId);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F7F9F5]">
      
      {/* Top Navigation */}
      <Navbar
        currentTab={activeTab}
        onTabChange={(tab) => handleTabChange(tab)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-12">
        
        {/* Toggle Landing / Public Marketing View */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Platform Mode:</span>
            <button
              onClick={() => setIsLandingMode(false)}
              className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all ${
                !isLandingMode
                  ? "bg-[#14532D] text-white shadow-xs"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Active Role Dashboard ({currentRole.toUpperCase()})
            </button>
            <button
              onClick={() => setIsLandingMode(true)}
              className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all ${
                isLandingMode
                  ? "bg-[#14532D] text-white shadow-xs"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Public Landing Page
            </button>
          </div>

          <div className="text-xs text-gray-500 hidden sm:block">
            Signed in as: <strong className="text-gray-900">{currentUser.name}</strong>
          </div>
        </div>

        {isLandingMode ? (
          <LandingPageView
            onEnterRole={(role) => {
              switchRole(role);
              setIsLandingMode(false);
              setActiveTab(role === "admin" ? "overview" : "dashboard");
            }}
          />
        ) : (
          <>
            {/* ROLE 1: HOUSEHOLD VIEWS */}
            {currentRole === "household" && (
              <>
                {activeTab === "dashboard" && (
                  <HouseholdDashboard
                    onNavigate={(tab, reqId) => handleTabChange(tab, reqId)}
                  />
                )}

                {activeTab === "request" && (
                  <RequestCollectionForm
                    onSuccess={(newReqId) => {
                      setSelectedRequestId(newReqId);
                      setActiveTab("tracking");
                    }}
                    onCancel={() => setActiveTab("dashboard")}
                  />
                )}

                {activeTab === "nearby" && (
                  <NearbyCollectorsView
                    onRequestDirect={(col) => {
                      setActiveTab("request");
                    }}
                  />
                )}

                {activeTab === "tracking" && activeRequest && (
                  <div className="space-y-6">
                    {activeRequest.status === "negotiating" ? (
                      <PriceNegotiationChat
                        request={activeRequest}
                        onNegotiationComplete={() => {
                          setActiveTab("tracking");
                        }}
                      />
                    ) : (
                      <CollectionLiveTracker
                        request={activeRequest}
                        onPayNow={() => setActiveTab("payment")}
                        onOpenNegotiation={() => {
                          // Toggle open
                        }}
                      />
                    )}
                  </div>
                )}

                {activeTab === "payment" && activeRequest && (
                  <PaymentView
                    request={activeRequest}
                    onPaymentSuccess={() => setActiveTab("history")}
                  />
                )}

                {activeTab === "history" && (
                  <HouseholdHistoryView
                    onOpenTracker={(reqId) => {
                      setSelectedRequestId(reqId);
                      setActiveTab("tracking");
                    }}
                  />
                )}

                {activeTab === "complaints" && <ComplaintsView />}
              </>
            )}

            {/* ROLE 2: COLLECTOR VIEWS */}
            {currentRole === "collector" && (
              <>
                {activeTab === "dashboard" && (
                  <CollectorDashboard
                    onNavigate={(tab, reqId) => handleTabChange(tab, reqId)}
                  />
                )}

                {activeTab === "requests" && (
                  <IncomingRequestsView
                    onOpenJob={(reqId) => {
                      setSelectedRequestId(reqId);
                      setActiveTab("jobs");
                    }}
                  />
                )}

                {activeTab === "jobs" && (
                  <ActiveJobExecutionView
                    requestId={selectedRequestId}
                    onJobFinished={() => setActiveTab("dashboard")}
                  />
                )}

                {(activeTab === "earnings" || activeTab === "history") && (
                  <CollectorEarningsView />
                )}

                {activeTab === "verification" && <CollectorVerificationView />}
              </>
            )}

            {/* ROLE 3: ADMIN VIEWS */}
            {currentRole === "admin" && (
              <AdminDashboardView initialTab={activeTab} />
            )}
          </>
        )}

      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR (for easy one-handed operation on smartphones) */}
      <nav aria-label="Mobile Navigation Bar" className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 py-2 px-3 shadow-lg">
        <div className="flex items-center justify-around text-center">
          
          {currentRole === "household" && (
            <>
              <button
                onClick={() => handleTabChange("dashboard")}
                className={`flex flex-col items-center text-[10px] font-semibold py-1 px-2 rounded-lg ${
                  activeTab === "dashboard" ? "text-[#14532D] font-bold" : "text-gray-500"
                }`}
              >
                <Home className="w-5 h-5 mb-0.5" />
                <span>Home</span>
              </button>

              <button
                onClick={() => handleTabChange("request")}
                className={`flex flex-col items-center text-[10px] font-semibold py-1 px-2 rounded-lg ${
                  activeTab === "request" ? "text-[#14532D] font-bold" : "text-gray-500"
                }`}
              >
                <PlusCircle className="w-5 h-5 mb-0.5" />
                <span>Request</span>
              </button>

              <button
                onClick={() => handleTabChange("nearby")}
                className={`flex flex-col items-center text-[10px] font-semibold py-1 px-2 rounded-lg ${
                  activeTab === "nearby" ? "text-[#14532D] font-bold" : "text-gray-500"
                }`}
              >
                <Truck className="w-5 h-5 mb-0.5" />
                <span>Nearby</span>
              </button>

              <button
                onClick={() => handleTabChange("tracking")}
                className={`flex flex-col items-center text-[10px] font-semibold py-1 px-2 rounded-lg ${
                  activeTab === "tracking" ? "text-[#14532D] font-bold" : "text-gray-500"
                }`}
              >
                <Clock className="w-5 h-5 mb-0.5" />
                <span>Tracking</span>
              </button>

              <button
                onClick={() => handleTabChange("history")}
                className={`flex flex-col items-center text-[10px] font-semibold py-1 px-2 rounded-lg ${
                  activeTab === "history" ? "text-[#14532D] font-bold" : "text-gray-500"
                }`}
              >
                <DollarSign className="w-5 h-5 mb-0.5" />
                <span>Receipts</span>
              </button>
            </>
          )}

          {currentRole === "collector" && (
            <>
              <button
                onClick={() => handleTabChange("dashboard")}
                className={`flex flex-col items-center text-[10px] font-semibold py-1 px-2 rounded-lg ${
                  activeTab === "dashboard" ? "text-[#14532D] font-bold" : "text-gray-500"
                }`}
              >
                <Home className="w-5 h-5 mb-0.5" />
                <span>Hub</span>
              </button>

              <button
                onClick={() => handleTabChange("requests")}
                className={`flex flex-col items-center text-[10px] font-semibold py-1 px-2 rounded-lg ${
                  activeTab === "requests" ? "text-[#14532D] font-bold" : "text-gray-500"
                }`}
              >
                <Clock className="w-5 h-5 mb-0.5" />
                <span>Requests</span>
              </button>

              <button
                onClick={() => handleTabChange("jobs")}
                className={`flex flex-col items-center text-[10px] font-semibold py-1 px-2 rounded-lg ${
                  activeTab === "jobs" ? "text-[#14532D] font-bold" : "text-gray-500"
                }`}
              >
                <Truck className="w-5 h-5 mb-0.5" />
                <span>Active Job</span>
              </button>

              <button
                onClick={() => handleTabChange("earnings")}
                className={`flex flex-col items-center text-[10px] font-semibold py-1 px-2 rounded-lg ${
                  activeTab === "earnings" ? "text-[#14532D] font-bold" : "text-gray-500"
                }`}
              >
                <DollarSign className="w-5 h-5 mb-0.5" />
                <span>Earnings</span>
              </button>

              <button
                onClick={() => handleTabChange("verification")}
                className={`flex flex-col items-center text-[10px] font-semibold py-1 px-2 rounded-lg ${
                  activeTab === "verification" ? "text-[#14532D] font-bold" : "text-gray-500"
                }`}
              >
                <ShieldCheck className="w-5 h-5 mb-0.5" />
                <span>Badge</span>
              </button>
            </>
          )}

          {currentRole === "admin" && (
            <>
              <button
                onClick={() => handleTabChange("overview")}
                className={`flex flex-col items-center text-[10px] font-semibold py-1 px-2 rounded-lg ${
                  activeTab === "overview" ? "text-[#14532D] font-bold" : "text-gray-500"
                }`}
              >
                <Home className="w-5 h-5 mb-0.5" />
                <span>Overview</span>
              </button>

              <button
                onClick={() => handleTabChange("verifications")}
                className={`flex flex-col items-center text-[10px] font-semibold py-1 px-2 rounded-lg ${
                  activeTab === "verifications" ? "text-[#14532D] font-bold" : "text-gray-500"
                }`}
              >
                <ShieldCheck className="w-5 h-5 mb-0.5" />
                <span>Queue</span>
              </button>

              <button
                onClick={() => handleTabChange("collections")}
                className={`flex flex-col items-center text-[10px] font-semibold py-1 px-2 rounded-lg ${
                  activeTab === "collections" ? "text-[#14532D] font-bold" : "text-gray-500"
                }`}
              >
                <Truck className="w-5 h-5 mb-0.5" />
                <span>Pickups</span>
              </button>

              <button
                onClick={() => handleTabChange("payments")}
                className={`flex flex-col items-center text-[10px] font-semibold py-1 px-2 rounded-lg ${
                  activeTab === "payments" ? "text-[#14532D] font-bold" : "text-gray-500"
                }`}
              >
                <DollarSign className="w-5 h-5 mb-0.5" />
                <span>MoMo</span>
              </button>

              <button
                onClick={() => handleTabChange("disputes")}
                className={`flex flex-col items-center text-[10px] font-semibold py-1 px-2 rounded-lg ${
                  activeTab === "disputes" ? "text-[#14532D] font-bold" : "text-gray-500"
                }`}
              >
                <AlertTriangle className="w-5 h-5 mb-0.5" />
                <span>Disputes</span>
              </button>
            </>
          )}

        </div>
      </nav>

      {/* Footer */}
      <Footer />

    </div>
  );
}
