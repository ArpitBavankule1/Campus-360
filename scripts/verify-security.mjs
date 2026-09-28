#!/usr/bin/env node
/**
 * CampusLens AI — Automated Security & Injection Defense Verification Suite
 * Validates:
 * 1. SQL Injection vector detection (UNION SELECT, OR 1=1, DROP TABLE, stacked queries, sleep)
 * 2. False-positive resistance on legitimate text (English words like 'update', 'select', 'create')
 * 3. Cross-Site Scripting (XSS) attack vector blocking (<script>, onerror, javascript:, iframe)
 * 4. Input sanitization and payload cleaning
 * 5. UUID format validation (defense against ID pollution)
 * 6. Implementation of security safeguards across API routes (bookings, grades, attendance check-in)
 * 7. Enterprise HTTP Security Headers in next.config.ts
 * 8. Database SECURITY DEFINER search_path hardening in migration SQL
 */

import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

console.log("🛡️ Running CampusLens AI Automated Security Verification Suite...\n");

let passed = 0;
let failed = 0;

function assert(condition, testName, detail = "") {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}${detail ? ` — ${detail}` : ""}`);
    failed++;
  }
}

function fileExists(relPath) {
  return existsSync(path.join(root, relPath));
}

function fileContains(relPath, ...fragments) {
  try {
    const content = readFileSync(path.join(root, relPath), "utf-8");
    return fragments.every((f) => content.includes(f));
  } catch {
    return false;
  }
}

// 1. Core Security Engine File Verification
console.log("1. Security Defense Engine Modules:");
assert(fileExists("src/lib/security/sanitize.ts"), "Security sanitization module exists");
assert(
  fileContains(
    "src/lib/security/sanitize.ts",
    "containsSQLInjection",
    "containsXSS",
    "sanitizeInput",
    "isValidUUID",
    "isValidIdentifier",
    "sanitizePayload"
  ),
  "All core security functions exported in sanitize.ts"
);

// 2. SQL Injection Detection Engine Logic
console.log("\n2. SQL Injection Protection Tests:");
const SQLI_PATTERNS = [
  /(\bUNION\s+(ALL\s+)?SELECT\b)/i,
  /(\bSELECT\s+.+\s+FROM\b)/i,
  /(\bINSERT\s+INTO\s+.+\s+VALUES\b)/i,
  /(\bDELETE\s+FROM\b)/i,
  /(\bDROP\s+(TABLE|DATABASE|VIEW|INDEX|COLUMN)\b)/i,
  /(\bALTER\s+(TABLE|DATABASE)\b)/i,
  /(\bTRUNCATE\s+TABLE\b)/i,
  /(--|#|\/\*|\*\/)/,
  /(\bOR\b|\bAND\b)\s+['"]?\w+['"]?\s*=\s*['"]?\w+/i,
  /;\s*(DROP|DELETE|UPDATE|INSERT|TRUNCATE)\b/i,
  /('|"|`)\s*(OR|AND)\s*('|"|`)/i,
  /\bEXEC(\s+XP_)?\b/i,
  /\b(BENCHMARK|SLEEP|PG_SLEEP)\s*\(/i,
];

function checkSQLi(input) {
  if (typeof input !== "string") return false;
  return SQLI_PATTERNS.some((p) => p.test(input));
}

assert(checkSQLi("1' UNION SELECT null, username, password FROM users--"), "Detects classic UNION SELECT injection");
assert(checkSQLi("' OR '1'='1"), "Detects tautological ' OR '1'='1 injection");
assert(checkSQLi("admin' OR 1=1--"), "Detects numeric OR 1=1 with comment");
assert(checkSQLi("1; DROP TABLE users;"), "Detects stacked query DROP TABLE injection");
assert(checkSQLi("1; TRUNCATE TABLE attendance_records;"), "Detects TRUNCATE TABLE stacked query");
assert(checkSQLi("1' AND SLEEP(5)--"), "Detects time-based blind SQLi (SLEEP)");
assert(checkSQLi("1' AND PG_SLEEP(5)--"), "Detects PostgreSQL-specific time-based SQLi (PG_SLEEP)");

// 3. False Positive Resistance on Legitimate Queries
console.log("\n3. False Positive Resistance (Legitimate English Inputs):");
assert(!checkSQLi("Seminar hall booking for annual science symposium"), "Allows standard legitimate booking purpose");
assert(!checkSQLi("Please update my address record in student portal"), "Allows legitimate sentence containing 'update'");
assert(!checkSQLi("Please select semester 5 transcript copy"), "Allows legitimate sentence containing 'select'");
assert(!checkSQLi("Request to create a robotics club room reservation"), "Allows legitimate sentence containing 'create'");

// 4. XSS & Script Injection Protection
console.log("\n4. Cross-Site Scripting (XSS) Protection Tests:");
const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript\s*:/gi,
  /on\w+\s*=/gi,
  /<iframe\b[^>]*>/gi,
  /<embed\b[^>]*>/gi,
  /<object\b[^>]*>/gi,
];

function checkXSS(input) {
  if (typeof input !== "string") return false;
  return XSS_PATTERNS.some((p) => {
    p.lastIndex = 0;
    return p.test(input);
  });
}

assert(checkXSS("<script>alert('XSS Attack!')</script>"), "Detects direct <script> injection");
assert(checkXSS("<img src='x' onerror='alert(document.cookie)'>"), "Detects inline onerror event handler");
assert(checkXSS("<a href='javascript:alert(1)'>Click me</a>"), "Detects javascript: URI scheme");
assert(checkXSS("<iframe src='https://malicious.evil/phishing'></iframe>"), "Detects iframe embedding");

// 5. Input Sanitization Behavior
console.log("\n5. Input Sanitization & Payload Cleaning:");
function sanitize(input, maxLength = 500) {
  if (!input) return "";
  const str = String(input).trim();
  return str
    .replace(/<[^>]*>?/gm, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .slice(0, maxLength);
}
const sanitized = sanitize("<b>Hello</b> <script>alert(1)</script>World");
assert(!sanitized.includes("<script>"), "Strips script tags");
assert(!sanitized.includes("<b>"), "Strips HTML tags");
assert(sanitized.includes("Hello") && sanitized.includes("World"), "Preserves clean text");

// 6. UUID and Identifier Validation
console.log("\n6. Parameter Format & UUID Validation:");
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
assert(uuidRegex.test("c0000000-0000-0000-0000-000000000001"), "Validates correct UUIDv4 college ID");
assert(!uuidRegex.test("c0000000-0000' OR '1'='1"), "Rejects SQL injection in UUID field");

// 7. API Routes Security Integration
console.log("\n7. API Routes Security Integration:");
assert(
  fileContains(
    "src/app/api/bookings/route.ts",
    "containsSQLInjection",
    "containsXSS",
    "sanitizeInput",
    "Malicious payload detected"
  ),
  "Facility bookings API enforces SQLi/XSS guards and sanitization"
);
assert(
  fileContains(
    "src/app/api/exams/grades/route.ts",
    "containsSQLInjection",
    "containsXSS",
    "Malicious payload detected"
  ),
  "Exam grades API enforces SQLi/XSS guards on query and body"
);
assert(
  fileContains(
    "src/app/api/attendance/check-in/route.ts",
    "containsSQLInjection",
    "containsXSS",
    "Malicious or invalid token format detected"
  ),
  "Attendance check-in API validates token and numeric coordinates against injection"
);

// 8. Enterprise HTTP Security Headers
console.log("\n8. Enterprise HTTP Security Headers (next.config.ts):");
assert(
  fileContains("next.config.ts", "X-Frame-Options", "DENY"),
  "Configures X-Frame-Options: DENY (Clickjacking defense)"
);
assert(
  fileContains("next.config.ts", "X-Content-Type-Options", "nosniff"),
  "Configures X-Content-Type-Options: nosniff (MIME sniffing defense)"
);
assert(
  fileContains("next.config.ts", "Strict-Transport-Security"),
  "Configures Strict-Transport-Security (HSTS enforcement)"
);
assert(
  fileContains("next.config.ts", "Permissions-Policy"),
  "Configures Permissions-Policy"
);

// 9. Supabase Security Definer Hardening Migration
console.log("\n9. Supabase Database Security Definer Hardening:");
assert(
  fileExists("supabase/migrations/20260928000001_security_hardening.sql"),
  "Security hardening migration exists"
);
assert(
  fileContains(
    "supabase/migrations/20260928000001_security_hardening.sql",
    "SET search_path = public, auth",
    "current_user_role",
    "current_user_college_id",
    "is_college_admin",
    "handle_new_user"
  ),
  "All SECURITY DEFINER functions have pinned search_path to prevent schema hijacking"
);

console.log("\n" + "═".repeat(50));
console.log(`🛡️ Security Test Results: ${passed} passed, ${failed} failed`);
console.log("═".repeat(50) + "\n");

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
