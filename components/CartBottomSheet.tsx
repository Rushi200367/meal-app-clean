"use client";
import React, { useState, useEffect } from "react";
import { X, Plus, Minus, ShoppingCart, ChevronRight, Check } from "lucide-react";

const GROCERY_APPS: Record<string, { name: string; color: string; bg: string; url: string; emoji: string }[]> = {
  IN: [
    { name: "Blinkit",    color: "#F8C200", bg: "#FFFBEB", url: "https://blinkit.com/s?q=",                    emoji: "🟡" },
    { name: "Zepto",      color: "#8B2FC9", bg: "#F5F0FF", url: "https://www.zeptonow.com/search?query=",      emoji: "🟣" },
    { name: "Instamart",  color: "#FC8019", bg: "#FFF4EB", url: "https://www.swiggy.com/search?query=",        emoji: "🟠" },
    { name: "BigBasket",  color: "#84C225", bg: "#F0F9E8", url: "https://www.bigbasket.com/ps/?q=",            emoji: "🟢" },
  ],
  US: [
    { name: "Instacart",  color: "#43B02A", bg: "#F0F9EB", url: "https://www.instacart.com/store/search?q=",  emoji: "🟢" },
    { name: "Amazon Fresh",color: "#FF9900",bg: "#FFF8EB", url: "https://www.amazon.com/s?k=fresh+",          emoji: "🟠" },
    { name: "Walmart",    color: "#0071CE", bg: "#EBF4FF", url: "https://www.walmart.com/search?q=",          emoji: "🔵" },
    { name: "DoorDash",   color: "#FF3008", bg: "#FFF0EE", url: "https://www.doordash.com/grocery/search?q=", emoji: "🔴" },
  ],
  CA: [
    { name: "Instacart",  color: "#43B02A", bg: "#F0F9EB", url: "https://www.instacart.com/store/search?q=",  emoji: "🟢" },
    { name: "Walmart CA", color: "#0071CE", bg: "#EBF4FF", url: "https://www.walmart.ca/search?q=",           emoji: "🔵" },
    { name: "Loblaws",    color: "#FFD700", bg: "#FFFBEB", url: "https://www.loblaws.ca/search?q=",           emoji: "🟡" },
    { name: "Amazon CA",  color: "#FF9900", bg: "#FFF8EB", url: "https://www.amazon.ca/s?k=fresh+",           emoji: "🟠" },
  ],
  GB: [
    { name: "Tesco",      color: "#EE1C2E", bg: "#FFF0F0", url: "https://www.tesco.com/search?query=",        emoji: "🔴" },
    { name: "Ocado",      color: "#5C2D8F", bg: "#F5F0FF", url: "https://www.ocado.com/search?q=",            emoji: "🟣" },
    { name: "Sainsbury's",color: "#FF6600", bg: "#FFF4EB", url: "https://www.sainsburys.co.uk/gol-ui/SearchDisplayView?searchTerm=", emoji: "🟠" },
    { name: "Amazon UK",  color: "#FF9900", bg: "#FFF8EB", url: "https://www.amazon.co.uk/s?k=fresh+",        emoji: "🟠" },
  ],
  AU: [
    { name: "Woolworths", color: "#00A845", bg: "#F0FBF4", url: "https://www.woolworths.com.au/shop/search/products?searchTerm=", emoji: "🟢" },
    { name: "Coles",      color: "#E4002B", bg: "#FFF0F2", url: "https://www.coles.com.au/search?q=",         emoji: "🔴" },
    { name: "Amazon AU",  color: "#FF9900", bg: "#FFF8EB", url: "https://www.amazon.com.au/s?k=fresh+",       emoji: "🟠" },
  ],
};

interface Ingredient {
  name: string;
  quantity: number;
  checked: boolean;
}

interface CartBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  ingredients: string[];
  mode: "missing" | "all";
}

export default function CartBottomSheet({ isOpen, onClose, ingredients, mode }: CartBottomSheetProps) {
  const [items, setItems] = useState<Ingredient[]>([]);
  const [country, setCountry] = useState("IN");
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [ordered, setOrdered] = useState(false);

  useEffect(() => {
    // Detect country from browser
    try {
      const locale = Intl.DateTimeFormat().resolvedOptions().locale;
      const countryCode = locale.split("-")[1]?.toUpperCase() ?? "IN";
      const supported = Object.keys(GROCERY_APPS);
      setCountry(supported.includes(countryCode) ? countryCode : "IN");
    } catch {
      setCountry("IN");
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setItems(
        ingredients.map((name) => ({
          name: name.trim(),
          quantity: 1,
          checked: true,
        }))
      );
      setOrdered(false);
      setSelectedApp(null);
    }
  }, [isOpen, ingredients]);

  const toggleItem = (index: number) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const updateQuantity = (index: number, delta: number) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const selectedItems = items.filter((i) => i.checked);
  const groceryApps = GROCERY_APPS[country] || GROCERY_APPS["IN"];

  const handleOrder = (app: typeof groceryApps[0]) => {
    setSelectedApp(app.name);
    const query = selectedItems.map((i) => i.name).join(" ");
    window.open(app.url + encodeURIComponent(query), "_blank");
    setOrdered(true);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 z-50"
        style={{ borderRadius: "inherit" }}
      />

      {/* Bottom sheet */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-[#FDFBF7] z-50 flex flex-col"
        style={{
          borderRadius: "32px 32px 0 0",
          maxHeight: "85%",
          animation: "slideUp 0.3s ease-out",
        }}
      >
        <style>{`
          @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        `}</style>

        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-[#E0DBD0] rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 shrink-0">
          <div>
            <h2 className="text-[#1C1C1E] font-bold text-[18px]">
              {mode === "missing" ? "Add Missing Ingredients" : "Shop Ingredients"}
            </h2>
            <p className="text-[#8E8E93] text-[12px] mt-0.5">
              {selectedItems.length} of {items.length} selected
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F2F2F7] flex items-center justify-center active:scale-90 transition-transform"
          >
            <X className="w-4 h-4 text-[#8E8E93] stroke-[2.2]" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 pb-4" style={{ scrollbarWidth: "none" }}>

          {/* Ingredient list */}
          <div className="space-y-2 mb-5">
            {items.map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-opacity ${
                  !item.checked ? "opacity-50" : ""
                }`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleItem(i)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all active:scale-90 ${
                    item.checked
                      ? "bg-[#3B6E38] border-[#3B6E38]"
                      : "border-[#C7C7CC]"
                  }`}
                >
                  {item.checked && <Check className="w-3 h-3 text-white stroke-[3]" />}
                </button>

                {/* Name */}
                <p className="flex-1 text-[#1C1C1E] font-medium text-[14px] capitalize">
                  {item.name}
                </p>

                {/* Quantity controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(i, -1)}
                    className="w-7 h-7 rounded-full bg-[#F2F2F7] flex items-center justify-center active:scale-90 transition-transform"
                  >
                    <Minus className="w-3 h-3 text-[#8E8E93] stroke-[2.5]" />
                  </button>
                  <span className="text-[#1C1C1E] font-bold text-[14px] w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(i, 1)}
                    className="w-7 h-7 rounded-full bg-[#EAF2E8] flex items-center justify-center active:scale-90 transition-transform"
                  >
                    <Plus className="w-3 h-3 text-[#3B6E38] stroke-[2.5]" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Country detection badge */}
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-[#F2F2F7]" />
            <span className="text-[#8E8E93] text-[11px] font-semibold uppercase tracking-widest">
              Order via
            </span>
            <div className="h-px flex-1 bg-[#F2F2F7]" />
          </div>

          {/* Grocery apps */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {groceryApps.map((app) => (
              <button
                key={app.name}
                onClick={() => handleOrder(app)}
                disabled={selectedItems.length === 0}
                className="flex items-center gap-2 px-3 py-3 rounded-2xl border active:scale-95 transition-all disabled:opacity-40"
                style={{
                  backgroundColor: selectedApp === app.name ? app.bg : "white",
                  borderColor: selectedApp === app.name ? app.color : "#F2F2F7",
                }}
              >
                <span className="text-lg">{app.emoji}</span>
                <span className="text-[#1C1C1E] font-semibold text-[13px]">{app.name}</span>
                <ChevronRight className="w-3 h-3 text-[#C7C7CC] stroke-[2.5] ml-auto shrink-0" />
              </button>
            ))}
          </div>

          {/* Success state */}
          {ordered && (
            <div className="bg-[#EAF2E8] rounded-2xl p-3 flex items-center gap-2">
              <Check className="w-4 h-4 text-[#3B6E38] stroke-[2.5] shrink-0" />
              <p className="text-[#3B6E38] text-[13px] font-semibold">
                Opened in {selectedApp}! Happy cooking 🍳
              </p>
            </div>
          )}

        </div>

        {/* Bottom summary */}
        <div className="px-5 pb-8 pt-2 shrink-0 border-t border-[#F2F2F7]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-[#3B6E38] stroke-[2.2]" />
              <span className="text-[#1C1C1E] font-bold text-[14px]">
                {selectedItems.length} item{selectedItems.length !== 1 ? "s" : ""} selected
              </span>
            </div>
            <span className="text-[#8E8E93] text-[13px]">
              Tap a store to order
            </span>
          </div>
        </div>

      </div>
    </>
  );
}