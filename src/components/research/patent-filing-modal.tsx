"use client";

import React, { useState } from "react";
import { IPRType } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  FileCheck2,
  ShieldCheck,
  AlertCircle,
  Lightbulb,
} from "lucide-react";

interface PatentFilingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (patentData: any) => void;
}

export function PatentFilingModal({
  isOpen,
  onClose,
  onSuccess,
}: PatentFilingModalProps) {
  const [title, setTitle] = useState("");
  const [inventors, setInventors] = useState("Arpit Bavankule, Dr. Rajeshwar Rao");
  const [iprType, setIprType] = useState<IPRType>("Patent");
  const [commercialPartner, setCommercialPartner] = useState("");
  const [abstract, setAbstract] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/research/patents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          inventors: inventors.split(",").map((s) => s.trim()),
          ipr_type: iprType,
          commercial_partner: commercialPartner || null,
          abstract,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Filing failed");
      }

      onSuccess(data.data);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-3xl p-6 bg-card border-border/80 shadow-2xl">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                File Intellectual Property (IPR) Record
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Institutional Patent & Innovation Cell Registration
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {error && (
          <div className="p-3 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">
              Invention Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Dual-Resonance Terahertz Metamaterial Sensor"
              className="w-full text-xs rounded-xl border border-input bg-background p-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                IPR Category
              </label>
              <select
                value={iprType}
                onChange={(e) => setIprType(e.target.value as IPRType)}
                className="w-full text-xs rounded-xl border border-input bg-background p-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Patent">Patent of Invention</option>
                <option value="Industrial Design">Industrial Design</option>
                <option value="Copyright">Software Source Copyright</option>
                <option value="Trademark">Trademark</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Industry Partner (Optional)
              </label>
              <input
                type="text"
                value={commercialPartner}
                onChange={(e) => setCommercialPartner(e.target.value)}
                placeholder="e.g. Tata Advanced Systems"
                className="w-full text-xs rounded-xl border border-input bg-background p-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">
              Co-Inventors (Comma-separated)
            </label>
            <input
              type="text"
              value={inventors}
              onChange={(e) => setInventors(e.target.value)}
              className="w-full text-xs rounded-xl border border-input bg-background p-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">
              Technical Abstract & Claims Summary
            </label>
            <textarea
              rows={3}
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              placeholder="Describe novelty, technological advance, and potential commercial applications..."
              className="w-full text-xs rounded-xl border border-input bg-background p-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="rounded-xl text-xs"
            >
              {loading ? "Recording..." : "Submit Patent Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
