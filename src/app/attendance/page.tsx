"use client";

/**
 * CampusLens AI — Phase 17
 * /attendance — Student QR Lecture Check-In Portal
 *
 * Students can:
 * 1. Paste / enter a QR token from the faculty's projected screen
 * 2. Check in (with optional geolocation)
 * 3. View their per-subject attendance history
 */

import { useState, useCallback } from "react";
import { PortalLayout } from "@/components/layout/portal-layout";
import { StudentAttendanceHistory } from "@/components/attendance/student-attendance-history";
import { useAuth } from "@/components/layout/auth-provider";
import {
  generateLectureToken,
  encodeSessionPayload,
  decodeSessionPayload,
} from "@/lib/attendance/qr-generator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "cn";
import {
  QrCode,
  ScanLine,
  CheckCircle2,
  XCircle,
  MapPin,
  Loader2,
  BookOpen,
  ChevronRight,
  AlertTriangle,
  Zap,
  Clock,
  Shield,
} from "lucide-react";

type CheckInStatus = "idle" | "validating" | "success" | "error" | "expired";

interface CheckInResult {
  status: CheckInStatus;
  message?: string;
  courseCode?: string;
  roomNumber?: string;
  checkedInAt?: string;
}

const DEMO_QUICK_TOKENS = [
  { label: "CS-501 · A-301", courseCode: "CS-501", room: "A-301" },
  { label: "CS-508 · B-108", courseCode: "CS-508", room: "B-108" },
  { label: "HS-101 · C-202", courseCode: "HS-101", room: "C-202" },
];

export default function AttendancePage() {
  const { profile } = useAuth();
  const [qrInput, setQrInput] = useState("");
  const [result, setResult] = useState<CheckInResult>({ status: "idle" });
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [activeTab, setActiveTab] = useState<"checkin" | "history">("checkin");

  // Preview decoded token
  const previewToken = qrInput.trim()
    ? decodeSessionPayload(qrInput.trim())
    : null;
  const isPreviewExpired = previewToken ? Date.now() > previewToken.expiresAt : false;

  const requestLocation = useCallback(async () => {
    setLocationLoading(true);
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, { timeout: 8000 })
      );
      setCoords({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
      setLocationEnabled(true);
    } catch {
      setLocationEnabled(false);
    } finally {
      setLocationLoading(false);
    }
  }, []);

  const handleCheckIn = async () => {
    const token = qrInput.trim();
    if (!token) return;

    setResult({ status: "validating" });

    try {
      const res = await fetch("/api/attendance/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          qrToken: token,
          latitude: coords?.latitude,
          longitude: coords?.longitude,
        }),
      });

      const data = await res.json();

      if (res.status === 410) {
        setResult({ status: "expired", message: data.reason });
        return;
      }

      if (data.success) {
        setResult({
          status: "success",
          message: data.message,
          checkedInAt: data.checkedInAt,
          courseCode: previewToken?.courseCode,
          roomNumber: previewToken?.roomNumber,
        });
        setQrInput("");
      } else {
        setResult({ status: "error", message: data.reason || "Check-in failed." });
      }
    } catch {
      setResult({ status: "error", message: "Network error. Please try again." });
    }
  };

  const handleDemoToken = (courseCode: string, room: string) => {
    const token = generateLectureToken({
      courseCode,
      roomNumber: room,
      facultyId: "demo-faculty",
      validMinutes: 30,
    });
    setQrInput(encodeSessionPayload(token));
    setResult({ status: "idle" });
  };

  return (
    <PortalLayout>
      <div className="space-y-6 pb-12 max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/70">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <ScanLine className="h-7 w-7 text-primary" />
              Lecture Check-In
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Scan your professor&#39;s QR code to mark your attendance for the current lecture
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <Badge
              variant="outline"
              className={cn(
                "text-xs flex items-center gap-1.5",
                locationEnabled
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <MapPin className="w-3 h-3" />
              {locationEnabled ? "Geofence Active" : "No Location"}
            </Badge>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-card border rounded-2xl shadow-xs w-fit">
          <button
            onClick={() => setActiveTab("checkin")}
            className={cn(
              "px-4 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5",
              activeTab === "checkin"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <QrCode className="w-3.5 h-3.5" />
            Check In
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={cn(
              "px-4 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5",
              activeTab === "history"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Attendance History
          </button>
        </div>

        {/* ---- CHECK-IN TAB ---- */}
        {activeTab === "checkin" && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Main Check-In Card */}
            <div className="lg:col-span-3 space-y-4">
              <Card className="border shadow-xs">
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-primary" />
                    Enter Lecture QR Token
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Paste the token from your professor&#39;s projected QR code, or use a demo token below.
                  </p>
                </CardHeader>

                <CardContent className="p-4 space-y-4">
                  {/* Result Banner */}
                  {result.status === "success" && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">{result.message}</p>
                        {result.checkedInAt && (
                          <p className="text-[10px] opacity-80 mt-0.5">
                            Verified at {new Date(result.checkedInAt).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {(result.status === "error" || result.status === "expired") && (
                    <div
                      className={cn(
                        "p-3 rounded-xl border text-xs font-medium flex items-start gap-2 animate-in fade-in slide-in-from-top-2",
                        result.status === "expired"
                          ? "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300"
                          : "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-300"
                      )}
                    >
                      {result.status === "expired" ? (
                        <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      )}
                      <p>{result.message}</p>
                    </div>
                  )}

                  {/* Token Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground">
                      QR Token
                    </label>
                    <Input
                      id="qr-token-input"
                      placeholder="Paste QR token here (eyJ…) or use a demo below"
                      value={qrInput}
                      onChange={(e) => {
                        setQrInput(e.target.value);
                        setResult({ status: "idle" });
                      }}
                      className="font-mono text-xs rounded-xl h-11"
                    />

                    {/* Token Preview */}
                    {previewToken && (
                      <div
                        className={cn(
                          "p-2.5 rounded-xl border text-[10px] space-y-0.5",
                          isPreviewExpired
                            ? "border-rose-500/30 bg-rose-500/5"
                            : "border-primary/20 bg-primary/5"
                        )}
                      >
                        <div className="flex items-center gap-1.5 font-semibold">
                          {isPreviewExpired ? (
                            <AlertTriangle className="w-3 h-3 text-rose-500" />
                          ) : (
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          )}
                          <span>
                            {previewToken.courseCode} · Room {previewToken.roomNumber}
                          </span>
                          {isPreviewExpired && (
                            <Badge
                              variant="outline"
                              className="text-[9px] ml-1 bg-rose-500/10 text-rose-500 border-rose-500/30"
                            >
                              Expired
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground pl-4">
                          Expires:{" "}
                          {new Date(previewToken.expiresAt).toLocaleTimeString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Geolocation Toggle */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary shrink-0" />
                      <div>
                        <p className="text-xs font-semibold">Geofence Verification</p>
                        <p className="text-[10px] text-muted-foreground">
                          Confirm you&#39;re physically on campus
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={locationEnabled ? "outline" : "default"}
                      onClick={requestLocation}
                      disabled={locationLoading}
                      className="rounded-xl text-[11px] h-7 px-3"
                    >
                      {locationLoading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : locationEnabled ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <MapPin className="w-3 h-3" />
                      )}
                      <span className="ml-1">
                        {locationEnabled ? "Enabled" : "Enable"}
                      </span>
                    </Button>
                  </div>

                  {/* Check-In Button */}
                  <Button
                    id="checkin-submit-btn"
                    onClick={handleCheckIn}
                    disabled={
                      !qrInput.trim() ||
                      result.status === "validating" ||
                      isPreviewExpired
                    }
                    className="w-full rounded-xl font-bold shadow-xs h-11"
                    size="lg"
                  >
                    {result.status === "validating" ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Verifying…
                      </>
                    ) : (
                      <>
                        <ScanLine className="w-4 h-4 mr-2" />
                        Mark My Attendance
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Demo Quick Check-Ins */}
              <Card className="border shadow-xs">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-bold flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    Demo: Quick Load a Session Token
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-2">
                  {DEMO_QUICK_TOKENS.map((t) => (
                    <button
                      key={t.courseCode}
                      onClick={() => handleDemoToken(t.courseCode, t.room)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl border border-border/70 hover:border-primary/40 hover:bg-primary/5 transition-all text-left"
                    >
                      <div className="flex items-center gap-2">
                        <QrCode className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs font-semibold">{t.label}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  ))}
                  <p className="text-[10px] text-muted-foreground pt-1">
                    Loads a 30-minute valid demo token. In production, scan your faculty&#39;s QR code.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Right: Info & Security Panel */}
            <div className="lg:col-span-2 space-y-4">
              {/* Student Info Strip */}
              <Card className="border shadow-xs">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-extrabold text-primary text-lg">
                      {(profile?.full_name || "S").charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-foreground">
                        {profile?.full_name || "Student"}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {profile?.student_id || "ID N/A"} ·{" "}
                        {profile?.year ? `Year ${profile.year}` : ""} {profile?.division || ""}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* How It Works */}
              <Card className="border shadow-xs">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-bold flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-primary" />
                    How Check-In Works
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3 text-[11px] text-muted-foreground">
                  {[
                    {
                      step: "1",
                      icon: QrCode,
                      text: "Your professor generates a unique session QR for the current lecture.",
                    },
                    {
                      step: "2",
                      icon: ScanLine,
                      text: "Paste the token or scan the projected QR code with this portal.",
                    },
                    {
                      step: "3",
                      icon: MapPin,
                      text: "Optional geofence confirms you are physically present on campus.",
                    },
                    {
                      step: "4",
                      icon: CheckCircle2,
                      text: "Your attendance is recorded instantly in the academic registry.",
                    },
                  ].map(({ step, icon: Icon, text }) => (
                    <div key={step} className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-extrabold flex items-center justify-center">
                        {step}
                      </span>
                      <div className="flex items-start gap-1.5">
                        <Icon className="w-3 h-3 shrink-0 mt-0.5 text-primary" />
                        <span>{text}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Security Note */}
              <div className="p-3 rounded-xl bg-muted/30 border border-border/50 text-[10px] text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-primary" />
                  Anti-Proxy Protection
                </p>
                <p>
                  QR tokens expire after{" "}
                  <span className="font-semibold text-foreground">15 minutes</span>{" "}
                  and are cryptographically nonce-bound. Sharing tokens enables
                  detection and invalidation.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ---- HISTORY TAB ---- */}
        {activeTab === "history" && (
          <Card className="border shadow-xs">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                Subject-wise Attendance Record
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Academic Term 2026 · Department of Computer Science & Engineering
              </p>
            </CardHeader>
            <CardContent className="p-4">
              <StudentAttendanceHistory />
            </CardContent>
          </Card>
        )}
      </div>
    </PortalLayout>
  );
}
