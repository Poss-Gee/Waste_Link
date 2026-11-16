"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useWasteApp } from "@/context/WasteAppContext";
import {
  Recycle,
  Bell,
  CheckCircle,
  PlusCircle,
  Search,
  Clock,
  DollarSign,
  ShieldCheck,
  AlertTriangle,
  Menu,
  X,
  MapPin,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  badge?: number;
}

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navbar({ currentTab, onTabChange }: NavbarProps) {
  const {
    currentUser,
    currentRole,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    requests,
  } = useWasteApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filter unread notifications
  const userNotifications = notifications.filter(
    (n) => n.userId === currentUser.id || n.role === currentRole || n.role === "all"
  );
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  // Active collection count for household or collector
  const activeJobsCount = requests.filter(
    (r) =>
      r.status !== "paid" &&
      r.status !== "cancelled" &&
      (currentRole === "household" ? r.householdId === currentUser.id : r.collectorId === currentUser.id)
  ).length;

  const getHouseholdNav = (): NavItem[] => [
    { id: "dashboard", label: "Dashboard" },
    { id: "request", label: "Request Rubbish Pickup" },
    { id: "nearby", label: "Nearby Tricycles" },
    { id: "tracking", label: "Live Tracking & Offers", badge: activeJobsCount > 0 ? activeJobsCount : undefined },
    { id: "history", label: "Collection History" },
    { id: "complaints", label: "Support & Disputes" },
  ];

  const getCollectorNav = (): NavItem[] => [
    { id: "dashboard", label: "Collector Hub" },
    { id: "requests", label: "Incoming Requests" },
    { id: "jobs", label: "Active Job & Route", badge: activeJobsCount > 0 ? activeJobsCount : undefined },
    { id: "earnings", label: "Earnings (GH₵)" },
    { id: "history", label: "Job History" },
    { id: "verification", label: "Verification Status" },
  ];

  const getAdminNav = (): NavItem[] => [
    { id: "overview", label: "Overview" },
    { id: "verifications", label: "Verification Queue" },
    { id: "collections", label: "Collection Requests" },
    { id: "collectors", label: "Tricycle Operators" },
    { id: "households", label: "Households" },
    { id: "payments", label: "Payments & MoMo" },
    { id: "disputes", label: "Disputes" },
    { id: "analytics", label: "Reports & Logs" },
  ];

  const navItems =
    currentRole === "household"
      ? getHouseholdNav()
      : currentRole === "collector"
      ? getCollectorNav()
      : getAdminNav();

  return (
    <header className="bg-white border-b border-[#E5EAE4] sticky top-[37px] z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Slogan */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onTabChange(currentRole === "admin" ? "overview" : "dashboard")}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#14532D] flex items-center justify-center text-white shadow-sm group-hover:bg-[#16A34A] transition-colors">
                <Recycle className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-[#17231B] block leading-none">
                  WasteLink<span className="text-[#16A34A]"> Ghana</span>
                </span>
                <span className="text-[10px] text-gray-500 hidden sm:block mt-0.5 tracking-tight">
                  Independent Tricycle Waste Platform
                </span>
              </div>
            </button>

            {/* Role indicator pill */}
            <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 ml-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              {currentRole === "household" ? "Household Portal" : currentRole === "collector" ? "Collector Hub" : "Admin Console"}
            </span>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all relative ${
                  currentTab === item.id
                    ? "bg-[#14532D] text-white shadow-xs font-semibold"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/70"
                }`}
              >
                {item.label}
                {item.badge && (
                  <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    currentTab === item.id ? "bg-emerald-400 text-black" : "bg-emerald-600 text-white"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Right Action Icons: Notifications & User Avatar */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Notifications Menu */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 relative focus:outline-hidden"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div 
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 py-3 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setShowNotifications(false)}
                >
                  <div className="px-4 pb-2 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Notifications</h4>
                      <p className="text-[11px] text-gray-500">{unreadCount} unread alert(s)</p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                    {userNotifications.length === 0 ? (
                      <div className="p-6 text-center text-gray-400 text-xs">
                        No notifications yet.
                      </div>
                    ) : (
                      userNotifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationRead(notif.id);
                            if (notif.link) {
                              if (notif.link.includes("negotiation") || notif.link.includes("tracking")) {
                                onTabChange("tracking");
                              } else if (notif.link.includes("requests")) {
                                onTabChange("requests");
                              } else if (notif.link.includes("verifications")) {
                                onTabChange("verifications");
                              } else if (notif.link.includes("complaints")) {
                                onTabChange("disputes");
                              }
                              setShowNotifications(false);
                            }
                          }}
                          className={`p-3 text-xs hover:bg-gray-50 cursor-pointer transition-colors flex items-start gap-2.5 ${
                            !notif.read ? "bg-emerald-50/50" : ""
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                            !notif.read ? "bg-emerald-600" : "bg-gray-300"
                          }`} />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{notif.title}</p>
                            <p className="text-gray-600 text-[11px] mt-0.5">{notif.message}</p>
                            <span className="text-[10px] text-gray-400 mt-1 block">
                              {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-emerald-100 border border-emerald-300 flex-shrink-0">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-xs text-emerald-800">
                    {currentUser.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-bold text-gray-800 block leading-tight truncate max-w-[120px]">
                  {currentUser.name.split(" ")[0]}
                </span>
                <span className="text-[10px] text-gray-500 block leading-tight truncate max-w-[120px]">
                  {currentUser.location}
                </span>
              </div>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-1 shadow-lg">
          <div className="px-2 py-1.5 mb-2 bg-emerald-50 rounded-lg text-xs font-semibold text-emerald-800 flex items-center justify-between">
            <span>{currentUser.name} ({currentRole.toUpperCase()})</span>
            <span className="text-[10px] text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
              {currentUser.location}
            </span>
          </div>

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
                currentTab === item.id
                  ? "bg-[#14532D] text-white font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span>{item.label}</span>
              {item.badge && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-white">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
