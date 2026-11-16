"use client";

import React, { useState } from "react";
import { useWasteApp } from "@/context/WasteAppContext";
import { CollectorUser } from "@/types";
import {
  Truck,
  Star,
  ShieldCheck,
  MapPin,
  Clock,
  Phone,
  Search,
  Filter,
  CheckCircle2,
  X,
  Award,
} from "lucide-react";

interface NearbyCollectorsViewProps {
  onRequestDirect: (collector: CollectorUser) => void;
}

export default function NearbyCollectorsView({ onRequestDirect }: NearbyCollectorsViewProps) {
  const { collectors } = useWasteApp();
  const [selectedCollector, setSelectedCollector] = useState<CollectorUser | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAreaFilter, setSelectedAreaFilter] = useState("all");
  const [onlyOnline, setOnlyOnline] = useState(false);

  // Filter collectors
  const filteredCollectors = collectors.filter((col) => {
    const matchesSearch =
      col.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.tricycleModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesArea =
      selectedAreaFilter === "all" ||
      col.operatingAreas.some((a) => a.toLowerCase() === selectedAreaFilter.toLowerCase());

    const matchesOnline = !onlyOnline || col.isOnline;

    return matchesSearch && matchesArea && matchesOnline;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Filters */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Nearby Independent Tricycle Collectors</h2>
          <p className="text-xs text-gray-500 mt-1">
            Browse verified local tricycle waste operators in your Ghanaian municipality. Check vehicle capacity, ratings, and request direct on-demand pickup.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by rider or tricycle model..."
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Area Filter */}
          <div>
            <select
              value={selectedAreaFilter}
              onChange={(e) => setSelectedAreaFilter(e.target.value)}
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
            >
              <option value="all">All Ghanaian Municipalities</option>
              <option value="Madina">Madina</option>
              <option value="East Legon">East Legon</option>
              <option value="Adenta">Adenta</option>
              <option value="Dansoman">Dansoman</option>
              <option value="Kasoa">Kasoa</option>
              <option value="Spintex">Spintex</option>
              <option value="Tema">Tema</option>
              <option value="Dome">Dome</option>
            </select>
          </div>

          {/* Online Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOnlyOnline(!onlyOnline)}
              className={`w-full text-xs font-semibold px-3 py-2.5 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                onlyOnline
                  ? "bg-[#14532D] text-white border-[#14532D]"
                  : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${onlyOnline ? "bg-emerald-400" : "bg-gray-400"}`}></span>
              <span>Online Operators Only</span>
            </button>
          </div>
        </div>
      </div>

      {/* Collectors Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCollectors.map((col, idx) => {
          // Simulated mock distance from household location
          const mockDist = (0.6 + (idx * 0.4)).toFixed(1);

          return (
            <div
              key={col.id}
              className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs hover:shadow-card hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Top: Avatar, Status & Verified */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-emerald-100 border border-emerald-200">
                        <img src={col.avatar} alt={col.name} className="w-full h-full object-cover" />
                      </div>
                      <span
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          col.isOnline ? "bg-emerald-500" : "bg-gray-400"
                        }`}
                        title={col.isOnline ? "Online & Ready" : "Offline"}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-gray-900 text-sm">{col.name}</h3>
                        {col.isVerified && (
                          <span title="Verified Driver">
                            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 font-medium">{col.location}</p>
                      <div className="flex items-center gap-1 mt-1 text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-gray-900">{col.rating > 0 ? col.rating.toFixed(1) : "New"}</span>
                        <span className="text-gray-400">({col.totalRatings} ratings)</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    ~{mockDist} km
                  </span>
                </div>

                {/* Tricycle Specs */}
                <div className="mt-4 p-3 bg-gray-50 rounded-xl space-y-1 text-xs border border-gray-100">
                  <div className="flex items-center justify-between text-gray-600">
                    <span className="flex items-center gap-1 text-gray-500">
                      <Truck className="w-3.5 h-3.5 text-emerald-600" />
                      Tricycle:
                    </span>
                    <span className="font-bold text-gray-900">{col.tricycleModel}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span className="text-gray-500">Plate Reg:</span>
                    <span className="font-mono font-semibold text-gray-800">{col.tricycleRegNumber}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span className="text-gray-500">Completed Pickups:</span>
                    <span className="font-semibold text-emerald-700">{col.completedJobs} loads</span>
                  </div>
                </div>

                {/* Operating Areas */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {col.operatingAreas.map((area) => (
                    <span
                      key={area}
                      className="text-[10px] bg-emerald-50/70 text-emerald-800 font-medium px-2 py-0.5 rounded-md"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSelectedCollector(col)}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-colors text-center"
                >
                  View Profile
                </button>
                <button
                  type="button"
                  onClick={() => onRequestDirect(col)}
                  className="px-3 py-2 bg-[#14532D] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors text-center"
                >
                  Request Pickup
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Collector Profile Detail Modal */}
      {selectedCollector && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 animate-in zoom-in-95 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-emerald-100 border-2 border-emerald-300">
                  <img
                    src={selectedCollector.avatar}
                    alt={selectedCollector.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-gray-900">{selectedCollector.name}</h3>
                    {selectedCollector.isVerified && (
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{selectedCollector.location}</p>
                  <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                    {selectedCollector.isOnline ? "● Currently Online & Ready for Dispatch" : "○ Currently Offline"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCollector(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center py-2 bg-emerald-50 rounded-xl border border-emerald-100">
              <div>
                <span className="text-[10px] text-gray-500 font-medium">Customer Rating</span>
                <div className="text-sm font-bold text-gray-900 flex items-center justify-center gap-1 mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {selectedCollector.rating > 0 ? selectedCollector.rating.toFixed(1) : "New"}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 font-medium">Verified Jobs</span>
                <div className="text-sm font-bold text-emerald-800 mt-0.5">
                  {selectedCollector.completedJobs}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 font-medium">Verification</span>
                <div className="text-sm font-bold text-gray-900 mt-0.5">
                  {selectedCollector.isVerified ? "Ghana Card ✓" : "Pending"}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Tricycle Model:</span>
                <span className="font-semibold text-gray-900">{selectedCollector.tricycleModel}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Vehicle Plate:</span>
                <span className="font-mono font-semibold text-gray-900">{selectedCollector.tricycleRegNumber}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">National Ghana Card:</span>
                <span className="font-mono text-gray-700">
                  {selectedCollector.ghanaCardNumber ? selectedCollector.ghanaCardNumber.slice(0, 7) + "••••-•" : "Verified"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Contact Number:</span>
                <span className="font-mono text-gray-900">{selectedCollector.phone}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedCollector(null)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const c = selectedCollector;
                  setSelectedCollector(null);
                  onRequestDirect(c);
                }}
                className="px-5 py-2 bg-[#14532D] text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors"
              >
                Request Pickup from {selectedCollector.name.split(" ")[0]}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
