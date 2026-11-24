"use client";

import React, { useState } from "react";
import { useWasteApp } from "@/context/WasteAppContext";
import {
  Bell,
  Menu,
  X,
  ChevronDown,
  UserPlus,
  Globe,
  LogOut,
  ShieldCheck,
  Truck,
  Users,
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
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userNotifications = notifications.filter(
    (n) => n.userId === currentUser.id || n.role === currentRole || n.role === "all"
  );
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const activeJobsCount = requests.filter(
    (r) =>
      r.status !== "paid" &&
      r.status !== "cancelled" &&
      (currentRole === "household" ? r.householdId === currentUser.id : r.collectorId === currentUser.id)
  ).length;

  const getHouseholdNav = (): NavItem[] => [
    { id: "dashboard", label: "Dashboard" },
    { id: "request", label: "Request Pickup" },
    { id: "nearby", label: "Nearby Collectors" },
    { id: "tracking", label: "Tracking & Offers", badge: activeJobsCount > 0 ? activeJobsCount : undefined },
    { id: "history", label: "History" },
    { id: "complaints", label: "Support" },
  ];

  const getCollectorNav = (): NavItem[] => [
    { id: "dashboard", label: "Collector Hub" },
    { id: "requests", label: "Incoming Requests" },
    { id: "jobs", label: "Active Job", badge: activeJobsCount > 0 ? activeJobsCount : undefined },
    { id: "earnings", label: "Earnings (GH₵)" },
    { id: "verification", label: "Verification" },
  ];

  const getAdminNav = (): NavItem[] => [
    { id: "overview", label: "Overview" },
    { id: "verifications", label: "Verification Queue" },
    { id: "collections", label: "Collections" },
    { id: "collectors", label: "Operators" },
    { id: "households", label: "Households" },
    { id: "payments", label: "Payments" },
    { id: "disputes", label: "Disputes" },
    { id: "analytics", label: "Reports" },
  ];

  const navItems =
    currentRole === "household"
      ? getHouseholdNav()
      : currentRole === "collector"
      ? getCollectorNav()
      : getAdminNav();

  const roleBadgeLabel =
    currentRole === "household"
      ? "Household"
      : currentRole === "collector"
      ? "Collector"
      : "Admin";

  const RoleIcon =
    currentRole === "household" ? Users : currentRole === "collector" ? Truck : ShieldCheck;

  return (
    <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-40 shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo: compact symbol on mobile, full logo on desktop */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => onTabChange(currentRole === "admin" ? "overview" : "dashboard")}
              className="flex items-center gap-2 text-left focus:outline-hidden"
              aria-label="WasteLink Ghana Home"
            >
              <div className="flex items-center gap-2 sm:hidden">
                <img
                  src="/logo-symbol.png"
                  alt="WasteLink Ghana"
                  className="h-9 w-auto object-contain shrink-0"
                />
                <div className="leading-none">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-black tracking-tight text-[#1D4ED8]">
                      WasteLink
                    </span>
                    <span className="text-sm font-black tracking-tight text-[#0284C7]">
                      Ghana
                    </span>
                  </div>
                  <div className="h-[1.5px] w-full bg-gradient-to-r from-[#2563EB] to-[#0EA5E9] rounded-full my-0.5" />
                  <p className="text-[8px] font-semibold italic text-[#123B66] tracking-tight leading-tight max-w-[155px] truncate">
                    Connecting Homes. Empowering Collectors. Cleaner Communities.
                  </p>
                </div>
              </div>
              <img
                src="/logo.png"
                alt="WasteLink Ghana"
                className="hidden sm:block h-10 w-auto object-contain"
              />
            </button>

            <span className="hidden min-[460px]:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#DBEAFE] text-[#123B66] border border-[#BFDBFE]">
              <RoleIcon className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>{roleBadgeLabel}</span>
            </span>
          </div>

          {/* Desktop Role-Specific Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Primary Navigation">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all relative whitespace-nowrap ${
                  currentTab === item.id
                    ? "bg-[#123B66] text-white shadow-xs"
                    : "text-[#64748B] hover:text-[#172B43] hover:bg-[#F5F8FC]"
                }`}
              >
                {item.label}
                {item.badge && (
                  <span
                    className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      currentTab === item.id
                        ? "bg-[#2563EB] text-white"
                        : "bg-[#DBEAFE] text-[#123B66]"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Right: Notification Centre + Profile Dropdown + Mobile Drawer */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Notification Centre */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="p-2 rounded-xl text-[#64748B] hover:text-[#123B66] hover:bg-[#F5F8FC] relative transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#2563EB] text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div
                  className="absolute right-0 mt-2 w-[min(22rem,calc(100vw-2rem))] sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] py-3 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setShowNotifications(false)}
                >
                  <div className="px-4 pb-2 border-b border-[#F1F5F9] flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-[#172B43] text-sm">Notifications</h4>
                      <p className="text-[11px] text-[#64748B]">{unreadCount} unread alert(s)</p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllNotificationsRead}
                        className="text-xs text-[#2563EB] hover:text-[#123B66] font-semibold"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-[#F1F5F9]">
                    {userNotifications.length === 0 ? (
                      <div className="p-6 text-center text-[#64748B] text-xs">
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
                          className={`p-3 text-xs hover:bg-[#F5F8FC] cursor-pointer transition-colors flex items-start gap-2.5 ${
                            !notif.read ? "bg-[#DBEAFE]/40" : ""
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                              !notif.read ? "bg-[#2563EB]" : "bg-[#CBD5E1]"
                            }`}
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-[#172B43]">{notif.title}</p>
                            <p className="text-[#64748B] text-[11px] mt-0.5">{notif.message}</p>
                            <span className="text-[10px] text-[#94A3B8] mt-1 block">
                              {new Date(notif.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl border border-[#E2E8F0] hover:border-[#2563EB]/50 hover:bg-[#F5F8FC] transition-colors"
                aria-expanded={showProfileMenu}
                aria-label="User Profile Menu"
              >
                <div className="w-7 h-7 rounded-full overflow-hidden bg-[#DBEAFE] border border-[#BFDBFE] flex-shrink-0">
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-xs text-[#123B66]">
                      {currentUser.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <span className="text-xs font-bold text-[#172B43] block leading-tight truncate max-w-[110px]">
                    {currentUser.name.split(" ")[0]}
                  </span>
                  <span className="text-[10px] text-[#64748B] block leading-tight truncate max-w-[110px]">
                    {currentUser.location}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#64748B] hidden sm:block" />
              </button>

              {showProfileMenu && (
                <div
                  className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setShowProfileMenu(false)}
                >
                  <div className="px-4 py-2 border-b border-[#F1F5F9]">
                    <p className="text-xs font-bold text-[#172B43] truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-[#64748B] truncate">{currentUser.phone}</p>
                  </div>

                  <div className="py-1 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        onTabChange("auth");
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-[#172B43] hover:bg-[#F5F8FC] flex items-center gap-2 font-medium"
                    >
                      <UserPlus className="w-4 h-4 text-[#2563EB]" />
                      <span>Sign Up / Switch Account</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onTabChange("landing");
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-[#172B43] hover:bg-[#F5F8FC] flex items-center gap-2 font-medium"
                    >
                      <Globe className="w-4 h-4 text-[#2563EB]" />
                      <span>Public Landing Page</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onTabChange("auth");
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium border-t border-[#F1F5F9] mt-1 pt-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#64748B] hover:bg-[#F5F8FC] lg:hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E2E8F0] bg-white px-4 pt-3 pb-6 space-y-1 shadow-lg">
          <div className="px-3 py-2 mb-2 bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#123B66] flex items-center justify-between">
            <span>
              {currentUser.name} ({roleBadgeLabel})
            </span>
            <span className="text-[10px] text-[#2563EB] bg-white px-2 py-0.5 rounded-full border border-[#DBEAFE]">
              {currentUser.location}
            </span>
          </div>

          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onTabChange(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between ${
                currentTab === item.id
                  ? "bg-[#123B66] text-white font-semibold"
                  : "text-[#172B43] hover:bg-[#F5F8FC]"
              }`}
            >
              <span>{item.label}</span>
              {item.badge && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#2563EB] text-white">
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          <div className="pt-2 mt-2 border-t border-[#E2E8F0] grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                onTabChange("auth");
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2.5 rounded-xl text-xs font-bold text-[#123B66] bg-[#DBEAFE] hover:bg-[#BFDBFE] text-center"
            >
              Sign Up / Login
            </button>
            <button
              type="button"
              onClick={() => {
                onTabChange("landing");
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2.5 rounded-xl text-xs font-bold text-[#172B43] bg-[#F5F8FC] border border-[#E2E8F0] text-center"
            >
              Landing Page
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
