"use client";

import React from "react";
import { Recycle, ShieldCheck, Heart, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#14532D] text-emerald-100 border-t border-[#0f3d21] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Recycle className="w-5 h-5 text-emerald-200" />
              </div>
              <span className="font-extrabold text-white text-lg tracking-tight">WasteLink Ghana</span>
            </div>
            <p className="text-xs text-emerald-200/90 leading-relaxed">
              Connecting Homes. Empowering Collectors. Cleaner Communities. An independent Ghanaian digital platform linking households with verified tricycle waste collectors.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Independent Platform &bull; Non-Zoomlion Dependent</span>
            </div>
          </div>

          {/* Ghanaian Coverage Zones */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Pilot Operational Hubs
            </h4>
            <ul className="text-xs space-y-1.5 text-emerald-200/80">
              <li>&bull; Madina &amp; Adenta Municipalities</li>
              <li>&bull; East Legon &amp; Boundary Road</li>
              <li>&bull; Dansoman &amp; Greater Ablekuma</li>
              <li>&bull; Kasoa Central &amp; CP Corridor</li>
              <li>&bull; Spintex &amp; Tema Communities</li>
              <li>&bull; Dome &amp; Achimota Corridors</li>
            </ul>
          </div>

          {/* Waste Categories & Model */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              On-Demand Services
            </h4>
            <ul className="text-xs space-y-1.5 text-emerald-200/80">
              <li>&bull; Domestic Household Rubbish</li>
              <li>&bull; Separated Plastic &amp; Recyclables</li>
              <li>&bull; Kitchen &amp; Organic Compostable</li>
              <li>&bull; Bulky Tree Trimmings &amp; Scrap</li>
              <li>&bull; Transparent Price Negotiation in GH₵</li>
              <li>&bull; Instant Cash &amp; MoMo Digital Receipts</li>
            </ul>
          </div>

          {/* Platform Standards & Help */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Inquiries &amp; Verification
            </h4>
            <div className="text-xs space-y-2 text-emerald-200/80">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>+233 24 100 0001 (Toll-Free Pilot)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>support@wastelink.gh</span>
              </div>
              <p className="text-[11px] text-emerald-300/80 pt-2 border-t border-emerald-800">
                PWA Ready &bull; Offline Capable Sync &bull; Built for Ghanaian Tricycle Operators (Aboboyaa / Motor King)
              </p>
            </div>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-300/70 gap-2">
          <p>&copy; {new Date().getFullYear()} WasteLink Ghana. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Developed with pride for cleaner Ghanaian communities
          </p>
        </div>
      </div>
    </footer>
  );
}
