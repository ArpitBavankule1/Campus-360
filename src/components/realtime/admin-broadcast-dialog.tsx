"use client";

import { useState } from "react";
import { useRealtime } from "@/lib/realtime/realtime-provider";
import {
  Radio,
  Send,
  AlertTriangle,
  Info,
  Flame,
  CheckCircle2,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import type { BroadcastSeverity } from "@/lib/realtime/types";
import { cn } from "cn";

const PRESET_TEMPLATES = [
  {
    title: "Severe Weather Advisory & Class Transition",
    message: "Heavy monsoon rainfall forecasted this afternoon. All afternoon lectures after 14:00 will transition to remote online streaming.",
    severity: "warning" as BroadcastSeverity,
    source: "Campus Registrar & Disaster Management Committee",
    actionLink: "/timetable",
    actionText: "Check Schedule",
  },
  {
    title: "Urgent: Computer Lab 304 High Voltage Maintenance",
    message: "Electrical substation inspection underway in Ada Lovelace Block. Lab 304 practical exams relocated to Turing Block Lab 102.",
    severity: "critical" as BroadcastSeverity,
    source: "Dean of Academic Infrastructure",
    actionLink: "/map",
    actionText: "Locate Lab 102",
  },
  {
    title: "Annual Tech Fest Hackathon Registration Open",
    message: "InnovateX 2026 hackathon registrations are live. 48-hour team coding sprint with industry mentors and cash prizes.",
    severity: "info" as BroadcastSeverity,
    source: "Student Council & Tech Club",
    actionLink: "/events",
    actionText: "Register Team",
  },
];

interface AdminBroadcastDialogProps {
  triggerClassName?: string;
  buttonLabel?: string;
}

export function AdminBroadcastDialog({
  triggerClassName,
  buttonLabel = "Broadcast Emergency Alert",
}: AdminBroadcastDialogProps) {
  const { dispatchBroadcast, dispatchTicketReply, connectionState } = useRealtime();
  const [isOpen, setIsOpen] = useState(false);
  const [severity, setSeverity] = useState<BroadcastSeverity>("warning");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [source, setSource] = useState("Central Campus Administration");
  const [actionLink, setActionLink] = useState("");
  const [actionText, setActionText] = useState("");
  const [sentSuccess, setSentSuccess] = useState(false);

  const applyTemplate = (tmpl: (typeof PRESET_TEMPLATES)[number]) => {
    setTitle(tmpl.title);
    setMessage(tmpl.message);
    setSeverity(tmpl.severity);
    setSource(tmpl.source);
    setActionLink(tmpl.actionLink);
    setActionText(tmpl.actionText);
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    dispatchBroadcast({
      title: title.trim(),
      message: message.trim(),
      severity,
      source: source.trim() || "Institutional Command Center",
      actionLink: actionLink.trim() || undefined,
      actionText: actionText.trim() || undefined,
      dismissible: true,
    });

    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setIsOpen(false);
    }, 1200);
  };

  const handleSimulateReply = () => {
    dispatchTicketReply({
      id: `sim-rep-${Date.now()}`,
      request_id: "req-001",
      sender_id: "staff-lead-01",
      message: `[Live Staff Update ${new Date().toLocaleTimeString()}]: Technicians have been dispatched to inspect your reported issue. Expected resolution within 45 minutes.`,
      created_at: new Date().toISOString(),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "rounded-xl gap-2 font-semibold border-rose-500/30 hover:border-rose-500 hover:bg-rose-500/10 text-rose-700 dark:text-rose-300 cursor-pointer shadow-xs",
          triggerClassName
        )}
      >
        <Radio className="h-3.5 w-3.5 text-rose-500 animate-pulse" />
        {buttonLabel}
      </DialogTrigger>

      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl p-6">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-rose-500/15 text-rose-600">
              <Radio className="h-5 w-5" />
            </div>
            <DialogTitle className="text-lg font-bold">
              Campus Real-Time Broadcast Console
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs">
            Push instantaneous notifications and emergency banners to all active scholars, faculty members, and staff dashboards via WebSockets.
          </DialogDescription>
        </DialogHeader>

        {/* Quick Preset Selector */}
        <div className="space-y-2 pt-2">
          <Label className="text-xs font-semibold text-muted-foreground">
            ⚡ Quick Incident Templates
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {PRESET_TEMPLATES.map((tmpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyTemplate(tmpl)}
                className="text-left p-2.5 rounded-xl border border-border/70 hover:border-primary/50 hover:bg-primary/5 transition-all text-xs group cursor-pointer"
              >
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  {tmpl.severity === "critical" ? (
                    <Flame className="h-3 w-3 text-rose-500" />
                  ) : tmpl.severity === "warning" ? (
                    <AlertTriangle className="h-3 w-3 text-amber-500" />
                  ) : (
                    <Info className="h-3 w-3 text-primary" />
                  )}
                  <span className="truncate group-hover:text-primary transition-colors">
                    {tmpl.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-2">
                  {tmpl.title}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Broadcast Form */}
        <form onSubmit={handleBroadcast} className="space-y-4 pt-2">
          {/* Severity Radio Group */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Alert Severity Level</Label>
            <div className="grid grid-cols-3 gap-2">
              {(["info", "warning", "critical"] as BroadcastSeverity[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSeverity(lvl)}
                  className={cn(
                    "flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer",
                    severity === lvl
                      ? lvl === "critical"
                        ? "bg-rose-500 text-white border-rose-600 shadow-sm"
                        : lvl === "warning"
                        ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                        : "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-muted/40 border-border/70 text-muted-foreground hover:bg-muted"
                  )}
                >
                  {lvl === "critical" && <Flame className="h-3.5 w-3.5" />}
                  {lvl === "warning" && <AlertTriangle className="h-3.5 w-3.5" />}
                  {lvl === "info" && <Info className="h-3.5 w-3.5" />}
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="broadcast-title" className="text-xs font-semibold">
              Alert Headline
            </Label>
            <Input
              id="broadcast-title"
              placeholder="e.g. Flash Flood Advisory — Early Dismissal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl text-xs h-9"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="broadcast-message" className="text-xs font-semibold">
              Broadcast Message
            </Label>
            <textarea
              id="broadcast-message"
              rows={3}
              placeholder="Detailed instructions for students and staff..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-xl border border-input bg-card p-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="broadcast-source" className="text-xs font-semibold">
                Originating Authority
              </Label>
              <Input
                id="broadcast-source"
                placeholder="Dean of Students / IT Desk"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="rounded-xl text-xs h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="broadcast-action" className="text-xs font-semibold">
                Action Deep-Link (Optional)
              </Label>
              <Input
                id="broadcast-action"
                placeholder="/map or /timetable"
                value={actionLink}
                onChange={(e) => setActionLink(e.target.value)}
                className="rounded-xl text-xs h-9"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-border/70">
            {/* Live simulator helper */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSimulateReply}
              className="text-[11px] text-muted-foreground hover:text-primary gap-1.5 h-8 px-2"
              title="Test real-time ticket messaging without sending global broadcast"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Simulate Ticket Reply
            </Button>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="rounded-xl h-9 text-xs"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                size="sm"
                disabled={!title.trim() || !message.trim()}
                className={cn(
                  "rounded-xl gap-2 font-bold h-9 text-xs shadow-md transition-all",
                  severity === "critical"
                    ? "bg-rose-600 hover:bg-rose-700 text-white"
                    : "bg-primary hover:bg-primary/90 text-primary-foreground"
                )}
              >
                {sentSuccess ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Transmitted!
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    Transmit Broadcast
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
