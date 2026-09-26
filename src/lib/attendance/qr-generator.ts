/**
 * CampusLens AI - Dynamic QR Lecture Session Token Generator
 */

export interface LectureSessionToken {
  sessionId: string;
  courseCode: string;
  roomNumber: string;
  facultyId: string;
  issuedAt: number;
  expiresAt: number;
  nonce: string;
}

export function generateLectureToken(params: {
  courseCode: string;
  roomNumber: string;
  facultyId: string;
  validMinutes?: number;
}): LectureSessionToken {
  const issuedAt = Date.now();
  const validMinutes = params.validMinutes || 15;
  const expiresAt = issuedAt + validMinutes * 60 * 1000;
  const nonce = Math.random().toString(36).substring(2, 10);
  const sessionId = `sess-${params.courseCode.toLowerCase()}-${issuedAt}`;

  return {
    sessionId,
    courseCode: params.courseCode,
    roomNumber: params.roomNumber,
    facultyId: params.facultyId,
    issuedAt,
    expiresAt,
    nonce,
  };
}

export function encodeSessionPayload(token: LectureSessionToken): string {
  return btoa(JSON.stringify(token));
}

export function decodeSessionPayload(encoded: string): LectureSessionToken | null {
  try {
    const jsonStr = atob(encoded);
    return JSON.parse(jsonStr) as LectureSessionToken;
  } catch {
    return null;
  }
}
