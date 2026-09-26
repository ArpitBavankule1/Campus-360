export type BroadcastSeverity = "critical" | "warning" | "info";

export interface CampusBroadcast {
  id: string;
  title: string;
  message: string;
  severity: BroadcastSeverity;
  source: string;
  timestamp: string;
  expiresAt?: string;
  actionLink?: string;
  actionText?: string;
  dismissible?: boolean;
}

export type RealtimeConnectionState = "connected" | "connecting" | "fallback" | "disconnected";

export interface LiveMessageEvent<T = unknown> {
  id: string;
  type: "ticket_reply" | "emergency_broadcast" | "notification" | "notice";
  payload: T;
  timestamp: string;
}
