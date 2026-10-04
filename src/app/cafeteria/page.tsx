"use client";

import React, { useState } from "react";
import {
  DiningVendor,
  MenuItem,
  DiningWallet,
  MealOrder,
} from "@/types";
import {
  MOCK_DINING_VENDORS,
  MOCK_MENU_ITEMS,
  MOCK_DINING_WALLET,
  MOCK_MEAL_ORDERS,
  calculateCafeteriaOverview,
} from "@/lib/cafeteria/cafeteria-engine";
import { DiningVendorCard } from "@/components/cafeteria/dining-vendor-card";
import { MealOrderCard } from "@/components/cafeteria/meal-order-card";
import { FoodOrderModal } from "@/components/cafeteria/food-order-modal";
import { WalletTopupModal } from "@/components/cafeteria/wallet-topup-modal";
import {
  UtensilsCrossed,
  Wallet,
  ShoppingBag,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  Flame,
  QrCode,
  Coffee,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function CafeteriaPortalPage() {
  const [activeTab, setActiveTab] = useState<
    "vendors" | "menu" | "orders" | "wallet"
  >("vendors");

  const [vendors] = useState<DiningVendor[]>(MOCK_DINING_VENDORS);
  const [menuItems] = useState<MenuItem[]>(MOCK_MENU_ITEMS);
  const [wallet, setWallet] = useState<DiningWallet>(MOCK_DINING_WALLET);
  const [orders, setOrders] = useState<MealOrder[]>(MOCK_MEAL_ORDERS);

  const [selectedVendor, setSelectedVendor] = useState<DiningVendor | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("all");
  const [selectedDiet, setSelectedDiet] = useState("all");

  const overview = calculateCafeteriaOverview(vendors, menuItems, wallet, orders);

  const filteredVendors = vendors.filter((v) => {
    const matchesCuisine =
      selectedCuisine === "all" || v.cuisine_type === selectedCuisine;
    const matchesSearch =
      !searchQuery.trim() ||
      v.vendor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.location_stall.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.cuisine_type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCuisine && matchesSearch;
  });

  const filteredMenu = menuItems.filter((m) => {
    const matchesDiet = selectedDiet === "all" || m.dietary_tag === selectedDiet;
    const matchesSearch =
      !searchQuery.trim() ||
      m.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.vendor_name && m.vendor_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDiet && matchesSearch;
  });

  const handleSelectVendor = (vendor: DiningVendor) => {
    setSelectedVendor(vendor);
    setIsOrderModalOpen(true);
  };

  const handleOrderSuccess = (newOrder: MealOrder) => {
    setOrders([newOrder, ...orders]);
    // Deduct wallet balance if paid via wallet
    if (newOrder.payment_method === "Dining Wallet") {
      setWallet((prev) => ({
        ...prev,
        wallet_balance_inr: Math.max(0, prev.wallet_balance_inr - newOrder.total_amount_inr),
      }));
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-r from-amber-950/40 via-card to-background p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Phase 35 — Campus Smart Dining Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Smart Cafeteria & Dining Wallets
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Pre-order meals from multi-cuisine campus stalls, pay seamlessly with
              your digital student dining wallet, and collect food with cryptographic QR tokens.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => setIsWalletModalOpen(true)}
              className="bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/20 font-semibold"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Wallet: ₹{wallet.wallet_balance_inr.toFixed(2)}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedVendor(vendors[0]);
                setIsOrderModalOpen(true);
              }}
              className="border-amber-500/30 hover:bg-amber-500/10 text-foreground"
            >
              <ShoppingBag className="h-4 w-4 mr-2 text-amber-500" />
              Quick Order
            </Button>
          </div>
        </div>

        {/* Telemetry Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border/50">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Kitchen Stalls Open</span>
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4 text-amber-500" />
              <span className="text-2xl font-bold text-foreground">{overview.activeVendors}</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Menu Items Live</span>
            <div className="flex items-center gap-2">
              <Coffee className="h-4 w-4 text-emerald-500" />
              <span className="text-2xl font-bold text-foreground">{overview.availableMenuItems}</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Orders In Preparation</span>
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-2xl font-bold text-foreground">{overview.activeOrdersInKitchen}</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Meals Served Today</span>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-500" />
              <span className="text-2xl font-bold text-foreground">{overview.totalMealsServedToday}+</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          {[
            { id: "vendors", label: "Dining Vendors", icon: UtensilsCrossed },
            { id: "menu", label: "Full Menu Catalog", icon: Coffee },
            { id: "orders", label: "My Orders & Passes", icon: ShoppingBag, count: orders.length },
            { id: "wallet", label: "Smart Wallet & Passes", icon: Wallet },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-amber-500/15 text-amber-500 border border-amber-500/30 shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    {tab.count}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        {(activeTab === "vendors" || activeTab === "menu") && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search food stalls, dishes, tags..."
                className="w-full text-xs rounded-xl border border-input bg-card/60 pl-8 pr-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Tab 1: Vendors Directory */}
      {activeTab === "vendors" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-muted-foreground whitespace-nowrap">Filter Cuisine:</span>
            {[
              "all",
              "North Indian & Thali",
              "South Indian Tiffin",
              "Continental & Italian",
              "Healthy Protein Bowls",
              "Specialty Coffee & Tea",
            ].map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => setSelectedCuisine(cuisine)}
                className={`px-3 py-1 rounded-lg border transition-colors whitespace-nowrap ${
                  selectedCuisine === cuisine
                    ? "bg-amber-500/20 text-amber-400 border-amber-500/40 font-medium"
                    : "border-border/60 text-muted-foreground hover:border-border"
                }`}
              >
                {cuisine === "all" ? "All Cuisines" : cuisine}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredVendors.map((vendor) => (
              <DiningVendorCard
                key={vendor.id}
                vendor={vendor}
                onSelect={handleSelectVendor}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Full Menu Catalog */}
      {activeTab === "menu" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-muted-foreground whitespace-nowrap">Dietary Tag:</span>
            {["all", "Pure Veg", "Vegan", "Egg", "Non-Veg", "Jain Option"].map((diet) => (
              <button
                key={diet}
                onClick={() => setSelectedDiet(diet)}
                className={`px-3 py-1 rounded-lg border transition-colors whitespace-nowrap ${
                  selectedDiet === diet
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-medium"
                    : "border-border/60 text-muted-foreground hover:border-border"
                }`}
              >
                {diet === "all" ? "All Diets" : diet}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMenu.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-border/60 bg-card/60 p-4 space-y-3 backdrop-blur-md hover:border-amber-500/40 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-foreground text-sm leading-snug">
                      {item.item_name}
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      {item.vendor_name} • {item.category}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-[10px]"
                  >
                    {item.dietary_tag}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground border-y border-border/40 py-2">
                  <span>{item.calories} kcal</span>
                  <span>{item.prep_time_mins} min prep</span>
                  <span className="font-bold text-base text-foreground">
                    ₹{item.price_inr}
                  </span>
                </div>

                <Button
                  size="sm"
                  onClick={() => {
                    const matchedVendor = vendors.find((v) => v.id === item.vendor_id || v.vendor_name === item.vendor_name) || vendors[0];
                    setSelectedVendor(matchedVendor);
                    setIsOrderModalOpen(true);
                  }}
                  className="w-full bg-amber-600 hover:bg-amber-500 text-white text-xs"
                >
                  Order This Item
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: My Orders & Pickup Tokens */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {orders.map((order) => (
              <MealOrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Smart Wallet */}
      {activeTab === "wallet" && (
        <div className="max-w-xl mx-auto rounded-3xl border border-amber-500/30 bg-gradient-to-br from-card via-card/70 to-background p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                <Wallet className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Campus Smart Dining Wallet</h3>
                <p className="text-xs text-muted-foreground font-mono">
                  Holder: {wallet.scholar_name} ({wallet.scholar_id})
                </p>
              </div>
            </div>
            <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30">
              Active NFC / QR
            </Badge>
          </div>

          <div className="rounded-2xl bg-muted/50 p-5 space-y-3 border border-border/40">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-muted-foreground">Available Dining Balance</span>
              <span className="text-3xl font-extrabold text-foreground">
                ₹{wallet.wallet_balance_inr.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t border-border/40">
              <span>Monthly College Subsidy:</span>
              <span className="font-semibold text-emerald-500">₹{wallet.monthly_subsidy_inr.toFixed(2)} / mo</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Auto-Reload Safeguard:</span>
              <span className="font-semibold text-foreground">
                {wallet.auto_reload_enabled ? "Enabled (₹500 threshold)" : "Disabled"}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border/60 p-4 text-center space-y-2 bg-card/80">
            <QrCode className="h-14 w-14 text-amber-500 mx-auto" />
            <p className="text-xs font-mono font-semibold text-foreground">
              {wallet.qr_payment_token}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Scan at any cafeteria POS scanner to debit without pin.
            </p>
          </div>

          <Button
            onClick={() => setIsWalletModalOpen(true)}
            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold"
          >
            Recharge Wallet Balance
          </Button>
        </div>
      )}

      {/* Modals */}
      <FoodOrderModal
        vendor={selectedVendor}
        menuItems={menuItems}
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onSuccess={handleOrderSuccess}
      />

      <WalletTopupModal
        wallet={wallet}
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onSuccess={(updated) => setWallet(updated)}
      />
    </div>
  );
}
