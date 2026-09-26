"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { CampusBroadcast, RealtimeConnectionState } from "./types";
import { playChime, isSoundEnabled, setSoundEnabled } from "./chime";
import type { HelpRequestReplyRow, NotificationRow } from "@/lib/supabase/queries";

export interface RealtimeToast {
  id: string;
  title: string;
  message: string;
  type: "broadcast" | "reply" | "notice" | "info";
  timestamp: string;
  link?: string;
}

interface RealtimeContextType {
  connectionState: RealtimeConnectionState;
  broadcasts: CampusBroadcast[];
  toasts: RealtimeToast[];
  soundEnabled: boolean;
  activeTicketReplies: Record<string, HelpRequestReplyRow[]>;
  toggleSound: () => void;
  dismissBroadcast: (id: string) => void;
  dismissToast: (id: string) => void;
  dispatchBroadcast: (broadcast: Omit<CampusBroadcast, "id" | "timestamp">) => void;
  dispatchTicketReply: (reply: HelpRequestReplyRow) => void;
  addToast: (toast: Omit<RealtimeToast, "id" | "timestamp">) => void;
}

const RealtimeContext = createContext<RealtimeContextType | null>(null);

const DEFAULT_BROADCASTS: CampusBroadcast[] = [
  {
    id: "bc-init-01",
    title: "Campus Wi-Fi Maintenance Window",
    message: "Network core upgrades scheduled tonight between 23:00 - 01:00. Fiber redundancy will remain active in Central Library.",
    severity: "info",
    source: "Campus IT Services & Infrastructure Desk",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    actionLink: "/help-desk",
    actionText: "Report Downtime",
    dismissible: true,
  },
];

const BROADCAST_BUS_NAME = "campus_live_bus";

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [connectionState, setConnectionState] = useState<RealtimeConnectionState>("connecting");
  const [broadcasts, setBroadcasts] = useState<CampusBroadcast[]>(DEFAULT_BROADCASTS);
  const [toasts, setToasts] = useState<RealtimeToast[]>([]);
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);
  const [activeTicketReplies, setActiveTicketReplies] = useState<Record<string, HelpRequestReplyRow[]>>({});
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const supabaseRef = useRef(createClient());

  // Initialize sound settings
  useEffect(() => {
    setSoundEnabledState(isSoundEnabled());
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabledState((prev) => {
      const next = !prev;
      setSoundEnabled(next);
      if (next) playChime("success");
      return next;
    });
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((toastData: Omit<RealtimeToast, "id" | "timestamp">) => {
    const newToast: RealtimeToast = {
      ...toastData,
      id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
    };

    setToasts((prev) => [newToast, ...prev.slice(0, 4)]);

    // Auto dismiss after 6 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 6000);
  }, []);

  const dismissBroadcast = useCallback((id: string) => {
    setBroadcasts((prev) => prev.filter((b) => b.id !== id));
  }, []);

  // Handle incoming broadcast object
  const handleIncomingBroadcast = useCallback((broadcast: CampusBroadcast, isSelf = false) => {
    setBroadcasts((prev) => {
      if (prev.some((b) => b.id === broadcast.id)) return prev;
      return [broadcast, ...prev];
    });

    if (!isSelf) {
      playChime(broadcast.severity === "critical" ? "alert" : "broadcast");
      addToast({
        title: `🚨 ${broadcast.title}`,
        message: broadcast.message,
        type: "broadcast",
        link: broadcast.actionLink,
      });
    }
  }, [addToast]);

  // Handle incoming ticket reply
  const handleIncomingTicketReply = useCallback((reply: HelpRequestReplyRow, isSelf = false) => {
    setActiveTicketReplies((prev) => {
      const currentReplies = prev[reply.request_id] || [];
      if (currentReplies.some((r) => r.id === reply.id)) return prev;
      return {
        ...prev,
        [reply.request_id]: [...currentReplies, reply],
      };
    });

    if (!isSelf) {
      playChime("message");
      addToast({
        title: "💬 New Help Desk Response",
        message: reply.message.length > 80 ? `${reply.message.slice(0, 80)}...` : reply.message,
        type: "reply",
        link: `/help-desk/${reply.request_id}`,
      });
    }
  }, [addToast]);

  // Dispatchers
  const dispatchBroadcast = useCallback((broadcastData: Omit<CampusBroadcast, "id" | "timestamp">) => {
    const fullBroadcast: CampusBroadcast = {
      ...broadcastData,
      id: `bc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
    };

    handleIncomingBroadcast(fullBroadcast, true);
    playChime("success");

    // Send across BroadcastChannel to sync multiple tabs instantly
    try {
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.postMessage({
          type: "EMERGENCY_BROADCAST",
          payload: fullBroadcast,
        });
      }
    } catch {
      // Ignore broadcast errors
    }

    // Also send via Supabase Realtime channel if available
    try {
      const channel = supabaseRef.current.channel("campus_global_realtime");
      channel.send({
        type: "broadcast",
        event: "emergency_broadcast",
        payload: fullBroadcast,
      });
    } catch {
      // Ignore fallback
    }
  }, [handleIncomingBroadcast]);

  const dispatchTicketReply = useCallback((reply: HelpRequestReplyRow) => {
    handleIncomingTicketReply(reply, true);

    try {
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.postMessage({
          type: "TICKET_REPLY",
          payload: reply,
        });
      }
    } catch {
      // Ignore broadcast errors
    }

    try {
      const channel = supabaseRef.current.channel("campus_global_realtime");
      channel.send({
        type: "broadcast",
        event: "ticket_reply",
        payload: reply,
      });
    } catch {
      // Ignore fallback
    }
  }, [handleIncomingTicketReply]);

  // Set up BroadcastChannel & Supabase Realtime Channel
  useEffect(() => {
    // 1. Browser Cross-Tab Broadcast Channel
    let bc: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        bc = new BroadcastChannel(BROADCAST_BUS_NAME);
        broadcastChannelRef.current = bc;

        bc.onmessage = (event) => {
          const { type, payload } = event.data || {};
          if (type === "EMERGENCY_BROADCAST" && payload) {
            handleIncomingBroadcast(payload, false);
          } else if (type === "TICKET_REPLY" && payload) {
            handleIncomingTicketReply(payload, false);
          }
        };
      } catch {
        // Fallback gracefully
      }
    }

    // 2. Window CustomEvent listener for single-page interactions
    const handleLocalEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { type, payload } = customEvent.detail || {};
      if (type === "EMERGENCY_BROADCAST" && payload) {
        handleIncomingBroadcast(payload, false);
      } else if (type === "TICKET_REPLY" && payload) {
        handleIncomingTicketReply(payload, false);
      }
    };
    window.addEventListener("campus_local_realtime", handleLocalEvent);

    // 3. Supabase Realtime WebSocket Channel
    const supabase = supabaseRef.current;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    try {
      channel = supabase
        .channel("campus_global_realtime")
        .on("broadcast", { event: "emergency_broadcast" }, (payload) => {
          if (payload?.payload) {
            handleIncomingBroadcast(payload.payload as CampusBroadcast, false);
          }
        })
        .on("broadcast", { event: "ticket_reply" }, (payload) => {
          if (payload?.payload) {
            handleIncomingTicketReply(payload.payload as HelpRequestReplyRow, false);
          }
        })
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "help_request_replies" },
          (payload) => {
            if (payload?.new) {
              handleIncomingTicketReply(payload.new as HelpRequestReplyRow, false);
            }
          }
        )
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "notices" },
          (payload) => {
            if (payload?.new) {
              const notice = payload.new as { title?: string; content?: string; priority?: string; id?: string };
              playChime("alert");
              addToast({
                title: `📢 New Campus Notice (${notice.priority || "Normal"})`,
                message: notice.title || "An official announcement was published.",
                type: "notice",
                link: "/notices",
              });
            }
          }
        )
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            setConnectionState("connected");
          } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
            // If Supabase realtime fails (e.g., mock keys), we keep active fallback via BroadcastChannel
            setConnectionState("fallback");
          } else {
            setConnectionState("connecting");
          }
        });
    } catch {
      setConnectionState("fallback");
    }

    // Safety timeout: if connecting takes more than 2.5s, fall back gracefully
    const connectTimer = setTimeout(() => {
      setConnectionState((curr) => (curr === "connecting" ? "fallback" : curr));
    }, 2500);

    return () => {
      clearTimeout(connectTimer);
      window.removeEventListener("campus_local_realtime", handleLocalEvent);
      if (bc) bc.close();
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [handleIncomingBroadcast, handleIncomingTicketReply, addToast]);

  return (
    <RealtimeContext.Provider
      value={{
        connectionState,
        broadcasts,
        toasts,
        soundEnabled,
        activeTicketReplies,
        toggleSound,
        dismissBroadcast,
        dismissToast,
        dispatchBroadcast,
        dispatchTicketReply,
        addToast,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtime(): RealtimeContextType {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error("useRealtime must be used within a RealtimeProvider");
  }
  return context;
}
