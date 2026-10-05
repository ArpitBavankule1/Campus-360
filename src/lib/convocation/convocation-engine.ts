// CampusLens AI — Phase 38: Smart Campus Digital Credentialing & Convocation Engine
// src/lib/convocation/convocation-engine.ts

import {
  DegreeCredential,
  ConvocationCeremony,
  ConvocationRegistration,
  CredentialVerificationRequest,
  ConvocationOverviewStats,
} from "@/types";

export function generateDegreeCode(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CL-DEG-2026-${rand}`;
}

export function generateConvocationPassCode(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CL-CONV-PASS-2026-${rand}`;
}

export function generateVerificationCode(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `VERIFY-DEG-${rand}`;
}

export const MOCK_DEGREE_CREDENTIALS: DegreeCredential[] = [
  {
    id: "deg-1",
    college_id: "c0000000-0000-0000-0000-000000000001",
    credential_code: "CL-DEG-2026-9041",
    scholar_id: "SCH-CS-2022-019",
    scholar_name: "Aarav Sharma",
    degree_type: "Bachelor of Technology",
    department: "Computer Science & Artificial Intelligence",
    graduation_year: 2026,
    cgpa: 9.85,
    honors_classification: "Dean's Gold Medalist",
    cryptographic_hash: "SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
    credential_status: "Issued & Cryptographically Signed",
    conferred_at: "2026-10-15T10:00:00Z",
    created_at: "2026-10-01T08:00:00Z",
  },
  {
    id: "deg-2",
    college_id: "c0000000-0000-0000-0000-000000000001",
    credential_code: "CL-DEG-2026-8812",
    scholar_id: "SCH-ECE-2022-044",
    scholar_name: "Sneha Nair",
    degree_type: "Bachelor of Technology",
    department: "Electronics & Communications Engineering",
    graduation_year: 2026,
    cgpa: 9.62,
    honors_classification: "First Class with Distinction",
    cryptographic_hash: "SHA256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    credential_status: "Issued & Cryptographically Signed",
    conferred_at: "2026-10-15T10:00:00Z",
    created_at: "2026-10-01T08:30:00Z",
  },
  {
    id: "deg-3",
    college_id: "c0000000-0000-0000-0000-000000000001",
    credential_code: "CL-DEG-2026-7734",
    scholar_id: "SCH-PHD-2021-008",
    scholar_name: "Dr. Siddharth Verma",
    degree_type: "Doctor of Philosophy",
    department: "Quantum Computing & Photonics Lab",
    graduation_year: 2026,
    cgpa: 10.0,
    honors_classification: "Chancellor's Citation",
    cryptographic_hash: "SHA256:ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb",
    credential_status: "Issued & Cryptographically Signed",
    conferred_at: "2026-10-15T10:00:00Z",
    created_at: "2026-10-02T09:00:00Z",
  },
  {
    id: "deg-4",
    college_id: "c0000000-0000-0000-0000-000000000001",
    credential_code: "CL-DEG-2026-6520",
    scholar_id: "SCH-MECH-2022-088",
    scholar_name: "Rohan Kulkarni",
    degree_type: "Bachelor of Technology",
    department: "Mechanical & Mechatronics Engineering",
    graduation_year: 2026,
    cgpa: 9.15,
    honors_classification: "First Class Honours",
    cryptographic_hash: "SHA256:ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    credential_status: "Issued & Cryptographically Signed",
    conferred_at: "2026-10-15T10:00:00Z",
    created_at: "2026-10-02T11:00:00Z",
  },
];

export const MOCK_CONVOCATION_CEREMONY: ConvocationCeremony = {
  id: "cer-2026",
  college_id: "c0000000-0000-0000-0000-000000000001",
  edition_title: "32nd Annual Grand Academic Convocation",
  academic_session: "2025-2026",
  chief_guest_name: "Dr. Soumya Swaminathan",
  chief_guest_designation: "Former Chief Scientist WHO & Distinguished Fellow",
  ceremony_date: "2026-10-15",
  ceremony_time: "09:30 AM IST",
  venue_auditorium: "Dr. A.P.J. Abdul Kalam Grand Central Auditorium",
  total_degrees_awarded: 1240,
  regalia_dress_code: "Institutional Silk Stole & Black Doctoral / Graduate Robe",
  ceremony_status: "Scheduled",
  created_at: "2026-09-20T00:00:00Z",
};

export const MOCK_CONVOCATION_REGISTRATIONS: ConvocationRegistration[] = [
  {
    id: "reg-1",
    college_id: "c0000000-0000-0000-0000-000000000001",
    registration_code: "REG-CONV-2026-001",
    scholar_id: "SCH-CS-2022-019",
    scholar_name: "Aarav Sharma",
    degree_awarded: "B.Tech Computer Science & AI (Gold Medalist)",
    gown_size: "Large (L)",
    guest_pass_count: 2,
    allocated_seat_number: "ROW-A-012 (Orchestra Front)",
    admittance_pass_code: "CL-CONV-PASS-2026-4412",
    is_gown_collected: true,
    is_checked_in: false,
    registered_at: "2026-10-02T12:00:00Z",
  },
  {
    id: "reg-2",
    college_id: "c0000000-0000-0000-0000-000000000001",
    registration_code: "REG-CONV-2026-002",
    scholar_id: "SCH-ECE-2022-044",
    scholar_name: "Sneha Nair",
    degree_awarded: "B.Tech Electronics & Comm",
    gown_size: "Medium (M)",
    guest_pass_count: 2,
    allocated_seat_number: "ROW-B-028 (Orchestra)",
    admittance_pass_code: "CL-CONV-PASS-2026-8910",
    is_gown_collected: true,
    is_checked_in: false,
    registered_at: "2026-10-03T10:15:00Z",
  },
];

export const MOCK_CREDENTIAL_VERIFICATIONS: CredentialVerificationRequest[] = [
  {
    id: "ver-1",
    college_id: "c0000000-0000-0000-0000-000000000001",
    verification_code: "VERIFY-DEG-7721",
    credential_code: "CL-DEG-2026-9041",
    requester_organization: "Google DeepMind Global Talent Acquisition",
    requester_contact_email: "credentials-verify@google.com",
    verification_purpose: "Pre-Employment Technical Staff Background Verification",
    verification_status: "Verified & Authentic",
    verified_at: "2026-10-04T14:20:00Z",
  },
  {
    id: "ver-2",
    college_id: "c0000000-0000-0000-0000-000000000001",
    verification_code: "VERIFY-DEG-6632",
    credential_code: "CL-DEG-2026-7734",
    requester_organization: "Oxford Quantum Research Institute",
    requester_contact_email: "postdoc-admissions@ox.ac.uk",
    verification_purpose: "Postdoctoral Fellowship Degree Validation",
    verification_status: "Verified & Authentic",
    verified_at: "2026-10-04T16:45:00Z",
  },
];

export function calculateConvocationOverview(
  credentials: DegreeCredential[] = MOCK_DEGREE_CREDENTIALS,
  ceremony: ConvocationCeremony = MOCK_CONVOCATION_CEREMONY,
  registrations: ConvocationRegistration[] = MOCK_CONVOCATION_REGISTRATIONS,
  verifications: CredentialVerificationRequest[] = MOCK_CREDENTIAL_VERIFICATIONS
): ConvocationOverviewStats {
  const goldMedalistsCount = credentials.filter(
    (c) =>
      c.honors_classification === "Dean's Gold Medalist" ||
      c.honors_classification === "Chancellor's Citation"
  ).length;

  return {
    totalDegreesIssued: ceremony.total_degrees_awarded,
    registeredScholarsCount: registrations.length,
    goldMedalistsCount,
    employerVerificationsCount: verifications.length,
    credentials,
    ceremony,
    registrations,
    recentVerifications: verifications,
  };
}
