"use client";

import { useState, useEffect } from "react";
import {
  Send,
  MessageSquare,
  ShieldCheck,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  Radio,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/layout/auth-provider";
import { addHelpRequestReply, type HelpRequestReplyRow } from "@/lib/supabase/queries";
import { useRealtime } from "@/lib/realtime/realtime-provider";
import { cn } from "cn";

interface TicketThreadProps {
  requestId: string;
  initialReplies: HelpRequestReplyRow[];
  isResolved: boolean;
}

export function TicketThread({ requestId, initialReplies, isResolved }: TicketThreadProps) {
  const { user } = useAuth();
  const { activeTicketReplies, dispatchTicketReply, connectionState } = useRealtime();
  const [replies, setReplies] = useState<HelpRequestReplyRow[]>(initialReplies);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Sync real-time replies dispatched across websockets or broadcast channel
  useEffect(() => {
    const liveForThisTicket = activeTicketReplies[requestId];
    if (!liveForThisTicket || liveForThisTicket.length === 0) return;

    setReplies((prev) => {
      let changed = false;
      const merged = [...prev];
      for (const item of liveForThisTicket) {
        if (!merged.some((r) => r.id === item.id)) {
          merged.push(item);
          changed = true;
        }
      }
      return changed ? merged : prev;
    });
  }, [activeTicketReplies, requestId]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    const messageText = newMessage.trim();
    setNewMessage("");
    setIsSending(true);

    try {
      const senderId = user?.id || "mock-student";
      const res = await addHelpRequestReply({
        requestId,
        senderId,
        message: messageText,
      });

      if (res.success && res.data) {
        setReplies((prev) => [...prev, res.data]);
        dispatchTicketReply(res.data);
      }
    } catch {
      // optimistic fallback
      const fallbackReply: HelpRequestReplyRow = {
        id: `rep-${Date.now()}`,
        request_id: requestId,
        sender_id: user?.id || "mock-student",
        message: messageText,
        created_at: new Date().toISOString(),
      };
      setReplies((prev) => [...prev, fallbackReply]);
      dispatchTicketReply(fallbackReply);
    } finally {
      setIsSending(false);
    }
  };

  const handleSimulateStaffReply = () => {
    const staffReply: HelpRequestReplyRow = {
      id: `rep-staff-${Date.now()}`,
      request_id: requestId,
      sender_id: "staff-support-desk",
      message: `[Staff Desk Update • ${new Date().toLocaleTimeString()}]: We have updated your ticket status. A technical officer has reviewed your report and diagnostic logs are being evaluated.`,
      created_at: new Date().toISOString(),
    };
    dispatchTicketReply(staffReply);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
        <h3 className="font-bold text-base flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          Official Communication Thread ({replies.length})
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {connectionState === "connected" ? "Live WebSocket Connected" : "Live Bus Active"}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleSimulateStaffReply}
            className="text-[11px] h-7 px-2 text-muted-foreground hover:text-primary gap-1"
            title="Simulate incoming staff reply via WebSocket"
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            Simulate Staff Reply
          </Button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="space-y-4">
        {replies.length === 0 ? (
          <div className="text-center py-8 px-4 rounded-xl border border-dashed bg-muted/20 text-xs text-muted-foreground">
            No additional replies yet. Campus support officers will post updates here.
          </div>
        ) : (
          replies.map((reply) => {
            const isStaff = reply.sender_id.includes("staff") || reply.sender_id.includes("admin") || reply.sender_id.includes("it");
            const formattedTime = new Intl.DateTimeFormat("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(reply.created_at));

            return (
              <div
                key={reply.id}
                className={cn(
                  "p-4 rounded-2xl border transition-all space-y-2",
                  isStaff
                    ? "bg-primary/5 border-primary/20 ml-0 md:ml-6"
                    : "bg-card border-border/70 mr-0 md:mr-6"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
                        isStaff
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {isStaff ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-foreground">
                        {isStaff ? "Campus Support Desk" : "Student"}
                      </span>
                      {isStaff && (
                        <span className="ml-2 px-1.5 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-semibold">
                          Staff Verified
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="text-[11px] text-muted-foreground">{formattedTime}</span>
                </div>

                <p className="text-sm text-foreground/90 pl-9 whitespace-pre-wrap leading-relaxed">
                  {reply.message}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Reply Input Box */}
      <form onSubmit={handleSendReply} className="space-y-3 pt-2">
        <div className="relative">
          <textarea
            rows={3}
            placeholder={
              isResolved
                ? "This ticket is resolved. You can still post an additional follow-up if needed..."
                : "Type your reply or additional information here..."
            }
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full rounded-2xl border border-input bg-card p-3.5 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring pr-24 leading-relaxed"
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            size="sm"
            className="absolute bottom-3 right-3 rounded-xl gap-1.5 shadow-sm text-xs font-semibold"
          >
            <Send className="w-3.5 h-3.5" />
            {isSending ? "Sending..." : "Reply"}
          </Button>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Replies are immediately visible to the assigned support team and sent via campus notification.
        </p>
      </form>
    </div>
  );
}
