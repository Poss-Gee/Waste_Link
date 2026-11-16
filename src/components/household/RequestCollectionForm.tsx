"use client";

import React, { useState } from "react";
import { useWasteApp } from "@/context/WasteAppContext";
import { WasteCategory, WasteQuantity, HouseholdUser } from "@/types";
import {
  MapPin,
  Camera,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
  DollarSign,
  ArrowRight,
  Upload,
} from "lucide-react";
import GhanaMapPicker from "@/components/common/GhanaMapPicker";

interface RequestCollectionFormProps {
  onSuccess: (requestId: string) => void;
  onCancel: () => void;
}

const SAMPLE_WASTE_PHOTOS = [
  {
    name: "General Mixed Bags",
    url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Clean Plastics & Bottles",
    url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Garden Branches & Debris",
    url: "https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=400&q=80",
  },
];

export default function RequestCollectionForm({
  onSuccess,
  onCancel,
}: RequestCollectionFormProps) {
  const { currentUser, createCollectionRequest } = useWasteApp();
  const household = currentUser as HouseholdUser;

  // Form State
  const [area, setArea] = useState(household.area || "Madina");
  const [address, setAddress] = useState(household.address || "House 24, Boundary Road");
  const [landmark, setLandmark] = useState(household.landmark || "Near junction");
  const [lat, setLat] = useState(5.6833);
  const [lng, setLng] = useState(-0.1667);

  const [wasteCategory, setWasteCategory] = useState<WasteCategory>("General Household Rubbish");
  const [quantity, setQuantity] = useState<WasteQuantity>("3 - 5 Standard Bags");
  const [description, setDescription] = useState(
    "Domestic trash from family kitchen and compound, double-bagged and ready by front entrance."
  );
  const [specialInstructions, setSpecialInstructions] = useState(
    "Please call when arriving at gate so we can unlock."
  );
  const [photoUrl, setPhotoUrl] = useState<string>(SAMPLE_WASTE_PHOTOS[0].url);
  const [estimatedPrice, setEstimatedPrice] = useState<number>(45);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update suggested price whenever quantity or category changes
  const updatePriceEstimate = (q: WasteQuantity, c: WasteCategory) => {
    let base = 35;
    if (q === "1 - 2 Standard Bags") base = 30;
    else if (q === "3 - 5 Standard Bags") base = 45;
    else if (q === "Half Tricycle Cart (3-5 Bins)") base = 65;
    else if (q === "Full Tricycle Cart Load (Heavy)") base = 95;

    if (c === "Bulky / Garden / E-Waste") base += 20;
    if (c === "Commercial Small-Shop Waste") base += 15;
    if (c === "Plastic & Recyclable Materials") base -= 5; // Eco incentive
    setEstimatedPrice(base);
  };

  const handleQuantityChange = (newQ: WasteQuantity) => {
    setQuantity(newQ);
    updatePriceEstimate(newQ, wasteCategory);
  };

  const handleCategoryChange = (newC: WasteCategory) => {
    setWasteCategory(newC);
    updatePriceEstimate(quantity, newC);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const created = createCollectionRequest({
        area,
        address,
        landmark,
        lat,
        lng,
        wasteCategory,
        quantity,
        description,
        specialInstructions,
        photoUrl,
        initialEstimatedPrice: estimatedPrice,
      });

      setIsSubmitting(false);
      onSuccess(created.id);
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-[#14532D] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              On-Demand Collection Request
            </div>
            <h2 className="text-xl font-bold text-gray-900">Request Rubbish Pickup</h2>
            <p className="text-xs text-gray-500 mt-1">
              Submit details of your waste. Nearby tricycle collectors will receive your booking and propose transparent pickup prices.
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-xs font-semibold text-gray-500 hover:text-gray-800 px-3 py-1.5 rounded-lg border border-gray-200"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Step 1: Location & Map */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#14532D] text-white text-[11px] flex items-center justify-center font-bold">1</span>
              Collection Location (Ghana)
            </h3>
            <span className="text-[11px] text-emerald-700 font-semibold">Tricycle GPS Target</span>
          </div>

          <GhanaMapPicker
            selectedArea={area}
            landmark={landmark}
            onSelectLocation={(loc) => {
              setArea(loc.area);
              setLandmark(loc.landmark);
              setLat(loc.lat);
              setLng(loc.lng);
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Area / Neighbourhood
              </label>
              <input
                type="text"
                required
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Madina, East Legon, Adenta"
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Prominent Landmark
              </label>
              <input
                type="text"
                required
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Opposite Starbites, Behind Total station"
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Residential Street Address & Gate Description
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. House 24, Boundary Road (Green gate)"
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Waste Category & Quantity */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#14532D] text-white text-[11px] flex items-center justify-center font-bold">2</span>
              Waste Classification &amp; Quantity
            </h3>
            <span className="text-[11px] text-gray-500">Accra Municipal Guidelines</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Select Waste Category
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(
                [
                  "General Household Rubbish",
                  "Kitchen & Organic Waste",
                  "Plastic & Recyclable Materials",
                  "Bulky / Garden / E-Waste",
                  "Commercial Small-Shop Waste",
                ] as WasteCategory[]
              ).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={`p-3 rounded-xl text-left border text-xs font-medium transition-all flex items-start justify-between ${
                    wasteCategory === cat
                      ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs"
                      : "border-gray-200 text-gray-700 hover:border-emerald-300 bg-white"
                  }`}
                >
                  <span>{cat}</span>
                  {wasteCategory === cat && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 ml-2" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Approximate Volume / Quantity
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(
                [
                  "1 - 2 Standard Bags",
                  "3 - 5 Standard Bags",
                  "Half Tricycle Cart (3-5 Bins)",
                  "Full Tricycle Cart Load (Heavy)",
                ] as WasteQuantity[]
              ).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleQuantityChange(q)}
                  className={`p-3 rounded-xl text-center border text-xs font-medium transition-all ${
                    quantity === q
                      ? "border-emerald-600 bg-[#14532D] text-white font-bold shadow-xs"
                      : "border-gray-200 text-gray-700 hover:border-emerald-300 bg-white"
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Description &amp; Items Summary
            </label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. 4 black bin bags filled with kitchen rubbish, tied tightly."
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Special Gate Instructions (Optional)
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Call before honking, keep gate closed for pets."
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Step 3: Rubbish Photo Preview */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#14532D] text-white text-[11px] flex items-center justify-center font-bold">3</span>
              Waste Photograph (Helps Collectors Quote Fairly)
            </h3>
            <span className="text-[11px] text-gray-500">Optional but recommended</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SAMPLE_WASTE_PHOTOS.map((sample) => (
              <div
                key={sample.name}
                onClick={() => setPhotoUrl(sample.url)}
                className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all aspect-video group ${
                  photoUrl === sample.url
                    ? "border-emerald-600 ring-2 ring-emerald-400"
                    : "border-gray-200 hover:border-emerald-300"
                }`}
              >
                <img src={sample.url} alt={sample.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2">
                  <span className="text-[10px] text-white font-medium">{sample.name}</span>
                </div>
                {photoUrl === sample.url && (
                  <div className="absolute top-1.5 right-1.5 bg-emerald-600 text-white rounded-full p-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Camera className="w-4 h-4 text-gray-400" />
            <span>Select one of the sample waste loads or upload a camera photo.</span>
          </div>
        </div>

        {/* Price Suggestion Banner */}
        <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Estimated Baseline Price Range
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#14532D]">
                GH₵ {estimatedPrice}
              </span>
              <span className="text-xs text-gray-500">suggested starting quote</span>
            </div>
            <p className="text-[11px] text-gray-600">
              Tricycle riders will evaluate the request and send price proposals. You can accept or negotiate counteroffers.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#14532D] text-white font-bold rounded-xl shadow-md hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Broadcasting to Tricycles...</span>
            ) : (
              <>
                <span>Broadcast Collection Request</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
