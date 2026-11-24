"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

interface WheelieBinSplashProps {
  onComplete: () => void;
}

export default function WheelieBinSplash({ onComplete }: WheelieBinSplashProps) {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadingOut(true);
    }, 2700);

    const doneTimer = setTimeout(() => {
      onComplete();
    }, 3150);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setFadingOut(true);
    setTimeout(onComplete, 250);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#F7F9F5] transition-opacity duration-500 ${
        fadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-label="WasteLink Ghana Launch Animation"
    >
      {/* Skip button for quick navigation */}
      <button
        onClick={handleSkip}
        className="absolute top-5 right-5 px-3.5 py-1.5 rounded-full bg-white border border-[#E5EAE4] text-xs font-bold text-[#647067] hover:text-[#14532D] hover:border-[#16A34A] shadow-xs transition-all flex items-center gap-1"
      >
        <span>Skip</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>

      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-10 px-4">
        <img
          src="/logo.png"
          alt="WasteLink Ghana — Connecting Homes. Empowering Collectors. Cleaner Communities."
          className="h-20 sm:h-24 w-auto object-contain mix-blend-multiply"
        />
      </div>

      {/* Track Stage */}
      <div className="relative w-full max-w-md px-6">
        <div className="relative h-36 flex items-end justify-center overflow-hidden">
          {/* Moving Blue Wheelie Bin */}
          <div className="animate-bin-travel relative z-10">
            <svg
              width="115"
              height="128"
              viewBox="0 0 115 128"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-md overflow-visible"
            >
              {/* Motion / pull wind lines behind the bin */}
              <g className="animate-speed-wind">
                <line x1="-18" y1="54" x2="4" y2="54" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="-26" y1="68" x2="2" y2="68" stroke="#86EFAC" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="-14" y1="82" x2="6" y2="82" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
              </g>

              {/* Bin Group that tilts back onto its rear wheel */}
              <g className="animate-bin-tilt">
                {/* Main Blue Body (tapered wheelie bin) */}
                <path
                  d="M24 34 L86 34 L80 105 C79.5 109 76.5 111 72 111 L35 111 C31 111 28 108.5 27.5 104.5 L24 34 Z"
                  fill="#1D4ED8"
                />
                {/* Right-side depth shading */}
                <path
                  d="M66 34 L86 34 L80 105 C79.5 109 76.5 111 72 111 L63 111 L66 34 Z"
                  fill="#1E40AF"
                />
                {/* Vertical structural ribs under rim */}
                <rect x="33" y="36" width="3.5" height="10" rx="1.5" fill="#1E3A8A" opacity="0.65" />
                <rect x="46" y="36" width="3.5" height="10" rx="1.5" fill="#1E3A8A" opacity="0.65" />
                <rect x="60" y="36" width="3.5" height="10" rx="1.5" fill="#1E3A8A" opacity="0.65" />

                {/* Upper Rim Lip */}
                <rect x="19" y="29" width="72" height="7" rx="3" fill="#2563EB" />
                <rect x="19" y="33" width="72" height="2.5" rx="1" fill="#1E40AF" />

                {/* Hinged Lid + Front Handle */}
                <path
                  d="M21 29 C21 23 25 20 32 20 L80 20 C86 20 89 23 89 29 Z"
                  fill="#2563EB"
                />
                {/* Lid top ridge */}
                <path
                  d="M36 20 C38 16.5 42 15.5 48 15.5 L67 15.5 C72 15.5 75 17 77 20 Z"
                  fill="#3B82F6"
                />
                {/* Pull Handle on left side of lid */}
                <path
                  d="M22 22 L22 17 C22 15.5 23.5 14.5 25.5 14.5 L34 14.5 C35.5 14.5 36.5 15.5 36.5 17 L36.5 21"
                  stroke="#1D4ED8"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* White Circular Litter Emblem (matching photo) */}
                <circle cx="50" cy="68" r="14" stroke="#FFFFFF" strokeWidth="2.2" fill="#1D4ED8" />
                {/* Person silhouette */}
                <circle cx="54.5" cy="61.5" r="2" fill="#FFFFFF" />
                <path
                  d="M54 64 L54 72 L52 77 M54 72 L56.5 77 M54 65.5 L48.5 64"
                  stroke="#FFFFFF"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Small basket */}
                <path d="M42.5 67.5 L47.5 67.5 L46.8 75 L43.2 75 Z" fill="#FFFFFF" />

                {/* Rear Axle Bracket */}
                <rect x="74" y="96" width="10" height="10" rx="3" fill="#1E293B" />

                {/* Spinning Black Rubber Wheel */}
                <g className="animate-wheel-spin">
                  <circle cx="82" cy="104" r="14" fill="#1F2937" />
                  <circle cx="82" cy="104" r="11" stroke="#374151" strokeWidth="1.5" fill="#111827" />
                  {/* Wheel Spokes so rotation is clearly visible */}
                  <line x1="82" y1="94" x2="82" y2="114" stroke="#6B7280" strokeWidth="1.8" />
                  <line x1="72" y1="104" x2="92" y2="104" stroke="#6B7280" strokeWidth="1.8" />
                  <line x1="75" y1="97" x2="89" y2="111" stroke="#6B7280" strokeWidth="1.5" />
                  <line x1="89" y1="97" x2="75" y2="111" stroke="#6B7280" strokeWidth="1.5" />
                  <circle cx="82" cy="104" r="3.5" fill="#9CA3AF" />
                </g>
              </g>
            </svg>
          </div>
        </div>

        {/* Road / Progress Track */}
        <div className="w-full h-2 bg-[#E5EAE4] rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-gradient-to-r from-[#14532D] to-[#16A34A] rounded-full animate-track-fill" />
        </div>

        <div className="flex items-center justify-between text-[11px] font-semibold text-[#647067] mt-2.5">
          <span>Preparing pickup network...</span>
          <span className="text-[#16A34A] font-bold">Accra &bull; Ready</span>
        </div>
      </div>
    </div>
  );
}

