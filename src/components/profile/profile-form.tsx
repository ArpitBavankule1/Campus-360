"use client";

import { useState } from "react";
import { useAuth } from "@/components/layout/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  User,
  GraduationCap,
  School,
  IdCard,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  QrCode,
  ShieldCheck,
  Save,
} from "lucide-react";
import { updateUserProfile } from "@/lib/supabase/queries";

export function ProfileForm() {
  const { user, profile, role } = useAuth();

  const [fullName, setFullName] = useState(
    profile?.full_name || user?.user_metadata?.full_name || ""
  );
  const [studentId, setStudentId] = useState(
    profile?.student_id || user?.user_metadata?.student_id || ""
  );
  const [year, setYear] = useState<number>(
    profile?.year || user?.user_metadata?.year ? Number(profile?.year || user?.user_metadata?.year) : 2
  );
  const [division, setDivision] = useState(
    profile?.division || user?.user_metadata?.division || "A"
  );

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    if (!fullName.trim()) {
      setErrorMessage("Full name is required.");
      setIsLoading(false);
      return;
    }

    if (user?.id) {
      const res = await updateUserProfile(user.id, {
        full_name: fullName.trim(),
        student_id: studentId.trim() || null,
        year: Number(year),
        division: division.trim().toUpperCase() || null,
      });

      if (!res.success) {
        setErrorMessage(res.error || "Failed to update profile.");
        setIsLoading(false);
        return;
      }
    }

    setSuccessMessage("Your profile information has been saved successfully!");
    setIsLoading(false);
  };

  const initialLetter = fullName.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || "S";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Digital Institutional ID Card Preview */}
      <div className="lg:col-span-5 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <IdCard className="h-4 w-4 text-primary" />
          <span>Digital Student Credential</span>
        </h3>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card via-card/95 to-primary/10 border-2 border-primary/30 p-6 shadow-xl space-y-6">
          {/* Hologram top strip */}
          <div className="flex items-center justify-between pb-4 border-b border-border/70">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-xs">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-tight block text-foreground">
                  APEX INSTITUTE OF TECH
                </span>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                  Campus Digital Pass • 2026-27
                </span>
              </div>
            </div>

            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" title="Active Credential" />
          </div>

          {/* Student Info & Photo */}
          <div className="flex items-start gap-4">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-primary to-primary/80 text-primary-foreground flex items-center justify-center font-extrabold text-2xl shadow-md shrink-0 border-2 border-background">
              {initialLetter}
            </div>

            <div className="space-y-1 min-w-0">
              <Badge variant="secondary" className="text-[10px] px-2 py-0.5 capitalize mb-1 bg-primary/15 text-primary border-primary/20">
                <GraduationCap className="h-3 w-3 mr-1" />
                {role || "Student"}
              </Badge>
              <h4 className="text-base font-bold text-foreground truncate">
                {fullName || "Student Name"}
              </h4>
              <p className="text-xs text-muted-foreground font-mono">
                {studentId ? `Roll: ${studentId}` : "ID: AIT-CSE-2024-042"}
              </p>
              <p className="text-xs font-medium text-foreground/80 truncate">
                Computer Science & Engineering
              </p>
            </div>
          </div>

          {/* Grid details */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-border/60">
            <div className="p-2 rounded-xl bg-muted/40">
              <span className="text-[10px] text-muted-foreground block">Academic Year</span>
              <span className="font-bold text-foreground">Year {year}</span>
            </div>
            <div className="p-2 rounded-xl bg-muted/40">
              <span className="text-[10px] text-muted-foreground block">Division</span>
              <span className="font-bold text-foreground">Div {division || "A"}</span>
            </div>
          </div>

          {/* Bottom Barcode Mock */}
          <div className="pt-2 border-t border-border/60 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[9px] text-muted-foreground block uppercase font-mono">
                Cryptographic ID Signature
              </span>
              <div className="flex gap-1 h-5 items-center">
                <div className="w-1 bg-foreground/70 h-full" />
                <div className="w-2 bg-foreground/70 h-full" />
                <div className="w-0.5 bg-foreground/70 h-full" />
                <div className="w-1.5 bg-foreground/70 h-full" />
                <div className="w-1 bg-foreground/70 h-full" />
                <div className="w-3 bg-foreground/70 h-full" />
                <div className="w-0.5 bg-foreground/70 h-full" />
                <div className="w-2 bg-foreground/70 h-full" />
                <div className="w-1.5 bg-foreground/70 h-full" />
              </div>
            </div>

            <div className="p-1.5 rounded-lg bg-background border shadow-2xs">
              <QrCode className="h-6 w-6 text-foreground" />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-muted/30 border border-border/70 text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Institutional Verification
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Your digital credential is cryptographically tied to Apex Institute's enrollment registry. It grants access to smart gates, library loans, and examination centers.
          </p>
        </div>
      </div>

      {/* Edit Form */}
      <div className="lg:col-span-7 space-y-6">
        <div className="rounded-3xl bg-card border border-border/70 p-6 md:p-8 shadow-xs">
          <div className="mb-6 pb-4 border-b border-border/60">
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Student Profile Details
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Update your personal records and academic identifiers
            </p>
          </div>

          {successMessage && (
            <div className="mb-5 flex items-center gap-2 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold animate-in fade-in-0 duration-200">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-5 flex items-center gap-2 p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold animate-in fade-in-0 duration-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-xs font-semibold">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Arpit Bavankule"
                required
                className="h-10 rounded-xl bg-muted/30 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="studentId" className="text-xs font-semibold">
                  Student ID / Roll Number
                </Label>
                <Input
                  id="studentId"
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. 24CSE042"
                  className="h-10 rounded-xl bg-muted/30 text-sm font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold">
                  Registered Institutional Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="h-10 rounded-xl bg-muted/50 text-sm opacity-70 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="year" className="text-xs font-semibold">
                  Academic Year
                </Label>
                <select
                  id="year"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-xl bg-muted/30 border border-border/80 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                >
                  <option value={1}>1st Year (Freshman)</option>
                  <option value={2}>2nd Year (Sophomore)</option>
                  <option value={3}>3rd Year (Junior)</option>
                  <option value={4}>4th Year (Senior / Final)</option>
                  <option value={5}>5th Year (Dual Degree / Masters)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="division" className="text-xs font-semibold">
                  Class Division / Section
                </Label>
                <Input
                  id="division"
                  type="text"
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  placeholder="e.g. A"
                  maxLength={4}
                  className="h-10 rounded-xl bg-muted/30 text-sm uppercase"
                />
              </div>
            </div>

            <div className="pt-2">
              <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/60 text-xs space-y-1 mb-5">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <School className="h-4 w-4 text-primary" />
                  Institutional Enrollment Information
                </span>
                <p className="text-muted-foreground">
                  Department: <strong className="text-foreground">Computer Science & Engineering</strong>
                </p>
                <p className="text-muted-foreground">
                  Affiliated College: <strong className="text-foreground">Demo Apex Institute of Technology (AIT)</strong>
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto h-10 px-6 rounded-xl font-bold text-xs shadow-sm flex items-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
