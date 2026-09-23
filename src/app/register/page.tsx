"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { APP_NAME } from "@/lib/constants";

interface CollegeOption {
  id: string;
  name: string;
  code: string;
}

interface DepartmentOption {
  id: string;
  name: string;
  code: string;
  college_id: string;
}

const FALLBACK_COLLEGES: CollegeOption[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    name: "Apex Institute of Technology",
    code: "AIT",
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    name: "Metropolitan Engineering College",
    code: "MEC",
  },
];

const FALLBACK_DEPARTMENTS: DepartmentOption[] = [
  {
    id: "a1111111-1111-4111-8111-111111111111",
    name: "Computer Science & Engineering",
    code: "CSE",
    college_id: "11111111-1111-4111-8111-111111111111",
  },
  {
    id: "a2222222-2222-4222-8222-222222222222",
    name: "Information Technology",
    code: "IT",
    college_id: "11111111-1111-4111-8111-111111111111",
  },
  {
    id: "a3333333-3333-4333-8333-333333333333",
    name: "Electronics & Telecommunication",
    code: "ECE",
    college_id: "11111111-1111-4111-8111-111111111111",
  },
  {
    id: "a4444444-4444-4444-8444-444444444444",
    name: "Mechanical Engineering",
    code: "MECH",
    college_id: "11111111-1111-4111-8111-111111111111",
  },
  {
    id: "b1111111-1111-4111-8111-111111111111",
    name: "Computer Engineering",
    code: "COMP",
    college_id: "22222222-2222-4222-8222-222222222222",
  },
  {
    id: "b2222222-2222-4222-8222-222222222222",
    name: "Data Science & AI",
    code: "DSAI",
    college_id: "22222222-2222-4222-8222-222222222222",
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [colleges, setColleges] = useState<CollegeOption[]>(FALLBACK_COLLEGES);
  const [departments, setDepartments] = useState<DepartmentOption[]>(FALLBACK_DEPARTMENTS);

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [studentId, setStudentId] = useState("");
  const [collegeId, setCollegeId] = useState(FALLBACK_COLLEGES[0].id);
  const [departmentId, setDepartmentId] = useState(FALLBACK_DEPARTMENTS[0].id);
  const [year, setYear] = useState("1");
  const [division, setDivision] = useState("A");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch colleges from database on load
  useEffect(() => {
    async function loadCollegesAndDepartments() {
      try {
        const { data: cols } = await supabase
          .from("colleges")
          .select("id, name, code")
          .order("name");

        if (cols && cols.length > 0) {
          setColleges(cols);
          setCollegeId(cols[0].id);
        }

        const { data: depts } = await supabase
          .from("departments")
          .select("id, name, code, college_id")
          .order("name");

        if (depts && depts.length > 0) {
          setDepartments(depts);
        }
      } catch {
        // Fallback options remain active
      }
    }

    loadCollegesAndDepartments();
  }, []);

  // Filter departments for selected college
  const filteredDepartments = departments.filter((d) => d.college_id === collegeId);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            college_id: collegeId,
            department_id: departmentId || null,
            student_id: studentId.trim(),
            year: parseInt(year, 10),
            division: division.trim().toUpperCase(),
            role: "student",
          },
        },
      });

      if (error) {
        setErrorMessage(error.message || "Registration failed.");
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // If email confirmation is required by Supabase project settings
        if (data.user.identities && data.user.identities.length === 0) {
          setErrorMessage("An account with this email already exists. Try signing in.");
          setIsLoading(false);
          return;
        }

        if (data.session) {
          // Direct login success
          setSuccessMessage("Account created successfully! Redirecting to student dashboard...");
          setTimeout(() => {
            router.push("/dashboard");
            router.refresh();
          }, 1500);
        } else {
          // Email confirmation pending
          setSuccessMessage(
            "Account registered successfully! Please check your email inbox to confirm your account, then sign in."
          );
          setIsLoading(false);
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected registration error occurred.";
      setErrorMessage(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12">
      {/* Brand Header */}
      <Link href="/" className="mb-6 flex items-center gap-2.5 text-xl font-bold tracking-tight">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Sparkles className="h-5 w-5" />
        </div>
        <span>{APP_NAME}</span>
      </Link>

      <Card className="w-full max-w-lg shadow-xl border-border/60 backdrop-blur-xs">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            <GraduationCap className="h-5 w-5" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Student Registration</CardTitle>
          <CardDescription>
            Join your institutional network on {APP_NAME}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {errorMessage && (
            <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 p-3.5 text-sm text-destructive animate-in fade-in">
              <AlertCircle className="h-4.5 w-4.5 mt-0.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-sm text-emerald-700 animate-in fade-in">
              <CheckCircle2 className="h-4.5 w-4.5 mt-0.5 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Aarav Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {/* Email & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">College Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@demo-apex.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password (min 6 chars)</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* College Selection */}
            <div className="space-y-2">
              <Label htmlFor="college">College / University</Label>
              <select
                id="college"
                value={collegeId}
                onChange={(e) => {
                  setCollegeId(e.target.value);
                  const firstDept = departments.find((d) => d.college_id === e.target.value);
                  if (firstDept) setDepartmentId(firstDept.id);
                }}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading}
              >
                {colleges.map((c) => (
                  <option key={c.id} value={c.id} className="bg-popover text-popover-foreground">
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Department & Student ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <select
                  id="department"
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isLoading}
                >
                  {filteredDepartments.map((d) => (
                    <option key={d.id} value={d.id} className="bg-popover text-popover-foreground">
                      {d.name} ({d.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID / Roll No.</Label>
                <Input
                  id="studentId"
                  type="text"
                  placeholder="e.g. 2024-CSE-042"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Year & Division */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Academic Year</Label>
                <select
                  id="year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isLoading}
                >
                  <option value="1" className="bg-popover text-popover-foreground">1st Year</option>
                  <option value="2" className="bg-popover text-popover-foreground">2nd Year</option>
                  <option value="3" className="bg-popover text-popover-foreground">3rd Year</option>
                  <option value="4" className="bg-popover text-popover-foreground">4th Year</option>
                  <option value="5" className="bg-popover text-popover-foreground">5th Year</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="division">Division / Section</Label>
                <Input
                  id="division"
                  type="text"
                  placeholder="A"
                  maxLength={4}
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button type="submit" className="w-full font-medium" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Student Account...
                </>
              ) : (
                "Create Student Account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already registered?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>

      <p className="mt-8 text-xs text-muted-foreground">
        © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </p>
    </div>
  );
}
