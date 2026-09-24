"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  Clock,
  Calendar,
  AlertCircle,
  Info,
  ExternalLink,
  Trash2,
  Check,
  LifeBuoy,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { NotificationRow } from "@/lib/supabase/queries";
import { cn } from "cn";

interface NotificationsViewProps {
  initialNotifications: NotificationRow[];
}

export function NotificationsView({ initialNotifications }: NotificationsViewProps) {
  const [notifications, setNotifications] = useState<NotificationRow[]>(initialNotifications);
  const [activeTab, setActiveTab] = useState<string>("all");

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filterTabs = [
    { label: "All Alerts", value: "all", count: notifications.length },
    { label: "Unread", value: "unread", count: unreadCount },
    { label: "Notices", value: "notice", count: notifications.filter((n) => n.type === "notice").length },
    { label: "Events", value: "event", count: notifications.filter((n) => n.type === "event").length },
    { label: "Timetable", value: "timetable", count: notifications.filter((n) => n.type === "timetable").length },
    { label: "System", value: "system", count: notifications.filter((n) => n.type === "system").length },
  ];

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !n.is_read;
    return n.type === activeTab;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "notice":
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case "event":
        return <Calendar className="w-5 h-5 text-indigo-500" />;
      case "timetable":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "query":
        return <LifeBuoy className="w-5 h-5 text-purple-500" />;
      default:
        return <Info className="w-5 h-5 text-primary" />;
    }
  };

  const getRelativeTime = (isoString: string) => {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${Math.max(1, diffMins)}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top action toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border shadow-sm">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {filterTabs.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    "px-1.5 py-0.2 rounded-full text-[10px]",
                    isActive ? "bg-white/20 text-white" : "bg-muted-foreground/20 text-muted-foreground"
                  )}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Global Read action */}
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            className="rounded-xl text-xs h-9 shrink-0 gap-1.5 border-dashed"
          >
            <CheckCheck className="w-4 h-4 text-primary" />
            Mark all read ({unreadCount})
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed bg-card/40 flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground">
              <CheckCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="font-semibold text-foreground">You are all caught up!</h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              No notifications match your current filter. You will receive real-time alerts whenever college notices, timetable updates, or events are announced.
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const timeAgo = getRelativeTime(notif.created_at);

            return (
              <Card
                key={notif.id}
                className={cn(
                  "border transition-all duration-200 relative overflow-hidden group",
                  notif.is_read
                    ? "bg-card/70 border-border/60 opacity-80 hover:opacity-100"
                    : "bg-card border-primary/40 shadow-sm ring-1 ring-primary/10"
                )}
              >
                {!notif.is_read && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />
                )}

                <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5 flex-1 pl-1">
                    <div className="p-2.5 rounded-xl bg-muted/80 shrink-0 mt-0.5">
                      {getIcon(notif.type)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-foreground">
                          {notif.title}
                        </h4>
                        {!notif.is_read && (
                          <Badge variant="default" className="text-[10px] px-1.5 py-0 h-4">
                            New
                          </Badge>
                        )}
                        <span className="text-[11px] text-muted-foreground">
                          • {timeAgo}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {notif.link && (
                      <Link
                        href={notif.link}
                        onClick={() => markAsRead(notif.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold transition-colors"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}

                    {!notif.is_read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => markAsRead(notif.id)}
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4 text-emerald-500" />
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => dismissNotification(notif.id)}
                      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      title="Dismiss notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
