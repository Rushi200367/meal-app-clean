"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Camera, Utensils, Sparkles, ChevronRight, Menu, X, Bookmark, Clock, CalendarDays, Settings, LogOut, User } from "lucide-react";
import AuthModal from "@/components/AuthModal";

export default function PremiumHomeScreen() {
  const router = useRouter();
  const [mounted, setMounted]     = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authOpen, setAuthOpen]   = useState(false);
  const [authTrigger, setAuthTrigger] = useState<"save" | "cart" | "history" | "profile">("profile");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const handleProtectedAction = (trigger: "save" | "cart" | "history" | "profile", action: () => void) => {
    if (isLoggedIn) {
     action: () => handleProtectedAction("save", () => {
  setDrawerOpen(false);
  router.push("/saved");
})
      setAuthTrigger(trigger);
      setAuthOpen(true);
    }
  };

  if (!mounted) return null;

  return (
    <div className="h-screen overflow-hidden bg-neutral-200 flex items-center justify-center p-0 md:p-6 antialiased font-sans select-none">
      <div className="w-[393px] h-[852px] md:rounded-[48px] shadow-[0_32px_64px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col relative">

        {/* Full screen background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=450&h=852&q=90"
            alt="groceries"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />
        </div>

        {/* Overlay for drawer */}
        {drawerOpen && (
          <div
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-black/50 z-40 md:rounded-[48px]"
          />
        )}

        {/* Sidebar Drawer */}
        <div
          ref={drawerRef}
          className="absolute top-0 left-0 h-full w-[280px] bg-[#FDFBF7] z-50 flex flex-col transition-transform duration-300 ease-in-out"
          style={{ transform: drawerOpen ? "translateX(0)" : "translateX(-100%)" }}
        >
          {/* Drawer header */}
          <div className="bg-[#3B6E38] px-6 pt-14 pb-6 relative overflow-hidden shrink-0">
            <div className="absolute right-0 top-0 w-32 h-32 opacity-10">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path d="M10 80 Q40 50 80 20 M40 50 Q20 30 15 10 M40 50 Q60 40 70 60 M60 35 Q80 50 90 40" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              className="absolute top-12 right-4 w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center active:scale-90 transition-transform"
            >
              <X className="w-4 h-4 text-white stroke-[2.2]" />
            </button>

            {isLoggedIn ? (
              <>
                <div className="w-14 h-14 bg-[#EAF2E8] rounded-2xl flex items-center justify-center mb-3">
                  <span className="text-3xl">👨‍🍳</span>
                </div>
                <p className="text-white font-bold text-[18px]">Rushi Shah</p>
                <p className="text-[#E2ECD2] text-[13px] mt-0.5">rushi@email.com</p>
                <span className="inline-block mt-2 bg-white/20 text-white text-[11px] font-bold px-3 py-1 rounded-full">
                  Free Plan
                </span>
              </>
            ) : (
              <>
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-3">
                  <User className="w-7 h-7 text-white stroke-[1.8]" />
                </div>
                <p className="text-white font-bold text-[18px]">Welcome!</p>
                <p className="text-[#E2ECD2] text-[13px] mt-0.5">Sign in to unlock all features</p>
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    setAuthTrigger("profile");
                    setAuthOpen(true);
                  }}
                  className="inline-block mt-2 bg-white text-[#3B6E38] text-[11px] font-bold px-3 py-1 rounded-full active:scale-95 transition-transform"
                >
                  Sign In →
                </button>
              </>
            )}
          </div>

          {/* Stats row — only show if logged in */}
          {isLoggedIn && (
            <div className="flex gap-2 px-4 py-4 shrink-0">
              {[
                { label: "Saved",  value: 0,  color: "#3B6E38" },
                { label: "Cooked", value: 0,  color: "#F1A23A" },
                { label: "Liked",  value: 0,  color: "#FF6B6B" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex-1 bg-white rounded-2xl py-3 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                  <p className="font-bold text-[18px]" style={{ color }}>{value}</p>
                  <p className="text-[#8E8E93] text-[11px] font-medium mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Nav items */}
          <div className="flex-1 overflow-y-auto px-3 pb-4 pt-3" style={{ scrollbarWidth: "none" }}>
            {[
              {
                icon: User,
                label: "Profile",
                sub: "View your account",
                color: "#3B6E38",
                bg: "#EAF2E8",
                action: () => handleProtectedAction("profile", () => {
                  setDrawerOpen(false);
                  router.push("/profile");
                })
              },
              {
                icon: Bookmark,
                label: "Saved Recipes",
                sub: isLoggedIn ? "0 recipes saved" : "Sign in to save",
                color: "#3B6E38",
                bg: "#EAF2E8",
                action: () => handleProtectedAction("save", () => {
                  setDrawerOpen(false);
                })
              },
              {
                icon: Clock,
                label: "Recently Generated",
                sub: isLoggedIn ? "Your last recipes" : "Sign in to view",
                color: "#3B6E38",
                bg: "#EAF2E8",
                action: () => handleProtectedAction("history", () => {
                  setDrawerOpen(false);
                 router.push("/history");
                })
              },
              {
                icon: CalendarDays,
                label: "Weekly Plan",
                sub: "Plan your meals",
                color: "#F1A23A",
                bg: "#FFF6E9",
                action: () => {
                  setDrawerOpen(false);
                  router.push("/weekly");
                }
              },
              {
                icon: Settings,
                label: "Settings",
                sub: "App preferences",
                color: "#8E8E93",
                bg: "#F2F2F7",
                action: () => setDrawerOpen(false)
              },
            ].map(({ icon: Icon, label, sub, color, bg, action }) => (
              <button
                key={label}
                onClick={action}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl active:bg-[#F2F2F7] transition-colors mb-1"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: bg }}>
                  <Icon className="w-4 h-4 stroke-[2.2]" style={{ color }} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[#1C1C1E] font-semibold text-[14px]">{label}</p>
                  <p className="text-[#8E8E93] text-[12px] mt-0.5">{sub}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#C7C7CC] stroke-[2.5] shrink-0" />
              </button>
            ))}

            <div className="h-px bg-[#F2F2F7] mx-3 my-2" />

            {isLoggedIn ? (
              <button
                onClick={() => {
                  setIsLoggedIn(false);
                  setDrawerOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl active:bg-[#FFF0F0] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FFF0F0] flex items-center justify-center shrink-0">
                  <LogOut className="w-4 h-4 text-[#FF6B6B] stroke-[2.2]" />
                </div>
                <p className="text-[#FF6B6B] font-semibold text-[14px]">Log Out</p>
              </button>
            ) : (
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  setAuthTrigger("profile");
                  setAuthOpen(true);
                }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl active:bg-[#EAF2E8] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#EAF2E8] flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-[#3B6E38] stroke-[2.2]" />
                </div>
                <p className="text-[#3B6E38] font-semibold text-[14px]">Sign In</p>
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col h-full">

          {/* Hamburger */}
          <div className="px-5 pt-12 shrink-0">
            <button
              onClick={() => setDrawerOpen(true)}
              className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center active:scale-95 transition-transform"
            >
              <Menu className="w-5 h-5 text-white stroke-[2.2]" />
            </button>
          </div>

          {/* Greeting */}
          <div className="px-6 pt-4 shrink-0">
            <div className="flex items-center gap-1.5 text-white/80 font-medium text-[15px]">
              <span>{greeting()}</span>
              <span>👋</span>
            </div>
            <h1 className="text-white font-bold tracking-tight text-[32px] leading-[38px] mt-1">
              What will you<br />cook today?
            </h1>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Cards */}
          <div className="px-5 pb-8 space-y-3">

            <div
              onClick={() => router.push("/scanner")}
              className="w-full relative bg-[#3B6E38]/90 backdrop-blur-sm shadow-[0_10px_24px_rgba(0,0,0,0.3)] cursor-pointer transition-all active:scale-[0.99] overflow-hidden flex items-center justify-between px-6"
              style={{ height: "116px", borderRadius: "28px" }}
            >
              <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-10 pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-full h-full translate-x-6 translate-y-4 scale-125">
                  <path d="M10 80 Q40 50 80 20 M40 50 Q20 30 15 10 M40 50 Q60 40 70 60 M60 35 Q80 50 90 40" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
              </div>
              <div className="space-y-1 text-left max-w-[200px] z-10">
                <h2 className="text-white font-bold tracking-tight text-[20px]">Scan Groceries</h2>
                <p className="text-[#E2ECD2] leading-snug font-normal text-[13px]">
                  Photo your fridge, get a recipe instantly
                </p>
              </div>
              <div className="w-[52px] h-[52px] rounded-full bg-white flex items-center justify-center shadow-md z-10 shrink-0">
                <Camera className="w-[20px] h-[20px] stroke-[2.2] text-[#3B6E38]" />
              </div>
            </div>

            <div
              onClick={() => router.push("/preferences")}
              className="w-full bg-white/90 backdrop-blur-sm flex items-center justify-between px-5 shadow-[0_4px_20px_rgba(0,0,0,0.15)] cursor-pointer transition-all active:scale-[0.99]"
              style={{ height: "68px", borderRadius: "22px" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#EAF2E8] flex items-center justify-center shrink-0">
                  <Utensils className="w-4 h-4 stroke-[2.2] text-[#3B6E38]" />
                </div>
                <div className="text-left">
                  <h3 className="text-[#1C1C1E] font-bold text-[15px] tracking-tight">Generate with Ingredients</h3>
                  <p className="text-[#8E8E93] font-normal text-[12px] mt-0.5">Type ingredients manually</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#C7C7CC] stroke-[2.5] shrink-0" />
            </div>

            <div
              onClick={() => router.push("/surprise")}
              className="w-full bg-white/90 backdrop-blur-sm flex items-center justify-between px-5 shadow-[0_4px_20px_rgba(0,0,0,0.15)] cursor-pointer transition-all active:scale-[0.99]"
              style={{ height: "68px", borderRadius: "22px" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF6E9] flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 stroke-[2.2] text-[#F1A23A] fill-[#F1A23A]" />
                </div>
                <div className="text-left">
                  <h3 className="text-[#1C1C1E] font-bold text-[15px] tracking-tight">Surprise Me</h3>
                  <p className="text-[#8E8E93] font-normal text-[12px] mt-0.5">Discover a random recipe</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#C7C7CC] stroke-[2.5] shrink-0" />
            </div>

          </div>
        </div>

        {/* Auth Modal */}
        <AuthModal
          isOpen={authOpen}
          onClose={() => {
            setAuthOpen(false);
            setIsLoggedIn(true);
          }}
          trigger={authTrigger}
        />

      </div>
    </div>
  );
}