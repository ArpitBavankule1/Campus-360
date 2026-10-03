"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, CheckCircle2, X } from "lucide-react";
import { LostAndFoundItem, LostFoundCategory } from "@/types";

interface ReportLostItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (item: LostAndFoundItem) => void;
}

export function ReportLostItemModal({
  isOpen,
  onClose,
  onSuccess,
}: ReportLostItemModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<LostFoundCategory>("Electronics & Laptops");
  const [foundLocation, setFoundLocation] = useState("Central Library");
  const [description, setDescription] = useState("");
  const [reportedBy, setReportedBy] = useState("Scholar / Staff Member");
  const [loading, setLoading] = useState(false);
  const [resultItem, setResultItem] = useState<LostAndFoundItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/security-hub/lost-found", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          foundLocation,
          description,
          reportedBy,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to log lost item.");
      }

      setResultItem(data.item);
      if (onSuccess) onSuccess(data.item);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error logging item");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-border/80 bg-card p-6 shadow-2xl animate-in fade-in-50 zoom-in-95">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        {!resultItem ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500 border border-sky-500/20">
                <HelpCircle className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Report Found Property
                </h2>
                <p className="text-xs text-muted-foreground">Catalog into Campus Security AI Lost & Found Ledger</p>
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-destructive/15 p-3 text-xs text-destructive border border-destructive/20">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  Item Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sony WH-1000XM5 Wireless Headphones in Black Case"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as LostFoundCategory)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Electronics & Laptops">Electronics & Laptops</option>
                    <option value="Wallets & ID Cards">Wallets & ID Cards</option>
                    <option value="Keys & Smart Badges">Keys & Smart Badges</option>
                    <option value="Bags & Backpacks">Bags & Backpacks</option>
                    <option value="Watches & Jewellery">Watches & Jewellery</option>
                    <option value="Books & Documents">Books & Documents</option>
                    <option value="Other Items">Other Items</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    Found Location
                  </label>
                  <input
                    type="text"
                    required
                    value={foundLocation}
                    onChange={(e) => setFoundLocation(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  Detailed Item Description & Distinguishing Marks
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Color, condition, scratches, identifying stickers or contents..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  Logged By (Your Name / Role)
                </label>
                <input
                  type="text"
                  required
                  value={reportedBy}
                  onChange={(e) => setReportedBy(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-sky-600 hover:bg-sky-500 text-white"
                >
                  {loading ? "Cataloging..." : "Submit to Security Vault"}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-2 space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sky-500/10 text-sky-500 border border-sky-500/30">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <Badge className="bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30 mb-2">
                Item Cataloged
              </Badge>
              <h3 className="text-lg font-bold text-foreground">
                {resultItem.title}
              </h3>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                Ref Code: {resultItem.item_code}
              </p>
            </div>

            <div className="rounded-xl bg-muted/30 p-3 text-xs text-left text-muted-foreground space-y-1 font-mono">
              <div>Category: <strong className="text-foreground">{resultItem.category}</strong></div>
              <div>Location: <strong className="text-foreground">{resultItem.found_location}</strong></div>
              <div>Status: <strong className="text-emerald-500">{resultItem.status}</strong></div>
              <div>Deposited at: <strong className="text-foreground">Campus Security Locker #3</strong></div>
            </div>

            <Button onClick={onClose} className="w-full bg-sky-600 hover:bg-sky-500 text-white">
              Done
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
