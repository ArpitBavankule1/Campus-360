"use client";

import React, { useState } from "react";
import { GrievanceCase, OmbudsmanCategory, UrgencyLevel } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Lock,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  FileText,
  EyeOff,
} from "lucide-react";

interface AnonymousFilingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (caseItem: GrievanceCase) => void;
}

export function AnonymousFilingModal({
  isOpen,
  onClose,
  onSuccess,
}: AnonymousFilingModalProps) {
  const [category, setCategory] = useState<OmbudsmanCategory>("Anti-Ragging Squad");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState<UrgencyLevel>("High Priority");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdCase, setCreatedCase] = useState<GrievanceCase | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ombudsman/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          title,
          description,
          is_anonymous: isAnonymous,
          urgency_level: urgency,
          evidence_attachments: evidenceUrl ? [evidenceUrl] : [],
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit grievance.");
      }

      setCreatedCase(data.data);
      onSuccess(data.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (createdCase) {
      navigator.clipboard.writeText(createdCase.tracking_hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-3xl p-6 bg-card border border-border/80 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2.5 rounded-2xl bg-destructive/10 text-destructive">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                {createdCase ? "Confidential Grievance Lodged" : "Lodge Confidential Grievance"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {createdCase
                  ? "Your complaint has been encrypted with a Zero-Knowledge tracking hash."
                  : "Statutorily protected whistleblower grievance filed directly to the Ombudsman."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {error && (
          <div className="p-3 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {createdCase ? (
          <div className="space-y-4 pt-2">
            <div className="p-5 rounded-3xl bg-gradient-to-br from-destructive/15 via-destructive/5 to-card border border-destructive/30 text-center space-y-3">
              <div className="flex justify-center">
                <div className="p-3 rounded-2xl bg-card border border-border shadow-xs text-destructive">
                  <Lock className="w-14 h-14" />
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Zero-Knowledge Tracking Code
                </span>
                <div className="font-mono font-extrabold text-xl text-foreground flex items-center justify-center gap-2 mt-0.5">
                  <span>{createdCase.tracking_hash}</span>
                  <button
                    onClick={handleCopyCode}
                    className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="text-xs space-y-1 text-muted-foreground pt-2 border-t border-border/40">
                <div className="flex justify-between">
                  <span>Category:</span>
                  <strong className="text-foreground">{createdCase.category}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Assigned Tier:</span>
                  <strong className="text-foreground">{createdCase.escalation_tier}</strong>
                </div>
                <div className="flex justify-between">
                  <span>SLA Guarantee:</span>
                  <strong className="text-destructive font-mono font-bold">Within 72 Hours</strong>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-muted/60 text-[11px] text-muted-foreground text-left flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  Save this tracking code. It is cryptographically disconnected from your user login and is your sole key to inspect tribunal hearing notes.
                </span>
              </div>
            </div>

            <Button
              className="w-full rounded-2xl text-xs h-9 bg-primary text-primary-foreground font-semibold"
              onClick={onClose}
            >
              Done & Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground/80 block mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as OmbudsmanCategory)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-muted/60 border border-border focus:outline-hidden focus:ring-1 focus:ring-primary text-foreground"
                >
                  <option value="Anti-Ragging Squad">Anti-Ragging Squad</option>
                  <option value="Internal Complaints Committee (ICC)">Internal Complaints Committee (ICC)</option>
                  <option value="Academic Evaluation & Exams">Academic Evaluation & Exams</option>
                  <option value="Hostel Amenities & Mess">Hostel Amenities & Mess</option>
                  <option value="Discrimination & Harassment">Discrimination & Harassment</option>
                  <option value="General Grievance">General Grievance</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground/80 block mb-1">
                  Urgency Level
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-muted/60 border border-border focus:outline-hidden focus:ring-1 focus:ring-primary text-foreground"
                >
                  <option value="Critical Emergency">Critical Emergency</option>
                  <option value="High Priority">High Priority</option>
                  <option value="Standard Review">Standard Review</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground/80 block mb-1">
                Grievance Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-muted/60 border border-border focus:outline-hidden focus:ring-1 focus:ring-primary text-foreground"
                placeholder="Brief summary of the incident or issue"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground/80 block mb-1">
                Detailed Incident Narration
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-muted/60 border border-border focus:outline-hidden focus:ring-1 focus:ring-primary text-foreground resize-none"
                placeholder="Include specific dates, location, and involved individuals..."
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground/80 block mb-1">
                Encrypted Evidence Link (Drive / Cloud URL)
              </label>
              <input
                type="url"
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-muted/60 border border-border focus:outline-hidden focus:ring-1 focus:ring-primary text-foreground"
                placeholder="https://drive.google.com/... (optional)"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="anonCheck"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="anonCheck" className="text-xs text-foreground font-medium">
                Keep filing strictly anonymous (Zero-Knowledge Disconnect)
              </label>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="rounded-xl text-xs h-9 px-4"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={loading}
                className="rounded-xl text-xs h-9 px-4 gap-1.5 bg-destructive hover:bg-destructive/90 text-white font-semibold"
              >
                <FileText className="w-3.5 h-3.5" />
                {loading ? "Filing..." : "Submit to Ombudsman"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
