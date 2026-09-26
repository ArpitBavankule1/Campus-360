"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell, CheckCheck, Clock, Calendar, BookOpen, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_NOTIFICATIONS, type NotificationRow } from "@/lib/supabase/queries";
import { useRealtime } from "@/lib/realtime/realtime-provider";
import { cn } from "cn";

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationRow[]>(MOCK_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { toasts } = useRealtime();

  // Dynamically append new real-time toasts to notification ledger
  useEffect(() => {
    if (toasts.length === 0) return;
    const latestToast = toasts[0];

    setNotifications((prev) => {
      if (prev.some((n) => n.id === latestToast.id)) return prev;

      const newNotif: NotificationRow = {
        id: latestToast.id,
        user_id: "current-user",
        college_id: "11111111-1111-4111-8111-111111111111",
        title: latestToast.title,
        message: latestToast.message,
        type: latestToast.type === "reply" ? "query" : latestToast.type === "broadcast" ? "notice" : "announcement",
        link: latestToast.link || null,
        is_read: false,
        created_at: latestToast.timestamp,
      };

      return [newNotif, ...prev];
    });
  }, [toasts]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "notice":
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case "event":
        return <Calendar className="h-4 w-4 text-indigo-500" />;
      case "timetable":
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-full h-9 w-9 hover:bg-muted"
        aria-label="Campus notifications"
      >
        <Bell className="h-4 w-4 text-foreground/80" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border bg-card/95 backdrop-blur-md shadow-xl z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs h-5 px-1.5 font-normal">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-primary hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-border/50">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No notifications right now
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={cn(
                    "p-3.5 flex items-start gap-3 transition-colors hover:bg-muted/40 cursor-pointer text-left",
                    !n.is_read ? "bg-primary/5" : "bg-transparent"
                  )}
                >
                  <div className="mt-0.5 p-1.5 rounded-lg bg-background border shadow-2xs shrink-0">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {n.title}
                      </p>
                      {!n.is_read && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>
                    {n.link && (
                      <Link
                        href={n.link}
                        onClick={() => setIsOpen(false)}
                        className="text-xs text-primary font-medium hover:underline inline-block mt-1.5"
                      >
                        View Details →
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2 border-t bg-muted/20 flex items-center justify-between text-xs px-3">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-primary hover:underline font-semibold block py-1"
            >
              Open Alerts Center →
            </Link>
            <Link
              href="/notices"
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground font-medium block py-1"
            >
              Notices
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
