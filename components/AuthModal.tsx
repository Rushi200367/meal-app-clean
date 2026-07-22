"use client";
import React, { useState } from "react";
import { X, Mail, Lock, User, Eye, EyeOff } from "lucide-react";

type ModalStep = "prompt" | "login" | "signup" | "success";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: "save" | "cart" | "history" | "profile";
}

const TRIGGER_MESSAGES = {
  save:    { icon: "🔖", text: "Save recipes and access them anytime" },
  cart:    { icon: "🛒", text: "Save your cart and order later" },
  history: { icon: "📜", text: "View your recipe history" },
  profile: { icon: "👤", text: "Sync your data across devices" },
};

export default function AuthModal({ isOpen, onClose, trigger = "save" }: AuthModalProps) {
  const [step, setStep]               = useState<ModalStep>("prompt");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [form, setForm]               = useState({ name: "", email: "", password: "" });

  const handleAuth = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("success");
    }, 1500);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep("prompt");
      setForm({ name: "", email: "", password: "" });
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center"
        style={{ borderRadius: "inherit" }}
      >
        {/* Modal — stop propagation so clicking inside doesn't close */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-[320px] bg-white rounded-[28px] shadow-[0_24px_64px_rgba(0,0,0,0.2)] overflow-hidden mx-4"
          style={{ animation: "modalIn 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}
        >
          <style>{`
            @keyframes modalIn {
              from { opacity: 0; transform: scale(0.85); }
              to { opacity: 1; transform: scale(1); }
            }
          `}</style>

          {/* ── STEP 1: Prompt ── */}
          {step === "prompt" && (
            <div className="p-6 text-center">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F2F2F7] flex items-center justify-center active:scale-90 transition-transform"
              >
                <X className="w-4 h-4 text-[#8E8E93] stroke-[2.2]" />
              </button>

              <div className="w-16 h-16 bg-[#EAF2E8] rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-7 h-7 text-[#3B6E38] stroke-[1.8]" />
              </div>

              <h2 className="text-[#1C1C1E] font-bold text-[20px] mb-2">
                Login to continue
              </h2>
              <p className="text-[#8E8E93] text-[13px] leading-relaxed mb-6">
                {TRIGGER_MESSAGES[trigger].icon} {TRIGGER_MESSAGES[trigger].text}, add to cart and unlock all features.
              </p>

              <button
                onClick={() => setStep("login")}
                className="w-full h-[50px] rounded-2xl bg-[#3B6E38] text-white font-bold text-[15px] mb-3 active:scale-[0.98] transition-all shadow-[0_8px_20px_rgba(59,110,56,0.25)]"
              >
                Log In
              </button>

              {/* Google */}
              <button
                onClick={handleAuth}
                className="w-full h-[50px] rounded-2xl bg-white border border-[#E8E4DC] flex items-center justify-center gap-3 font-semibold text-[14px] text-[#1C1C1E] active:scale-[0.98] transition-all mb-4"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <p className="text-[#8E8E93] text-[13px]">
                Don't have an account?{" "}
                <button
                  onClick={() => setStep("signup")}
                  className="text-[#3B6E38] font-bold active:opacity-70"
                >
                  Sign up
                </button>
              </p>
            </div>
          )}

          {/* ── STEP 2: Login ── */}
          {step === "login" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-[#1C1C1E] font-bold text-[20px]">Welcome back!</h2>
                  <p className="text-[#8E8E93] text-[13px] mt-0.5">Log in to your account</p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full bg-[#F2F2F7] flex items-center justify-center active:scale-90 transition-transform"
                >
                  <X className="w-4 h-4 text-[#8E8E93] stroke-[2.2]" />
                </button>
              </div>

              {/* Email */}
              <div className="relative mb-3">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C7C7CC] stroke-[1.8]" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full h-[48px] rounded-2xl border border-[#E8E4DC] pl-10 pr-4 text-[14px] text-[#1C1C1E] placeholder:text-[#C7C7CC] outline-none focus:border-[#3B6E38] transition-colors"
                />
              </div>

              {/* Password */}
              <div className="relative mb-2">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C7C7CC] stroke-[1.8]" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full h-[48px] rounded-2xl border border-[#E8E4DC] pl-10 pr-10 text-[14px] text-[#1C1C1E] placeholder:text-[#C7C7CC] outline-none focus:border-[#3B6E38] transition-colors"
                />
                <button
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2"
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4 text-[#C7C7CC] stroke-[1.8]" />
                    : <Eye    className="w-4 h-4 text-[#C7C7CC] stroke-[1.8]" />
                  }
                </button>
              </div>

              <div className="flex justify-end mb-4">
                <button className="text-[#3B6E38] text-[13px] font-semibold">
                  Forgot password?
                </button>
              </div>

              <button
                onClick={handleAuth}
                disabled={loading}
                className="w-full h-[50px] rounded-2xl bg-[#3B6E38] text-white font-bold text-[15px] flex items-center justify-center mb-3 active:scale-[0.98] transition-all shadow-[0_8px_20px_rgba(59,110,56,0.25)] disabled:opacity-75"
              >
                {loading
                  ? <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  : "Log In"
                }
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-px bg-[#E8E4DC]" />
                <span className="text-[#8E8E93] text-[12px]">or continue with</span>
                <div className="flex-1 h-px bg-[#E8E4DC]" />
              </div>

              {/* Google */}
              <button
                onClick={handleAuth}
                className="w-full h-[48px] rounded-2xl border border-[#E8E4DC] flex items-center justify-center gap-3 font-semibold text-[14px] text-[#1C1C1E] active:scale-[0.98] transition-all mb-4"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <p className="text-center text-[#8E8E93] text-[13px]">
                Don't have an account?{" "}
                <button
                  onClick={() => setStep("signup")}
                  className="text-[#3B6E38] font-bold"
                >
                  Sign up
                </button>
              </p>
            </div>
          )}

          {/* ── STEP 3: Signup ── */}
          {step === "signup" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-[#1C1C1E] font-bold text-[20px]">Create account</h2>
                  <p className="text-[#8E8E93] text-[13px] mt-0.5">Join SmartRecipe today</p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full bg-[#F2F2F7] flex items-center justify-center active:scale-90 transition-transform"
                >
                  <X className="w-4 h-4 text-[#8E8E93] stroke-[2.2]" />
                </button>
              </div>

              {/* Full name */}
              <div className="relative mb-3">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C7C7CC] stroke-[1.8]" />
                <input
                  type="text"
                  placeholder="Full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full h-[48px] rounded-2xl border border-[#E8E4DC] pl-10 pr-4 text-[14px] text-[#1C1C1E] placeholder:text-[#C7C7CC] outline-none focus:border-[#3B6E38] transition-colors"
                />
              </div>

              {/* Email */}
              <div className="relative mb-3">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C7C7CC] stroke-[1.8]" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full h-[48px] rounded-2xl border border-[#E8E4DC] pl-10 pr-4 text-[14px] text-[#1C1C1E] placeholder:text-[#C7C7CC] outline-none focus:border-[#3B6E38] transition-colors"
                />
              </div>

              {/* Password */}
              <div className="relative mb-4">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C7C7CC] stroke-[1.8]" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full h-[48px] rounded-2xl border border-[#E8E4DC] pl-10 pr-10 text-[14px] text-[#1C1C1E] placeholder:text-[#C7C7CC] outline-none focus:border-[#3B6E38] transition-colors"
                />
                <button
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2"
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4 text-[#C7C7CC] stroke-[1.8]" />
                    : <Eye    className="w-4 h-4 text-[#C7C7CC] stroke-[1.8]" />
                  }
                </button>
              </div>

              <button
                onClick={handleAuth}
                disabled={loading}
                className="w-full h-[50px] rounded-2xl bg-[#3B6E38] text-white font-bold text-[15px] flex items-center justify-center mb-3 active:scale-[0.98] transition-all shadow-[0_8px_20px_rgba(59,110,56,0.25)] disabled:opacity-75"
              >
                {loading
                  ? <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  : "Sign Up"
                }
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-px bg-[#E8E4DC]" />
                <span className="text-[#8E8E93] text-[12px]">or continue with</span>
                <div className="flex-1 h-px bg-[#E8E4DC]" />
              </div>

              {/* Google */}
              <button
                onClick={handleAuth}
                className="w-full h-[48px] rounded-2xl border border-[#E8E4DC] flex items-center justify-center gap-3 font-semibold text-[14px] text-[#1C1C1E] active:scale-[0.98] transition-all mb-4"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <p className="text-center text-[#8E8E93] text-[13px]">
                Already have an account?{" "}
                <button
                  onClick={() => setStep("login")}
                  className="text-[#3B6E38] font-bold"
                >
                  Log in
                </button>
              </p>
            </div>
          )}

          {/* ── STEP 4: Success ── */}
          {step === "success" && (
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-[#EAF2E8] rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-10 h-10 bg-[#3B6E38] rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>

              <h2 className="text-[#1C1C1E] font-bold text-[20px] mb-1">Welcome back!</h2>
              <p className="text-[#8E8E93] text-[13px] mb-6">You have successfully logged in.</p>

              <button
                onClick={handleClose}
                className="w-full h-[50px] rounded-2xl bg-[#3B6E38] text-white font-bold text-[15px] mb-4 active:scale-[0.98] transition-all shadow-[0_8px_20px_rgba(59,110,56,0.25)]"
              >
                Explore Recipes
              </button>

              <div className="space-y-2 text-left">
                {[
                  "🔖 Save your favourite recipes",
                  "🛒 Add items to your cart",
                  "📜 View your cooking history",
                ].map((item) => (
                  <p key={item} className="text-[#8E8E93] text-[13px]">{item}</p>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}