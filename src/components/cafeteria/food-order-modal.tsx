"use client";

import React, { useState } from "react";
import { DiningVendor, MenuItem, MealOrder } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { UtensilsCrossed, QrCode, CheckCircle2, ShoppingBag } from "lucide-react";

interface FoodOrderModalProps {
  vendor: DiningVendor | null;
  menuItems: MenuItem[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (order: MealOrder) => void;
}

export function FoodOrderModal({
  vendor,
  menuItems,
  isOpen,
  onClose,
  onSuccess,
}: FoodOrderModalProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [scholarName, setScholarName] = useState("Arpit Bavankule");
  const [pickupSlot, setPickupSlot] = useState("Immediate Express Pickup (10 mins)");
  const [paymentMethod, setPaymentMethod] = useState<"Dining Wallet" | "UPI Instant">("Dining Wallet");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedOrder, setGeneratedOrder] = useState<MealOrder | null>(null);

  const vendorMenu = vendor
    ? menuItems.filter((m) => m.vendor_id === vendor.id || m.vendor_name === vendor.vendor_name)
    : [];

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor || !selectedItem) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/cafeteria/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scholarId: "SCH-2026-8819",
          scholarName,
          vendorName: vendor.vendor_name,
          itemsSummary: `1x ${selectedItem.item_name}`,
          totalAmountInr: selectedItem.price_inr,
          pickupSlot,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setGeneratedOrder(data.data);
        onSuccess(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setGeneratedOrder(null);
    setSelectedItem(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleReset}>
      <DialogContent className="max-w-md bg-card/95 backdrop-blur-xl border-border/80">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <UtensilsCrossed className="h-5 w-5 text-amber-500" />
            {generatedOrder ? "Meal Token Generated" : `Order from ${vendor?.vendor_name}`}
          </DialogTitle>
          <DialogDescription>
            {generatedOrder
              ? "Present this cryptographic pickup code at the counter."
              : "Select a chef special or combo from this food stall."}
          </DialogDescription>
        </DialogHeader>

        {generatedOrder ? (
          <div className="space-y-4 py-3">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
              <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Order Received in Kitchen
              </p>
              <h4 className="text-xl font-mono font-bold text-foreground mt-1">
                {generatedOrder.token_pass_code}
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Order Code: {generatedOrder.order_code}
              </p>
            </div>

            <div className="rounded-lg bg-muted/60 p-3 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Item:</span>
                <span className="font-medium text-foreground">{generatedOrder.items_summary}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pickup Window:</span>
                <span className="font-medium text-foreground">{generatedOrder.pickup_slot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment:</span>
                <span className="font-bold text-foreground">₹{generatedOrder.total_amount_inr.toFixed(2)} ({generatedOrder.payment_method})</span>
              </div>
            </div>

            <Button onClick={handleReset} className="w-full bg-amber-600 hover:bg-amber-500 text-white">
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleOrder} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-xs">Choose Menu Dish</Label>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {vendorMenu.length > 0 ? (
                  vendorMenu.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                        selectedItem?.id === item.id
                          ? "border-amber-500 bg-amber-500/10"
                          : "border-border/60 hover:border-border"
                      }`}
                    >
                      <div className="flex justify-between font-medium">
                        <span>{item.item_name}</span>
                        <span className="font-bold text-amber-500">₹{item.price_inr}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                        <Badge variant="secondary" className="text-[10px] px-1 py-0">{item.dietary_tag}</Badge>
                        <span>{item.calories} kcal</span>
                        <span>• {item.prep_time_mins}m prep</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">No menu items currently listed for this vendor.</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Pickup Slot</Label>
              <select
                value={pickupSlot}
                onChange={(e) => setPickupSlot(e.target.value)}
                className="w-full text-xs rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="Immediate Express Pickup (10 mins)">Immediate Express Pickup (10 mins)</option>
                <option value="Lunch Surge Slot (13:15 - 13:30)">Lunch Surge Slot (13:15 - 13:30)</option>
                <option value="Afternoon Recess (15:00 - 15:15)">Afternoon Recess (15:00 - 15:15)</option>
                <option value="Evening Library Break (17:30 - 17:45)">Evening Library Break (17:30 - 17:45)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Payment Method</Label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Button
                  type="button"
                  variant={paymentMethod === "Dining Wallet" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("Dining Wallet")}
                  className={paymentMethod === "Dining Wallet" ? "bg-amber-600 text-white" : ""}
                >
                  Dining Wallet
                </Button>
                <Button
                  type="button"
                  variant={paymentMethod === "UPI Instant" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("UPI Instant")}
                  className={paymentMethod === "UPI Instant" ? "bg-amber-600 text-white" : ""}
                >
                  UPI Instant
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !selectedItem}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white mt-2"
            >
              {isSubmitting ? "Generating Voucher..." : `Confirm Order (₹${selectedItem ? selectedItem.price_inr : 0})`}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
