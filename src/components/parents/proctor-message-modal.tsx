"use client";

import React, { useState } from "react";
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
import { MessageSquare, Send, CheckCircle2, Shield } from "lucide-react";

interface ProctorMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  proctorName: string;
  wardName: string;
}

export function ProctorMessageModal({
  isOpen,
  onClose,
  proctorName,
  wardName,
}: ProctorMessageModalProps) {
  const [topic, setTopic] = useState("Academic Attendance");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
    }, 600);
  };

  const handleReset = () => {
    setIsSent(false);
    setSubject("");
    setMessage("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleReset}>
      <DialogContent className="max-w-lg bg-card/95 backdrop-blur-xl border-border/80">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Official Note to Academic Proctor
          </DialogTitle>
          <DialogDescription className="text-xs">
            Send a direct, encrypted communication to {proctorName} regarding ward {wardName}.
          </DialogDescription>
        </DialogHeader>

        {isSent ? (
          <div className="py-6 text-center space-y-4">
            <div className="h-14 w-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20 shadow-inner">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Advisory Dispatched</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Your message has been officially routed to Proctor {proctorName}.
                Expect a response or callback within 24 operational hours.
              </p>
            </div>
            <Button onClick={handleReset} className="w-full text-xs">
              Close Window
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Topic Category</Label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-border/60 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Academic Attendance">Academic Attendance</option>
                  <option value="Hostel & Residence">Hostel & Residence</option>
                  <option value="Health / Medical Leave">Health / Medical Leave</option>
                  <option value="Examination & Performance">Examination & Performance</option>
                  <option value="Fee Billing / Accounts">Fee Billing / Accounts</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Urgency Level</Label>
                <select className="w-full text-xs px-3 py-2 rounded-lg border border-border/60 bg-background focus:outline-none focus:ring-1 focus:ring-primary">
                  <option value="standard">Standard Inquiry (24-48 hrs)</option>
                  <option value="priority">Priority Attention (Same-day)</option>
                  <option value="emergency">Hostel / Medical Urgent</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Subject</Label>
              <Input
                placeholder="e.g., Query regarding Cryptography elective class attendance..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Message Body</Label>
              <textarea
                rows={4}
                placeholder="Type your official guardian message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full text-xs p-3 rounded-lg border border-border/60 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="p-2.5 rounded-lg bg-muted/40 border border-border/40 text-[11px] text-muted-foreground flex items-center gap-2">
              <Shield className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>
                All guardian communications are logged into the institutional ERP student grievance and welfare docket.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
              <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting} className="text-xs">
                <Send className="h-3.5 w-3.5 mr-1" />
                {isSubmitting ? "Dispatching..." : "Send to Proctor"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
