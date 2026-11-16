"use client";

import React, { useState } from "react";
import { MapPin, Navigation, Compass, Check } from "lucide-react";

interface GhanaMapPickerProps {
  selectedArea: string;
  landmark: string;
  onSelectLocation: (location: { area: string; landmark: string; lat: number; lng: number }) => void;
}

const GHANA_POPULAR_ZONES = [
  { area: "Madina", landmark: "Near Zongo Junction / Ritz", lat: 5.6833, lng: -0.1667 },
  { area: "East Legon", landmark: "Boundary Road near Starbites", lat: 5.6355, lng: -0.1558 },
  { area: "Adenta", landmark: "Behind Adenta Barrier TotalEnergies", lat: 5.712, lng: -0.158 },
  { area: "Dansoman", landmark: "Sahara near Keep Fit Club", lat: 5.5562, lng: -0.2743 },
  { area: "Kasoa", landmark: "CP Area / New Market Road", lat: 5.5344, lng: -0.4244 },
  { area: "Spintex", landmark: "Coastal Estates Gate 2 / Ecobank", lat: 5.6201, lng: -0.1102 },
  { area: "Tema", landmark: "Community 4 Aggrey Road", lat: 5.6698, lng: -0.0166 },
  { area: "Dome", landmark: "Pillar 2 / Railway Crossing", lat: 5.6412, lng: -0.2311 },
  { area: "Achimota", landmark: "Kingsby Junction / Neoplan", lat: 5.6155, lng: -0.2241 },
  { area: "Osu", landmark: "Oxford Street / Castle Road", lat: 5.558, lng: -0.185 },
];

export default function GhanaMapPicker({
  selectedArea,
  landmark,
  onSelectLocation,
}: GhanaMapPickerProps) {
  const [currentSelection, setCurrentSelection] = useState(
    GHANA_POPULAR_ZONES.find((z) => z.area.toLowerCase() === selectedArea.toLowerCase()) ||
      GHANA_POPULAR_ZONES[0]
  );
  const [pinOffset, setPinOffset] = useState({ x: 50, y: 50 });

  const handleSelectZone = (zone: typeof GHANA_POPULAR_ZONES[0]) => {
    setCurrentSelection(zone);
    onSelectLocation({
      area: zone.area,
      landmark: zone.landmark,
      lat: zone.lat,
      lng: zone.lng,
    });
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(Math.max(0, ((e.clientX - rect.left) / rect.width) * 100), 100);
    const y = Math.min(Math.max(0, ((e.clientY - rect.top) / rect.height) * 100), 100);
    setPinOffset({ x, y });

    // Pick closest zone
    const idx = Math.floor((x / 100) * GHANA_POPULAR_ZONES.length) % GHANA_POPULAR_ZONES.length;
    const picked = GHANA_POPULAR_ZONES[idx];
    setCurrentSelection(picked);
    onSelectLocation({
      area: picked.area,
      landmark: landmark || picked.landmark,
      lat: picked.lat + (Math.random() - 0.5) * 0.01,
      lng: picked.lng + (Math.random() - 0.5) * 0.01,
    });
  };

  return (
    <div className="space-y-3">
      {/* Quick Ghana Zone chips */}
      <div className="flex flex-wrap gap-1.5">
        {GHANA_POPULAR_ZONES.slice(0, 6).map((z) => (
          <button
            key={z.area}
            type="button"
            onClick={() => handleSelectZone(z)}
            className={`text-xs px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 ${
              currentSelection.area === z.area
                ? "bg-[#14532D] text-white border-[#14532D] font-medium shadow-sm"
                : "bg-white text-gray-700 border-gray-200 hover:border-emerald-500"
            }`}
          >
            {currentSelection.area === z.area && <Check className="w-3 h-3 text-emerald-300" />}
            {z.area}
          </button>
        ))}
      </div>

      {/* Interactive Map Visual Simulator */}
      <div 
        onClick={handleMapClick}
        className="relative h-48 w-full rounded-xl overflow-hidden border border-emerald-900/20 bg-[#e8efe8] cursor-crosshair group shadow-inner"
      >
        {/* Map Grid / Styled Roads graphic */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(#16a34a 0.75px, transparent 0.75px), linear-gradient(to right, #d5e4d5 1px, transparent 1px), linear-gradient(to bottom, #d5e4d5 1px, transparent 1px)`,
            backgroundSize: "20px 20px, 40px 40px, 40px 40px"
          }}
        />

        {/* Decorative Roads & Coastline representing Accra */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-35" preserveAspectRatio="none" viewBox="0 0 400 200">
          <path d="M 0 170 Q 150 160 250 180 T 400 170" fill="none" stroke="#0284c7" strokeWidth="8" />
          <path d="M 50 0 L 220 200" fill="none" stroke="#94a399" strokeWidth="3" strokeDasharray="4 2" />
          <path d="M 180 0 L 190 200" fill="none" stroke="#16a34a" strokeWidth="4" />
          <path d="M 0 80 Q 200 110 400 60" fill="none" stroke="#16a34a" strokeWidth="4" />
          <circle cx="210" cy="85" r="28" fill="#16a34a" fillOpacity="0.08" />
        </svg>

        {/* Landmarks Markers */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-semibold text-emerald-900 shadow-sm flex items-center gap-1 border border-emerald-100">
          <Compass className="w-3 h-3 text-emerald-600 animate-spin" style={{ animationDuration: "12s" }} />
          <span>Greater Accra &bull; GPS Active</span>
        </div>

        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded font-mono">
          Lat: {currentSelection.lat.toFixed(4)} &bull; Lng: {currentSelection.lng.toFixed(4)}
        </div>

        {/* Animated Location Pin */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-full transition-all duration-300 pointer-events-none"
          style={{ left: `${pinOffset.x}%`, top: `${pinOffset.y}%` }}
        >
          <div className="relative flex flex-col items-center">
            <div className="bg-[#14532D] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg border border-white flex items-center gap-1 whitespace-nowrap mb-0.5">
              <MapPin className="w-3 h-3 text-emerald-300" />
              <span>{currentSelection.area}</span>
            </div>
            <div className="w-4 h-4 rounded-full bg-emerald-600 border-2 border-white shadow-md flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
            <div className="w-6 h-2 rounded-full bg-black/20 blur-[2px] mt-0.5"></div>
          </div>
        </div>

        {/* Click indicator note */}
        <div className="absolute bottom-2 left-2 text-[10px] text-gray-500 bg-white/80 px-2 py-0.5 rounded">
          Click map to pin collection point
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-600 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-emerald-700 flex-shrink-0" />
          <div>
            <span className="font-semibold text-gray-900">{currentSelection.area}: </span>
            <span className="text-gray-600">{landmark || currentSelection.landmark}</span>
          </div>
        </div>
        <span className="text-[11px] font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
          Verified Zone
        </span>
      </div>
    </div>
  );
}
