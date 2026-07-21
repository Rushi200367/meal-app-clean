"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/home");
    }, 1500);
  };

  return (
    <div className="h-screen overflow-hidden bg-neutral-200 flex items-center justify-center p-0 md:p-6 antialiased font-sans select-none">
      <div className="w-[393px] h-[852px] md:rounded-[48px] shadow-[0_32px_64px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col relative">

        {/* ── Full screen food background ── */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=450&h=852&q=90"
            alt="food background"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay — heavier at bottom for card readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/75" />
        </div>

        {/* ── Content on top ── */}
        <div className="relative z-10 flex flex-col h-full">

          {/* App branding — top */}
          <div className="px-7 pt-16 flex-1">
            <div className="w-14 h-14 bg-white rounded-[18px] shadow-[0_8px_24px_rgba(0,0,0,0.2)] flex items-center justify-center mb-4">
              <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
                <ellipse cx="24" cy="32" rx="16" ry="8" fill="#3B6E38" opacity="0.15"/>
                <path d="M10 28 Q12 18 24 16 Q36 18 38 28 Q30 34 24 34 Q18 34 10 28Z" fill="#3B6E38"/>
                <path d="M24 16 Q20 8 14 6" stroke="#3B6E38" strokeWidth="2" strokeLinecap="round" fill="none"/>
                <path d="M24 16 Q26 7 32 5" stroke="#4C8A3E" strokeWidth="2" strokeLinecap="round" fill="none"/>
                <ellipse cx="24" cy="29" rx="10" ry="4" fill="white" opacity="0.15"/>
              </svg>
            </div>
            <h1 className="text-white font-bold text-[36px] tracking-tight leading-tight">
              Smart<span className="text-[#7DC97A]">Recipe</span>
            </h1>
            <p className="text-white/70 text-[14px] font-normal mt-2 leading-relaxed">
              Cook it. Love it. Share it. 🍃
            </p>
            <p className="text-white/50 text-[13px] font-normal mt-3 leading-relaxed max-w-[220px]">
              AI-powered recipes made just for you. From simple ingredients to amazing meals.
            </p>
          </div>

          {/* ── Floating bottom card ── */}
          <div className="bg-white rounded-t-[36px] px-6 pt-6 pb-8 shadow-[0_-8px_32px_rgba(0,0,0,0.15)]">

            <p className="text-[#1C1C1E] font-bold text-[18px] mb-5">Log in to continue</p>

            {/* Google button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full h-[50px] rounded-2xl bg-white border border-[#E8E4DC] shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center gap-3 px-5 mb-3 active:scale-[0.98] transition-all disabled:opacity-70"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-[#1C1C1E] font-semibold text-[14px]">Continue with Google</span>
            </button>

            {/* Apple button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full h-[50px] rounded-2xl bg-white border border-[#E8E4DC] shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center gap-3 px-5 mb-4 active:scale-[0.98] transition-all disabled:opacity-70"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="#1C1C1E">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.32 2.99-2.54 4zm-3.01-17.3c.06 2.29-1.66 4.2-3.86 4.04-.29-2.14 1.75-4.2 3.86-4.04z"/>
              </svg>
              <span className="text-[#1C1C1E] font-semibold text-[14px]">Continue with Apple</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-[#E0DBD0]" />
              <span className="text-[#8E8E93] text-[12px]">or</span>
              <div className="flex-1 h-px bg-[#E0DBD0]" />
            </div>

            {/* Email */}
            <div className="mb-1">
              <p className="text-[#1C1C1E] font-semibold text-[13px] mb-2">Email</p>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C7C7CC] stroke-[1.8]" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[48px] rounded-2xl bg-white border border-[#E8E4DC] pl-10 pr-4 text-[14px] text-[#1C1C1E] placeholder:text-[#C7C7CC] outline-none focus:border-[#3B6E38] transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-2">
              <p className="text-[#1C1C1E] font-semibold text-[13px] mb-2">Password</p>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C7C7CC] stroke-[1.8]" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[48px] rounded-2xl bg-white border border-[#E8E4DC] pl-10 pr-11 text-[14px] text-[#1C1C1E] placeholder:text-[#C7C7CC] outline-none focus:border-[#3B6E38] transition-colors"
                />
                <button
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 active:scale-90 transition-transform"
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4 text-[#C7C7CC] stroke-[1.8]" />
                    : <Eye    className="w-4 h-4 text-[#C7C7CC] stroke-[1.8]" />
                  }
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end mb-4">
              <button className="text-[#F1A23A] text-[13px] font-semibold active:opacity-70">
                Forgot password?
              </button>
            </div>

            {/* Log In button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full h-[52px] rounded-2xl bg-[#3B6E38] text-white font-bold text-[15px] flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(59,110,56,0.25)] active:scale-[0.98] transition-all disabled:opacity-75 mb-4"
            >
              {loading
                ? <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                : "Log In"
              }
            </button>

            {/* Sign up link */}
            <p className="text-center text-[#8E8E93] text-[13px]">
              Don't have an account?{" "}
              <button
                onClick={() => router.push("/signup")}
                className="text-[#3B6E38] font-bold active:opacity-70"
              >
                Sign up
              </button>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}