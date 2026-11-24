"use client";

import React, { useState } from "react";
import { useWasteApp } from "@/context/WasteAppContext";
import DemoBanner from "@/components/common/DemoBanner";
import { UserRole, HouseholdUser, CollectorUser } from "@/types";
import {
  Users,
  Truck,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  UserPlus,
  LogIn,
} from "lucide-react";

interface AuthViewProps {
  onSuccess: (role: UserRole) => void;
  onCancel?: () => void;
}

const GHANA_AREAS = [
  "East Legon",
  "Madina",
  "Adenta",
  "Dansoman",
  "Kasoa",
  "Tema",
  "Spintex",
  "Osu",
  "Dome",
  "Achimota",
];

export default function AuthView({ onSuccess, onCancel }: AuthViewProps) {
  const {
    households,
    collectors,
    admin,
    switchRole,
    switchUserById,
    setCurrentUser,
    showToast,
  } = useWasteApp();

  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [role, setRole] = useState<"household" | "collector">("household");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("+233 24 ");
  const [area, setArea] = useState("East Legon");
  const [address, setAddress] = useState("");
  const [tricyclePlate, setTricyclePlate] = useState("");
  const [ghanaCard, setGhanaCard] = useState("");
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || fullName.trim().length < 3) {
      setErrorMsg("Please enter your full name (at least 3 characters).");
      showToast("Please enter your full name.", "error");
      return;
    }

    const normalizedPhone = phone.replace(/[\s-]/g, "");
    if (!/^(\+233|0)[235]\d{8}$/.test(normalizedPhone)) {
      setErrorMsg("Enter a valid Ghanaian phone number (e.g. +233 24 456 7890).");
      showToast("Please enter a valid +233 Ghanaian phone number.", "error");
      return;
    }

    if (role === "collector" && (!tricyclePlate.trim() || !ghanaCard.trim())) {
      setErrorMsg("Collectors must provide a tricycle plate number and Ghana Card PIN.");
      showToast("Please complete your tricycle & Ghana Card details.", "error");
      return;
    }

    setErrorMsg(null);

    if (role === "household") {
      const newHh: HouseholdUser = {
        id: "hh-" + Date.now().toString().slice(-4),
        name: fullName.trim(),
        email: `${fullName.trim().toLowerCase().replace(/\s+/g, ".")}@ghmail.com`,
        phone: phone.trim(),
        role: "household",
        avatar: "/avatars/cartoon-1.svg",
        location: `${area}, Accra`,
        address: address.trim() || `House 12, ${area} Main Road`,
        landmark: `Near ${area} Junction`,
        area,
        totalRequests: 0,
        completedRequests: 0,
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(newHh);
      showToast(`Welcome to WasteLink Ghana, ${newHh.name}!`, "success");
      onSuccess("household");
    } else {
      const newCol: CollectorUser = {
        id: "col-" + Date.now().toString().slice(-4),
        name: fullName.trim(),
        email: `${fullName.trim().toLowerCase().replace(/\s+/g, ".")}@ghmail.com`,
        phone: phone.trim(),
        role: "collector",
        avatar: "/avatars/cartoon-4.svg",
        location: `${area} Corridor`,
        isVerified: false,
        verificationStatus: "pending",
        ghanaCardNumber: ghanaCard.trim().toUpperCase(),
        tricycleRegNumber: tricyclePlate.trim().toUpperCase(),
        tricycleModel: "Motor King 200cc Cargo",
        isOnline: false,
        currentLat: 5.65,
        currentLng: -0.17,
        rating: 0,
        totalRatings: 0,
        completedJobs: 0,
        operatingAreas: [area],
        earnings: { today: 0, thisWeek: 0, thisMonth: 0, total: 0 },
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(newCol);
      showToast(`Collector account created for ${newCol.name}! Verification pending.`, "success");
      onSuccess("collector");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const query = loginEmailOrPhone.trim().toLowerCase();
    if (!query) {
      setErrorMsg("Enter your phone number or email, or pick a demo account above.");
      return;
    }

    const allUsers = [...households, ...collectors, admin];
    const matched = allUsers.find(
      (u) =>
        u.email.toLowerCase() === query ||
        u.phone.replace(/[\s-]/g, "").includes(query.replace(/[\s-]/g, "")) ||
        u.name.toLowerCase().includes(query)
    );

    if (!matched) {
      setErrorMsg("No matching account found. Try a sample account from the control bar above.");
      showToast("Account not found. Try a demo account or sign up.", "error");
      return;
    }

    setErrorMsg(null);
    switchUserById(matched.id);
    showToast(`Signed in as ${matched.name}`, "success");
    onSuccess(matched.role);
  };

  return (
    <div className="space-y-6">
      {/* Prototype Evaluator Control Bar placed on the Sign Up / Auth Page */}
      <div className="rounded-2xl shadow-md border border-[#0D2C4D]">
        <DemoBanner />
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-[#E2E8F0] shadow-card overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-[#F5F8FC] to-white">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="WasteLink Ghana"
              className="h-11 w-auto object-contain mix-blend-multiply"
            />
            <div>
              <h2 className="text-lg font-black text-[#172B43]">
                {mode === "signup" ? "Create Your WasteLink Account" : "Sign In to WasteLink Ghana"}
              </h2>
              <p className="text-xs text-[#64748B]">
                Register as a Household or Independent Tricycle Collector, or use the quick role bar above.
              </p>
            </div>
          </div>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-xs font-semibold text-[#64748B] hover:text-[#123B66] px-3 py-1.5 rounded-xl border border-[#E2E8F0] bg-white"
            >
              Back to App
            </button>
          )}
        </div>

        {/* Mode Tabs */}
        <div className="px-6 sm:px-8 pt-5 flex gap-2 border-b border-gray-100">
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setErrorMsg(null);
            }}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              mode === "signup"
                ? "border-[#123B66] text-[#123B66]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Sign Up</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMsg(null);
            }}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              mode === "login"
                ? "border-[#123B66] text-[#123B66]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {mode === "signup" ? (
            <form onSubmit={handleSignUp} className="space-y-4">
              {/* Role Selector */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("household")}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all flex items-center gap-3 ${
                    role === "household"
                      ? "border-[#2563EB] bg-blue-50/70 text-[#123B66]"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <Users className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <span className="block text-xs font-bold">Household</span>
                    <span className="text-[10px] opacity-80">Request pickups</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("collector")}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all flex items-center gap-3 ${
                    role === "collector"
                      ? "border-[#2563EB] bg-blue-50/70 text-[#123B66]"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <Truck className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <span className="block text-xs font-bold">Tricycle Collector</span>
                    <span className="text-[10px] opacity-80">Aboboyaa / Motor King</span>
                  </div>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Yaw Boateng"
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Ghana Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+233 24 456 7890"
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Area / Community</label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
                  >
                    {GHANA_AREAS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>

                {role === "household" ? (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Street / House Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. House 14, Boundary Road"
                      className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Tricycle Plate Number</label>
                      <input
                        type="text"
                        value={tricyclePlate}
                        onChange={(e) => setTricyclePlate(e.target.value)}
                        placeholder="e.g. GW-4821-24"
                        className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">National Ghana Card PIN</label>
                      <input
                        type="text"
                        value={ghanaCard}
                        onChange={(e) => setGhanaCard(e.target.value)}
                        placeholder="e.g. GHA-712398452-9"
                        className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono"
                      />
                    </div>
                  </>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#123B66] hover:bg-[#2563EB] text-white font-bold rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Create {role === "household" ? "Household" : "Collector"} Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Phone Number, Email, or Name
                </label>
                <input
                  type="text"
                  value={loginEmailOrPhone}
                  onChange={(e) => setLoginEmailOrPhone(e.target.value)}
                  placeholder="e.g. +233 24 456 7890 or Akosua Mensah"
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#123B66] hover:bg-[#2563EB] text-white font-bold rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            </form>
          )}

          {/* Quick Demo Accounts */}
          <div className="pt-4 border-t border-gray-100">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">
              Instant Demo Accounts
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  switchUserById(households[0].id);
                  onSuccess("household");
                }}
                className="p-3 rounded-xl border border-blue-200 bg-blue-50/40 hover:bg-blue-50 text-left text-xs transition-colors"
              >
                <span className="font-bold text-[#123B66] block">Akosua Mensah</span>
                <span className="text-[10px] text-gray-500">Household &bull; East Legon</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  switchUserById(collectors[0].id);
                  onSuccess("collector");
                }}
                className="p-3 rounded-xl border border-blue-200 bg-blue-50/40 hover:bg-blue-50 text-left text-xs transition-colors"
              >
                <span className="font-bold text-[#123B66] block">Kofi Mensah</span>
                <span className="text-[10px] text-gray-500">Collector &bull; Madina</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  switchRole("admin");
                  onSuccess("admin");
                }}
                className="p-3 rounded-xl border border-blue-200 bg-blue-50/40 hover:bg-blue-50 text-left text-xs transition-colors"
              >
                <span className="font-bold text-[#123B66] block">Dr. Kwabena Asare</span>
                <span className="text-[10px] text-gray-500">Administrator &bull; Accra</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

