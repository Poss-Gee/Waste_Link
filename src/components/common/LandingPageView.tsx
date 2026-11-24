"use client";

import React from "react";
import { useWasteApp } from "@/context/WasteAppContext";
import {
  Recycle,
  Truck,
  Users,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  MapPin,
  ArrowRight,
  Smartphone,
  Sparkles,
  WifiOff,
} from "lucide-react";

interface LandingPageViewProps {
  onEnterRole: (role: "household" | "collector" | "admin") => void;
}

export default function LandingPageView({ onEnterRole }: LandingPageViewProps) {
  const { households, collectors, admin, switchRole, switchUserById } = useWasteApp();

  return (
    <div className="space-y-16 py-8">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-[#14532D] via-[#166534] to-[#15803D] rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden">
            
            {/* Background Tricycle Artwork */}
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-10 translate-y-10">
              <Truck className="w-96 h-96 text-white" />
            </div>

            <div className="max-w-2xl space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-emerald-200 text-xs font-bold border border-white/15 backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>Smart Household Waste &bull; Greater Accra Municipal Pilot</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Connecting Homes. Empowering Collectors. Cleaner Communities.
              </h1>

              <p className="text-sm sm:text-base text-emerald-100 leading-relaxed font-normal">
                WasteLink Ghana is an independent technology platform bridging Ghanaian households with verified independent tricycle waste operators (Aboboyaa / Motor King). Request on-demand collection, negotiate fair prices in GH₵, and settle instantly with cash or Mobile Money.
              </p>

              {/* Quick Role Entry Buttons */}
              <div className="pt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => onEnterRole("household")}
                  className="px-6 py-3.5 bg-white text-[#14532D] font-black rounded-2xl shadow-lg hover:bg-emerald-50 transition-all transform hover:scale-[1.02] flex items-center gap-2 text-sm"
                >
                  <Users className="w-4 h-4 text-[#16A34A]" />
                  <span>Enter as Household</span>
                </button>

                <button
                  onClick={() => onEnterRole("collector")}
                  className="px-6 py-3.5 bg-[#16A34A] text-white font-black rounded-2xl shadow-lg hover:bg-emerald-500 transition-all transform hover:scale-[1.02] flex items-center gap-2 text-sm border border-emerald-400"
                >
                  <Truck className="w-4 h-4 text-white" />
                  <span>Enter as Tricycle Collector</span>
                </button>

                <button
                  onClick={() => onEnterRole("admin")}
                  className="px-6 py-3.5 bg-black/30 text-white font-bold rounded-2xl border border-white/20 hover:bg-black/50 transition-all flex items-center gap-2 text-sm"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>Admin Console</span>
                </button>
              </div>

            </div>

            {/* Live Stats Pill in Banner */}
            <div className="mt-10 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-emerald-300 block font-medium">Platform Model</span>
                <span className="font-bold text-white text-sm">100% On-Demand</span>
              </div>
              <div>
                <span className="text-emerald-300 block font-medium">Pricing Scheme</span>
                <span className="font-bold text-white text-sm">Negotiated in GH₵</span>
              </div>
              <div>
                <span className="text-emerald-300 block font-medium">Disposal Safety</span>
                <span className="font-bold text-white text-sm">Approved Landfills</span>
              </div>
              <div>
                <span className="text-emerald-300 block font-medium">PWA Offline Capable</span>
                <span className="font-bold text-white text-sm">Local Queue Sync</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Evaluator Quick Demo Accounts Picker */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-card space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Interactive Prototype Demo Accounts
            </span>
            <h2 className="text-2xl font-black text-gray-900">
              Explore All 3 Role Perspectives
            </h2>
            <p className="text-xs text-gray-500">
              Click any sample account to enter the application immediately with realistic preloaded data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            
            {/* Household Card */}
            <div className="p-6 rounded-2xl border-2 border-emerald-100 hover:border-emerald-600 bg-emerald-50/20 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-gray-900">Household / Resident</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Post rubbish collection bookings on-demand, pick location via GPS map, negotiate price with riders, track collection live, and pay with cash or simulated MoMo.
                </p>
                <div className="p-3 bg-white rounded-xl border border-gray-100 text-xs space-y-1">
                  <p className="font-bold text-gray-900">Akosua Mensah (East Legon)</p>
                  <p className="text-[11px] text-gray-500">+233 24 456 7890 &bull; 1 Active Negotiation</p>
                </div>
              </div>

              <button
                onClick={() => {
                  switchUserById(households[0].id);
                  onEnterRole("household");
                }}
                className="w-full py-3 bg-[#14532D] text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Launch Household Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Collector Card */}
            <div className="p-6 rounded-2xl border-2 border-emerald-100 hover:border-emerald-600 bg-emerald-50/20 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-gray-900">Tricycle Waste Collector</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Toggle availability, browse nearby requests, propose prices, navigate to households, upload collection evidence, confirm cash/MoMo, and view daily earnings.
                </p>
                <div className="p-3 bg-white rounded-xl border border-gray-100 text-xs space-y-1">
                  <p className="font-bold text-gray-900">Kofi Mensah (Speedy Kofi)</p>
                  <p className="text-[11px] text-gray-500">Motor King 200cc &bull; GW-4821-23 &bull; Verified</p>
                </div>
              </div>

              <button
                onClick={() => {
                  switchUserById(collectors[0].id);
                  onEnterRole("collector");
                }}
                className="w-full py-3 bg-[#14532D] text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Launch Collector Hub</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Administrator Card */}
            <div className="p-6 rounded-2xl border-2 border-emerald-100 hover:border-emerald-600 bg-emerald-50/20 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-gray-900">Platform Administrator</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Audit national Ghana Cards &amp; tricycle registration documents, monitor live collections, mediate complaints, inspect MoMo transactions, and view live analytics.
                </p>
                <div className="p-3 bg-white rounded-xl border border-gray-100 text-xs space-y-1">
                  <p className="font-bold text-gray-900">Dr. Kwabena Asare</p>
                  <p className="text-[11px] text-gray-500">Chief Coordinator &bull; Greater Accra Region</p>
                </div>
              </div>

              <button
                onClick={() => {
                  switchUserById(admin.id);
                  onEnterRole("admin");
                }}
                className="w-full py-3 bg-[#14532D] text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Launch Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* How it Works Step-by-Step */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-black text-gray-900">
              The Transparent WasteLink Workflow
            </h2>
            <p className="text-xs text-gray-500">
              No middleman delays. Direct on-demand connection between homes and local tricycle riders.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-2 text-center">
              <div className="w-10 h-10 rounded-full bg-[#14532D] text-white flex items-center justify-center mx-auto font-black text-sm">
                1
              </div>
              <h3 className="font-bold text-sm text-gray-900">Request Pickup</h3>
              <p className="text-xs text-gray-500">
                Pin your gate location in Accra/Madina, select waste type, and upload a load picture.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-2 text-center">
              <div className="w-10 h-10 rounded-full bg-[#14532D] text-white flex items-center justify-center mx-auto font-black text-sm">
                2
              </div>
              <h3 className="font-bold text-sm text-gray-900">Negotiate Price</h3>
              <p className="text-xs text-gray-500">
                Receive proposals from verified riders. Counteroffer or accept a fair rate in GH₵.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-2 text-center">
              <div className="w-10 h-10 rounded-full bg-[#14532D] text-white flex items-center justify-center mx-auto font-black text-sm">
                3
              </div>
              <h3 className="font-bold text-sm text-gray-900">Track &amp; Load</h3>
              <p className="text-xs text-gray-500">
                Watch tricycle approach via simulated GPS. The operator loads bags and uploads proof.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-2 text-center">
              <div className="w-10 h-10 rounded-full bg-[#14532D] text-white flex items-center justify-center mx-auto font-black text-sm">
                4
              </div>
              <h3 className="font-bold text-sm text-gray-900">Pay &amp; Receipt</h3>
              <p className="text-xs text-gray-500">
                Pay by Cash or Mobile Money. Receive an instant tamper-proof digital receipt.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

