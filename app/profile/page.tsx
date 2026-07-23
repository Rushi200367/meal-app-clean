"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, Bookmark, Clock, Heart, Bell, Shield, HelpCircle, LogOut, Pencil } from "lucide-react";

const SETTINGS = [
  {
    group: "Preferences",
    items: [
      { icon: Heart,       label: "Dietary Preferences", sub: "Vegetarian, Low-Carb" },
      { icon: Clock,       label: "Default Cook Time",   sub: "30 minutes" },
      { icon: Bell,        label: "Notifications",       sub: "Recipe reminders on" },
    ],
  },
  {
    group: "Account",
    items: [
      { icon: Shield,      label: "Privacy & Security",  sub: "Manage your data" },
      { icon: HelpCircle,  label: "Help & Support",      sub: "FAQs and contact" },
    ],
  },
];

export default function ProfilePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-neutral-200 flex items-center justify-center p-0 md:p-6 antialiased font-sans select-none">
      <div className="w-[393px] h-[852px] bg-[#FDFBF7] md:rounded-[48px] shadow-[0_32px_64px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col relative">

        {/* Green hero header */}
        <div className="w-full h-[200px] bg-[#3B6E38] relative overflow-hidden shrink-0 flex flex-col justify-end px-7 pb-6">
          <div className="absolute right-0 top-0 w-48 h-48 opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path d="M10 80 Q40 50 80 20 M40 50 Q20 30 15 10 M40 50 Q60 40 70 60 M60 35 Q80 50 90 40" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
          <button
            onClick={() => router.push("/")}
            className="absolute top-12 left-6 w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-white stroke-[2.2]" />
          </button>
          <p className="text-[#E2ECD2] text-[13px] font-medium z-10">My Profile</p>
          <h1 className="text-white font-bold text-[24px] tracking-tight z-10">Account</h1>
          <div
            className="absolute bottom-0 left-0 right-0 h-8 bg-[#FDFBF7]"
            style={{ borderRadius: "100% 100% 0 0 / 32px 32px 0 0", transform: "scaleX(1.1) translateY(4px)" }}
          />
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 pb-8 space-y-5" style={{ scrollbarWidth: "none" }}>

          {/* Avatar card */}
          <div className="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#EAF2E8] flex items-center justify-center shrink-0">
              <span className="text-3xl">👨‍🍳</span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[#1C1C1E] font-bold text-[18px] tracking-tight truncate">Rushi Shah</h2>
              <p className="text-[#8E8E93] text-[13px] font-normal mt-0.5 truncate">rushi@email.com</p>
              <span className="inline-block mt-1.5 bg-[#EAF2E8] text-[#3B6E38] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                Free Plan
              </span>
            </div>
            <button className="w-9 h-9 rounded-xl bg-[#F2F2F7] flex items-center justify-center shrink-0 active:scale-95 transition-transform">
              <Pencil className="w-4 h-4 text-[#8E8E93] stroke-[2.2]" />
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Bookmark, label: "Saved",     value: 12, color: "#3B6E38", bg: "#EAF2E8" },
              { icon: Clock,    label: "Cooked",    value: 8,  color: "#F1A23A", bg: "#FFF6E9" },
              { icon: Heart,    label: "Favourite", value: 5,  color: "#FF6B6B", bg: "#FFF0F0" },
            ].map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className="bg-white rounded-[20px] p-4 text-center shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: bg }}>
                  <Icon className="w-4 h-4 stroke-[2.2]" style={{ color }} />
                </div>
                <p className="text-[#1C1C1E] font-bold text-[20px]">{value}</p>
                <p className="text-[#8E8E93] text-[11px] font-medium mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Settings groups */}
          {SETTINGS.map(({ group, items }) => (
            <div key={group}>
              <p className="text-[#8E8E93] text-[12px] font-semibold uppercase tracking-widest mb-2 px-1">
                {group}
              </p>
              <div className="bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
                {items.map(({ icon: Icon, label, sub }, i) => (
                  <button
                    key={label}
                    className={`w-full flex items-center gap-4 px-5 py-4 active:bg-[#F9F9F9] transition-colors ${
                      i < items.length - 1 ? "border-b border-[#F2F2F7]" : ""
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#EAF2E8] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-[#3B6E38] stroke-[2.2]" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-[#1C1C1E] font-semibold text-[14px]">{label}</p>
                      <p className="text-[#8E8E93] text-[12px] font-normal mt-0.5">{sub}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#C7C7CC] stroke-[2.5] shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Log out */}
          <button
            onClick={() => router.push("/home")}
            className="w-full h-[58px] rounded-[20px] bg-[#FFF0F0] text-[#FF6B6B] font-bold text-[15px] flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            <LogOut className="w-5 h-5 stroke-[2.2]" />
            Log Out
          </button>

        </div>
      </div>
    </div>
  );
}