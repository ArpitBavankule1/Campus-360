"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LifeBuoy,
  Send,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Paperclip,
  Info,
  Clock,
  Building2,
  Tag,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/components/layout/auth-provider";
import { createHelpRequest } from "@/lib/supabase/queries";
import type { RequestPriority } from "@/types/database.types";
import { cn } from "cn";

interface TicketFormProps {
  departments: Array<{ id: string; name: string; code: string }>;
}

export function TicketForm({ departments }: TicketFormProps) {
  const router = useRouter();
  const { user, profile } = useAuth();

  const [category, setCategory] = useState("IT & Network");
  const [departmentId, setDepartmentId] = useState("");
  const [priority, setPriority] = useState<RequestPriority>("medium");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const categories = [
    { label: "IT & Network Services", value: "IT & Network", desc: "Wi-Fi access, portal bugs, lab computer issues" },
    { label: "Library & RFID Systems", value: "Library & RFID", desc: "Turnstile check-in, book RFID tags, quiet pods" },
    { label: "Laboratory & Equipment", value: "Laboratory", desc: "Hardware access, specialized software licenses, kits" },
    { label: "Examinations & Grading", value: "Examinations", desc: "Hall tickets, paper re-checks, attendance waivers" },
    { label: "Hostel & Living Amenities", value: "Hostel & Facilities", desc: "Mess credits, room maintenance, water, electricity" },
    { label: "ID Card & Accounts", value: "Id Card & Fees", desc: "Replacement cards, tuition receipts, fee clearances" },
  ];

  const priorities: { label: string; value: RequestPriority; color: string; sla: string }[] = [
    { label: "Low", value: "low", color: "hover:border-slate-400 data-[state=checked]:border-slate-500", sla: "Within 48h" },
    { label: "Medium", value: "medium", color: "hover:border-blue-400 data-[state=checked]:border-blue-500", sla: "Within 24h" },
    { label: "High", value: "high", color: "hover:border-amber-400 data-[state=checked]:border-amber-500", sla: "Within 6-8h" },
    { label: "Urgent", value: "urgent", color: "hover:border-rose-400 data-[state=checked]:border-rose-500", sla: "Within 2h" },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileName = e.target.files[0].name;
      setAttachments(prev => [...prev, fileName]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!subject.trim()) {
      setErrorMsg("Please specify a concise subject for your ticket.");
      return;
    }
    if (!description.trim()) {
      setErrorMsg("Please provide a detailed description so our technicians can assist.");
      return;
    }

    setIsSubmitting(true);
    try {
      const collegeId = profile?.college_id || "11111111-1111-4111-8111-111111111111";
      const studentId = user?.id || "mock-student";

      const res = await createHelpRequest({
        college_id: collegeId,
        student_id: studentId,
        department_id: departmentId || null,
        category,
        subject,
        description,
        priority,
      });

      if (res.success && res.data) {
        setSubmittedId(res.data.id);
      } else {
        setErrorMsg("Failed to create ticket. Please verify your connection.");
      }
    } catch {
      setErrorMsg("An unexpected error occurred while submitting your ticket.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedId) {
    return (
      <Card className="border-emerald-500/30 bg-emerald-500/5 max-w-2xl mx-auto shadow-lg">
        <CardContent className="p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-foreground">Ticket Successfully Created!</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Your support ticket has been registered in the institutional queue. Ticket Reference ID:
          </p>

          <div className="font-mono text-base font-bold bg-background py-2 px-4 rounded-lg border inline-block text-primary">
            #{submittedId.slice(0, 12)}
          </div>

          <p className="text-xs text-muted-foreground">
            Our campus administrative team will review your query within the SLA window for <strong className="text-foreground">{priority.toUpperCase()}</strong> priority.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/help-desk/${submittedId}`}
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm"
            >
              View Ticket & Conversation
            </Link>
            <Link
              href="/help-desk"
              className="px-5 py-2.5 rounded-xl border bg-background text-foreground font-semibold text-sm hover:bg-muted transition-colors"
            >
              Back to Help Desk
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
      {errorMsg && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. Category Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold flex items-center gap-2">
          <Tag className="w-4 h-4 text-primary" />
          Select Support Category <span className="text-rose-500">*</span>
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {categories.map((c) => {
            const isSelected = category === c.value;
            return (
              <button
                type="button"
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={cn(
                  "p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between",
                  isSelected
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                    : "border-border/70 hover:border-border hover:bg-muted/30"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-foreground">{c.label}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
                </div>
                <span className="text-xs text-muted-foreground mt-1">{c.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Priority Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          Select Urgency & Priority Level <span className="text-rose-500">*</span>
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {priorities.map((p) => {
            const isSelected = priority === p.value;
            return (
              <button
                type="button"
                key={p.value}
                onClick={() => setPriority(p.value)}
                className={cn(
                  "p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1",
                  isSelected
                    ? "border-primary bg-primary/10 ring-2 ring-primary/20 font-semibold"
                    : "border-border/70 hover:border-border hover:bg-muted/30 text-muted-foreground"
                )}
              >
                <span className={cn("text-xs font-bold", isSelected ? "text-primary" : "text-foreground")}>
                  {p.label}
                </span>
                <span className="text-[11px] text-muted-foreground font-normal">{p.sla}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Department Association (Optional) */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold flex items-center gap-2">
          <Building2 className="w-4 h-4 text-primary" />
          Related Department (Optional)
        </Label>
        <select
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
          className="w-full h-10 rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">General Campus Help Desk / Unassigned</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} ({d.code})
            </option>
          ))}
        </select>
      </div>

      {/* 4. Subject */}
      <div className="space-y-2">
        <Label htmlFor="subject" className="text-sm font-semibold flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          Ticket Subject <span className="text-rose-500">*</span>
        </Label>
        <Input
          id="subject"
          placeholder="e.g. Wi-Fi drops frequently in Turing Block 3rd floor Lab 302"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          className="h-11 rounded-xl"
        />
      </div>

      {/* 5. Detailed Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-semibold">
          Detailed Description <span className="text-rose-500">*</span>
        </Label>
        <textarea
          id="description"
          rows={5}
          placeholder="Please describe the exact issue, device details, error messages, or location coordinates so our staff can reproduce and fix it quickly."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full rounded-xl border border-input bg-background p-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring leading-relaxed"
        />
      </div>

      {/* 6. Mock Attachment Dropzone */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold flex items-center gap-2">
          <Paperclip className="w-4 h-4 text-primary" />
          Supporting Screenshots or Documentation
        </Label>
        <div className="border border-dashed border-border/80 rounded-xl p-4 text-center hover:bg-muted/30 transition-colors relative">
          <input
            type="file"
            onChange={handleFileUpload}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <p className="text-xs text-muted-foreground">
            Drop your screenshot, photo, or PDF here, or <span className="text-primary font-medium underline">browse files</span>
          </p>
          <p className="text-[11px] text-muted-foreground/70 mt-1">PNG, JPG, PDF up to 10MB</p>
        </div>

        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {attachments.map((file, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-muted text-xs font-mono text-foreground border"
              >
                <Paperclip className="w-3 h-3 text-muted-foreground" />
                {file}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t">
        <Link
          href="/help-desk"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Cancel & Return
        </Link>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl px-6 font-semibold shadow-md gap-2"
        >
          {isSubmitting ? (
            <>Submitting Ticket...</>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit Ticket to Help Desk
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
