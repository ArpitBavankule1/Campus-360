"use client";

/**
 * CampusLens AI — Phase 17
 * FacultyQrGenerator: Faculty-facing component to generate a time-limited
 * QR code for a lecture session. Embedded in the Faculty Teaching Hub.
 */

import { useState, useEffect, useCallback } from "react";
import { QrCodeDisplay } from "@/components/attendance/qr-code-display";
import {
  generateLectureToken,
  encodeSessionPayload,
} from "@/lib/attendance/qr-generator";
import {
  QrCode,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Wifi,
  Copy,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "cn";

interface FacultyQrGeneratorProps {
  courseCode: string;
  courseName: string;
  roomNumber: string;
  facultyId?: string;
  validMinutes?: number;
}

interface SessionState {
  encodedToken: string;
  sessionId: string;
  expiresAt: number;
  issuedAt: number;
}

export function FacultyQrGenerator({
  courseCode,
  courseName,
  roomNumber,
  facultyId = "faculty-demo",
  validMinutes = 15,
}: FacultyQrGeneratorProps) {
  const [session, setSession] = useState<SessionState | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [copied, setCopied] = useState(false);

  const generateSession = useCallback(async () => {
    setIsGenerating(true);
    // Small artificial delay to feel responsive
    await new Promise((r) => setTimeout(r, 400));

    const token = generateLectureToken({
      courseCode,
      roomNumber,
      facultyId,
      validMinutes,
    });
    const encoded = encodeSessionPayload(token);

    setSession({
      encodedToken: encoded,
      sessionId: token.sessionId,
      expiresAt: token.expiresAt,
      issuedAt: token.issuedAt,
    });
    setSecondsLeft(validMinutes * 60);
    setIsGenerating(false);
  }, [courseCode, roomNumber, facultyId, validMinutes]);

  // Countdown timer
  useEffect(() => {
    if (!session) return;
    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor((session.expiresAt - Date.now()) / 1000)
      );
      setSecondsLeft(remaining);
      if (remaining === 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [session]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const isExpired = session && secondsLeft === 0;
  const totalSecs = validMinutes * 60;
  const progressPct = session ? (secondsLeft / totalSecs) * 100 : 0;

  const handleCopy = () => {
    if (session) {
      navigator.clipboard.writeText(session.encodedToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm flex items-center gap-2">
            <QrCode className="w-4 h-4 text-primary" />
            QR Attendance Session
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {courseName} · {roomNumber}
          </p>
        </div>
        {session && !isExpired && (
          <Badge
            variant="outline"
            className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30 flex items-center gap-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </Badge>
        )}
      </div>

      {/* QR Code Panel */}
      {!session ? (
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="w-44 h-44 rounded-2xl border-2 border-dashed border-primary/20 flex flex-col items-center justify-center bg-muted/30 text-muted-foreground gap-2">
            <QrCode className="w-10 h-10 opacity-30" />
            <p className="text-[11px] text-center px-4">
              Generate a session QR for students to scan
            </p>
          </div>
          <Button
            onClick={generateSession}
            disabled={isGenerating}
            className="rounded-xl text-xs font-bold shadow-xs"
          >
            {isGenerating ? (
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            ) : (
              <QrCode className="w-3.5 h-3.5 mr-1.5" />
            )}
            {isGenerating ? "Generating…" : "Generate Session QR"}
          </Button>
        </div>
      ) : isExpired ? (
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="w-44 h-44 rounded-2xl border-2 border-dashed border-rose-500/30 flex flex-col items-center justify-center bg-rose-500/5 text-rose-500 gap-2">
            <AlertTriangle className="w-10 h-10 opacity-50" />
            <p className="text-[11px] text-center px-4 text-muted-foreground">
              Session expired. Generate a new QR code.
            </p>
          </div>
          <Button
            onClick={generateSession}
            variant="outline"
            disabled={isGenerating}
            className="rounded-xl text-xs font-bold border-rose-500/30 hover:border-rose-500/60"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Regenerate Session
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          {/* QR Code */}
          <div className="relative">
            <QrCodeDisplay value={session.encodedToken} size={200} />
            {/* Animated scan line */}
            <div className="absolute inset-3 overflow-hidden rounded-xl pointer-events-none">
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60 animate-[scan_2s_linear_infinite]" />
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="w-full space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                <Clock className="w-3.5 h-3.5" />
                Session expires in
              </span>
              <span
                className={cn(
                  "font-mono font-bold text-sm",
                  secondsLeft < 60 ? "text-rose-500" : secondsLeft < 180 ? "text-amber-500" : "text-emerald-600"
                )}
              >
                {formatTime(secondsLeft)}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-1000",
                  secondsLeft < 60
                    ? "bg-rose-500"
                    : secondsLeft < 180
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                )}
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="flex-1 rounded-xl text-xs"
            >
              {copied ? (
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5 mr-1.5" />
              )}
              {copied ? "Copied!" : "Copy Token"}
            </Button>
            <Button
              size="sm"
              onClick={generateSession}
              disabled={isGenerating}
              variant="outline"
              className="flex-1 rounded-xl text-xs"
            >
              <RefreshCw className={cn("w-3.5 h-3.5 mr-1.5", isGenerating && "animate-spin")} />
              Refresh QR
            </Button>
          </div>

          {/* Session ID hint */}
          <div className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/50">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <Wifi className="w-3 h-3" />
              <span className="font-mono truncate">{session.sessionId}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
