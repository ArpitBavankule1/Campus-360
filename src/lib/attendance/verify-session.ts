/**
 * CampusLens AI - Attendance Verification & Geofence Validator
 */

import { decodeSessionPayload, type LectureSessionToken } from "./qr-generator";

export interface AttendanceVerificationResult {
  valid: boolean;
  reason?: string;
  token?: LectureSessionToken;
  verifiedAt?: string;
}

export function verifyAttendanceSession(
  encodedToken: string,
  userCoordinates?: { latitude: number; longitude: number },
  campusBounds?: { minLat: number; maxLat: number; minLng: number; maxLng: number }
): AttendanceVerificationResult {
  const token = decodeSessionPayload(encodedToken);

  if (!token) {
    return { valid: false, reason: "Malformed or unreadable QR attendance token." };
  }

  const now = Date.now();
  if (now > token.expiresAt) {
    return {
      valid: false,
      reason: "This lecture session QR code has expired. Ask the professor to refresh the session token.",
      token,
    };
  }

  // Geofence validation (if coordinates provided)
  if (userCoordinates && campusBounds) {
    const inBounds =
      userCoordinates.latitude >= campusBounds.minLat &&
      userCoordinates.latitude <= campusBounds.maxLat &&
      userCoordinates.longitude >= campusBounds.minLng &&
      userCoordinates.longitude <= campusBounds.maxLng;

    if (!inBounds) {
      return {
        valid: false,
        reason: "Geofence validation failed. You must be physically present on campus to check in.",
        token,
      };
    }
  }

  return {
    valid: true,
    token,
    verifiedAt: new Date().toISOString(),
  };
}
