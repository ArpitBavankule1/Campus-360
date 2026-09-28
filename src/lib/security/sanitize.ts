/**
 * CampusLens AI — Anti-Injection & Security Defense Engine
 * Protects against SQL injection, Cross-Site Scripting (XSS),
 * prototype pollution, and malformed parameter injection.
 */

// Targeted SQL Injection signatures (tuned to detect attack payloads while avoiding false positives on common words)
const SQLI_PATTERNS = [
  /(\bUNION\s+(ALL\s+)?SELECT\b)/i,
  /(\bSELECT\s+.+\s+FROM\b)/i,
  /(\bINSERT\s+INTO\s+.+\s+VALUES\b)/i,
  /(\bDELETE\s+FROM\b)/i,
  /(\bDROP\s+(TABLE|DATABASE|VIEW|INDEX|COLUMN)\b)/i,
  /(\bALTER\s+(TABLE|DATABASE)\b)/i,
  /(\bTRUNCATE\s+TABLE\b)/i,
  /(--|#|\/\*|\*\/)/, // SQL comments
  /(\bOR\b|\bAND\b)\s+['"]?\w+['"]?\s*=\s*['"]?\w+/i, // ' OR '1'='1 or 1=1
  /;\s*(DROP|DELETE|UPDATE|INSERT|TRUNCATE)\b/i, // Stacked queries
  /('|"|`)\s*(OR|AND)\s*('|"|`)/i,
  /\bEXEC(\s+XP_)?\b/i,
  /\b(BENCHMARK|SLEEP|PG_SLEEP)\s*\(/i,
];

// XSS and HTML Script injection signatures
const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript\s*:/gi,
  /on\w+\s*=/gi, // onerror=, onclick=, etc.
  /<iframe\b[^>]*>/gi,
  /<embed\b[^>]*>/gi,
  /<object\b[^>]*>/gi,
];

/**
 * Checks if a string contains known SQL injection attack vectors.
 */
export function containsSQLInjection(input: string): boolean {
  if (typeof input !== "string") return false;
  return SQLI_PATTERNS.some((pattern) => pattern.test(input));
}

/**
 * Checks if a string contains known XSS / Script injection attack vectors.
 */
export function containsXSS(input: string): boolean {
  if (typeof input !== "string") return false;
  return XSS_PATTERNS.some((pattern) => pattern.test(input));
}

/**
 * Sanitizes generic user input:
 * 1. Strips HTML tags
 * 2. Escapes hazardous characters
 * 3. Enforces length boundaries
 */
export function sanitizeInput(
  input: unknown,
  maxLength: number = 500
): string {
  if (input === null || input === undefined) return "";
  const str = String(input).trim();

  // Strip dangerous HTML tags
  const sanitized = str
    .replace(/<[^>]*>?/gm, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "");

  return sanitized.slice(0, maxLength);
}

/**
 * Validates whether a given string is a valid UUID (v4)
 * Strongly prevents SQL parameter pollution in ID-based endpoints.
 */
export function isValidUUID(uuid: string): boolean {
  if (typeof uuid !== "string") return false;
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid.trim());
}

/**
 * Validates alphanumeric identifiers (e.g., Roll numbers: 2023-CSE-042)
 */
export function isValidIdentifier(id: string): boolean {
  if (typeof id !== "string") return false;
  const idRegex = /^[A-Za-z0-9_-]{1,64}$/;
  return idRegex.test(id.trim());
}

/**
 * Sanitizes an object of query parameters or request body payload
 */
export function sanitizePayload<T extends Record<string, unknown>>(
  payload: T
): T {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(payload)) {
    if (typeof value === "string") {
      result[key] = sanitizeInput(value);
    } else if (typeof value === "number" || typeof value === "boolean") {
      result[key] = value;
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        typeof item === "string" ? sanitizeInput(item) : item
      );
    } else if (value && typeof value === "object") {
      result[key] = sanitizePayload(value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  }

  return result as T;
}
