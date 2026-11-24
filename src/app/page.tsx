"use client";

import React, { useState, useEffect } from "react";
import { WasteAppProvider, useWasteApp } from "@/context/WasteAppContext";
import DemoBanner from "@/components/common/DemoBanner";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import LandingPageView from "@/components/common/LandingPageView";
import WheelieBinSplash from "@/components/common/WheelieBinSplash";
import ToastContainer from "@/components/common/ToastContainer";

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
  Play,
} from "lucide-react";

function WasteLinkMainApp() {
  const { currentRole, switchRole, requests, currentUser, toasts, dismissToast } = useWasteApp();

  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [selectedRequestId, setSelectedRequestId] = useState<string | undefined>();
  const [isLandingMode, setIsLandingMode] = useState<boolean>(false);
  const [showSplash, setShowSplash] = useState<boolean>(false);
  const [forceNegotiationView, setForceNegotiationView] = useState<boolean>(false);

  // Show wheelie-bin launch animation on first visit in this session
  useEffect(() => {
    try {
      const seen = sessionStorage.getItem("wastelink_splash_seen");
      if (!seen) {
        setShowSplash(true);
      }
    } catch {
      setShowSplash(true);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    try {
      sessionStorage.setItem("wastelink_splash_seen", "1");
    } catch {
      // Ignore storage errors
    }
  };

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
    setForceNegotiationView(false);
    setActiveTab(tab);
    if (reqId) setSelectedRequestId(reqId);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F7F9F5]">
      {showSplash && <WheelieBinSplash onComplete={handleSplashComplete} />}
      
      {/* Evaluator Quick Control Bar */}
      <DemoBanner />

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
            <span className="text-xs text-gray-500 font-medium">Platform View:</span>
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
            <button
              onClick={() => setShowSplash(true)}
              className="text-xs px-2.5 py-1 rounded-lg font-bold bg-emerald-50 text-[#14532D] border border-emerald-200 hover:bg-emerald-100 transition-all inline-flex items-center gap-1"
              title="Replay launch animation"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Replay Intro</span>
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
                    onRequestDirect={() => {
                      setActiveTab("request");
                    }}
                  />
                )}

                {activeTab === "tracking" && (
                  activeRequest ? (
                    <div className="space-y-6">
                      {activeRequest.status === "negotiating" || forceNegotiationView ? (
                        <div className="space-y-3">
                          {forceNegotiationView && activeRequest.status !== "negotiating" && (
                            <button
                              onClick={() => setForceNegotiationView(false)}
                              className="text-xs font-bold text-[#14532D] hover:underline flex items-center gap-1"
                            >
                              &larr; Back to Live Collection Tracker
                            </button>
                          )}
                          <PriceNegotiationChat
                            request={activeRequest}
                            onNegotiationComplete={() => {
                              setForceNegotiationView(false);
                              setActiveTab("tracking");
                            }}
                          />
                        </div>
                      ) : (
                        <CollectionLiveTracker
                          request={activeRequest}
                          onPayNow={() => setActiveTab("payment")}
                          onOpenNegotiation={() => setForceNegotiationView(true)}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl p-10 text-center border border-[#E5EAE4] shadow-xs space-y-3">
                      <Clock className="w-10 h-10 text-gray-300 mx-auto" />
                      <h3 className="text-base font-bold text-[#17231B]">No Active Collection Found</h3>
                      <p className="text-xs text-[#647067] max-w-md mx-auto">
                        You don&apos;t have a collection in progress right now. Request an on-demand pickup to start tracking a nearby tricycle collector.
                      </p>
                      <button
                        onClick={() => setActiveTab("request")}
                        className="px-5 py-2.5 bg-[#14532D] text-white rounded-xl text-xs font-bold hover:bg-[#16A34A] transition-colors inline-flex items-center gap-1.5"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Request Rubbish Pickup</span>
                      </button>
                    </div>
                  )
                )}

                {activeTab === "payment" && (
                  activeRequest ? (
                    <PaymentView
                      request={activeRequest}
                      onPaymentSuccess={() => setActiveTab("history")}
                    />
                  ) : (
                    <div className="bg-white rounded-2xl p-10 text-center border border-[#E5EAE4] shadow-xs space-y-3">
                      <DollarSign className="w-10 h-10 text-gray-300 mx-auto" />
                      <h3 className="text-base font-bold text-[#17231B]">No Pending Payment</h3>
                      <p className="text-xs text-[#647067] max-w-md mx-auto">
                        Payments are enabled once a collector completes your pickup. View your past receipts in Collection History.
                      </p>
                      <button
                        onClick={() => setActiveTab("history")}
                        className="px-5 py-2.5 bg-[#14532D] text-white rounded-xl text-xs font-bold hover:bg-[#16A34A] transition-colors"
                      >
                        View Collection History
                      </button>
                    </div>
                  )
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

      {/* MOBILE BOTTOM NAVIGATION BAR */}
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
                <ShieldCheck className="w-5 h-5 mb-0.5" />
                <span>Disputes</span>
              </button>
            </>
          )}

        </div>
      </nav>

      {/* Footer */}
      <Footer />

      {/* Global Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default function HomeApp() {
  return (
    <WasteAppProvider>
      <WasteLinkMainApp />
    </WasteAppProvider>
  );
}
