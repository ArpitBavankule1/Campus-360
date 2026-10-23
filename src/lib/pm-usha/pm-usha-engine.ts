/**
 * Phase 58: Smart Campus PM-USHA (Pradhan Mantri Uchchatar Shiksha Abhiyan)
 * Grants, Infrastructure & Institutional Development Gateway Engine
 * In-memory stateful store, cryptographic token generators, seed data, and PFMS telemetry.
 */

import {
  PmUshaInstitutionalProfile,
  PmUshaProjectProposal,
  PmUshaFundAllocation,
  PmUshaPhysicalMilestone,
  PmUshaUtilizationCertificate,
  PmUshaSummaryStats,
  PmUshaCategory,
  PmUshaComponentType,
  PmUshaProposalStatus,
  PmUshaDisbursalStatus,
  PmUshaMilestoneCategory,
  PmUshaInspectionStatus,
  PmUshaUcStatus,
} from "@/types";

// ==========================================
// Cryptographic & Format Generators
// ==========================================

export function generatePmUshaProposalCode(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  const hex = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PM-USHA-PROP-2026-${hex}-${num}`;
}

export function generatePmUshaSanctionToken(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  const hex = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SANCTION-MOE-USHA-2026-${hex}-${num}`;
}

export function generatePmUshaMilestoneCode(): string {
  const num = Math.floor(100 + Math.random() * 900);
  const hex = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `MS-USHA-2026-${hex}-${num}`;
}

export function generatePmUshaUcVerificationHash(payload: string = ""): string {
  const chars = "0123456789abcdef";
  let hash = "sha256:0x";
  for (let i = 0; i < 40; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

// ==========================================
// Seed Data
// ==========================================

export const MOCK_PM_USHA_PROFILE: PmUshaInstitutionalProfile = {
  id: "pm-usha-prof-001",
  institutional_code: "USHA-INST-MH-2026-88",
  shec_state: "Maharashtra State Higher Education Council (MSHEC)",
  category: "INFRASTRUCTURE_COLLEGE",
  nodal_officer_name: "Dr. Arvind R. Kulkarni",
  nodal_officer_email: "pmusha.nodal@campuslens.edu.in",
  nodal_officer_phone: "+91 98230 44109",
  pfms_agency_code: "MH-PUMOE-77291",
  pfms_bank_account_no: "SBI-PFMS-00049281729",
  current_cycle: "PM-USHA Cycle 2024-2027",
  total_approved_grant_cr: 20.00,
  total_disbursed_grant_cr: 12.50,
  total_utilized_grant_cr: 9.80,
  status: "Active",
  created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
  updated_at: new Date().toISOString(),
};

export const MOCK_PM_USHA_PROPOSALS: PmUshaProjectProposal[] = [
  {
    id: "prop-001",
    proposal_code: "PM-USHA-PROP-2026-MERU-101",
    title: "Multi-Disciplinary Research Hub & High Performance Computing Facility",
    component_type: "MERU_UPGRADE",
    submitted_date: "2026-01-15",
    estimated_budget_lakhs: 850.00,
    approved_budget_lakhs: 800.00,
    central_share_percentage: 60.00,
    state_share_percentage: 40.00,
    target_completion_date: "2027-03-31",
    approval_status: "MoE_Approved",
    review_remarks: "Sanctioned under MERU Focus Component. Nodal PMU verified Detailed Project Report.",
    created_at: new Date(Date.now() - 80 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prop-002",
    proposal_code: "PM-USHA-PROP-2026-INFR-202",
    title: "Next-Gen Academic Complex & Smart IoT-Enabled Clean Energy Laboratories",
    component_type: "INFRASTRUCTURE_GRANTS",
    submitted_date: "2026-02-10",
    estimated_budget_lakhs: 550.00,
    approved_budget_lakhs: 500.00,
    central_share_percentage: 60.00,
    state_share_percentage: 40.00,
    target_completion_date: "2026-12-15",
    approval_status: "MoE_Approved",
    review_remarks: "Phase 1 civil structure 80% complete. Second tranche disbursed via PFMS.",
    created_at: new Date(Date.now() - 65 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prop-003",
    proposal_code: "PM-USHA-PROP-2026-EQTY-303",
    title: "Gender Inclusion Center, Accessible Ramps & Specially-Abled Resource Commons",
    component_type: "GENDER_EQUITY",
    submitted_date: "2026-03-01",
    estimated_budget_lakhs: 180.00,
    approved_budget_lakhs: 180.00,
    central_share_percentage: 60.00,
    state_share_percentage: 40.00,
    target_completion_date: "2026-09-30",
    approval_status: "SHEC_Recommended",
    review_remarks: "State Higher Education Council endorsed. Final MoE Project Approval Board (PAB) clearance pending.",
    created_at: new Date(Date.now() - 40 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prop-004",
    proposal_code: "PM-USHA-PROP-2026-DIGI-404",
    title: "Digital Studio, SWAYAM MOOCs Recording Center & Campus Fiber Grid Upgrade",
    component_type: "DIGITAL_LEARNING_CENTER",
    submitted_date: "2026-04-12",
    estimated_budget_lakhs: 220.00,
    approved_budget_lakhs: 200.00,
    central_share_percentage: 60.00,
    state_share_percentage: 40.00,
    target_completion_date: "2027-01-15",
    approval_status: "Submitted",
    review_remarks: "Technical scrutiny under progress by State Project Directorate (SPD).",
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const MOCK_PM_USHA_ALLOCATIONS: PmUshaFundAllocation[] = [
  {
    id: "alloc-001",
    allocation_code: "PM-USHA-ALLOC-2026-01",
    proposal_id: "prop-001",
    sanction_order_no: "F.No. 16-4/2025-U.Policy(PM-USHA-MERU)",
    sanction_date: "2026-02-01",
    installment_number: 1,
    central_share_amount_lakhs: 240.00,
    state_share_amount_lakhs: 160.00,
    total_sanctioned_lakhs: 400.00,
    pfms_transaction_id: "PFMS-TXN-20260201-99812",
    disbursal_status: "PFMS_Credited",
    disbursal_date: "2026-02-14",
    utilization_status: "Partially_Utilized",
    created_at: new Date(Date.now() - 75 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "alloc-002",
    allocation_code: "PM-USHA-ALLOC-2026-02",
    proposal_id: "prop-002",
    sanction_order_no: "F.No. 18-9/2025-U.Policy(PM-USHA-INFR)",
    sanction_date: "2026-03-05",
    installment_number: 1,
    central_share_amount_lakhs: 180.00,
    state_share_amount_lakhs: 120.00,
    total_sanctioned_lakhs: 300.00,
    pfms_transaction_id: "PFMS-TXN-20260305-66741",
    disbursal_status: "PFMS_Credited",
    disbursal_date: "2026-03-18",
    utilization_status: "Partially_Utilized",
    created_at: new Date(Date.now() - 50 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "alloc-003",
    allocation_code: "PM-USHA-ALLOC-2026-03",
    proposal_id: "prop-001",
    sanction_order_no: "F.No. 16-4/2026-U.Policy(PM-USHA-MERU-TR2)",
    sanction_date: "2026-04-10",
    installment_number: 2,
    central_share_amount_lakhs: 150.00,
    state_share_amount_lakhs: 100.00,
    total_sanctioned_lakhs: 250.00,
    pfms_transaction_id: "PFMS-TXN-20260410-11234",
    disbursal_status: "Pending_State_Share",
    disbursal_date: "2026-04-20",
    utilization_status: "Unspent",
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const MOCK_PM_USHA_MILESTONES: PmUshaPhysicalMilestone[] = [
  {
    id: "ms-001",
    milestone_code: "MS-USHA-2026-CW-01",
    proposal_id: "prop-002",
    milestone_name: "Foundation & RCC Framing for Clean Energy Lab Block",
    work_category: "Civil_Works",
    target_date: "2026-04-30",
    physical_progress_percentage: 95.00,
    financial_progress_percentage: 90.00,
    geo_latitude: 18.52043,
    geo_longitude: 73.856744,
    site_inspection_status: "Certified",
    inspection_date: "2026-04-20",
    inspector_designation: "Executive Engineer, State PWD / SPD Technical Cell",
    geo_tag_photo_url: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=600&auto=format&fit=crop&q=80",
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "ms-002",
    milestone_code: "MS-USHA-2026-LM-02",
    proposal_id: "prop-001",
    milestone_name: "Procurement & Server Rack Installation for AI Research Cluster",
    work_category: "Lab_Modernization",
    target_date: "2026-05-15",
    physical_progress_percentage: 75.00,
    financial_progress_percentage: 70.00,
    geo_latitude: 18.52112,
    geo_longitude: 73.857211,
    site_inspection_status: "Inspected_Satisfactory",
    inspection_date: "2026-04-22",
    inspector_designation: "Nodal Consultant (IT), PM-USHA Technical Advisory Board",
    geo_tag_photo_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80",
    created_at: new Date(Date.now() - 45 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "ms-003",
    milestone_code: "MS-USHA-2026-SC-03",
    proposal_id: "prop-002",
    milestone_name: "Acoustics & Interactive Interactive Touch Panels for Smart Classrooms",
    work_category: "Smart_Classrooms",
    target_date: "2026-06-30",
    physical_progress_percentage: 60.00,
    financial_progress_percentage: 55.00,
    geo_latitude: 18.52098,
    geo_longitude: 73.85695,
    site_inspection_status: "Pending",
    inspection_date: undefined,
    inspector_designation: undefined,
    geo_tag_photo_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80",
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "ms-004",
    milestone_code: "MS-USHA-2026-SOL-04",
    proposal_id: "prop-002",
    milestone_name: "Rooftop Solar PV Array 150 kW Grid Integration",
    work_category: "Solar_Green_Energy",
    target_date: "2026-07-31",
    physical_progress_percentage: 80.00,
    financial_progress_percentage: 75.00,
    geo_latitude: 18.52205,
    geo_longitude: 73.85789,
    site_inspection_status: "Inspected_Satisfactory",
    inspection_date: "2026-04-18",
    inspector_designation: "Energy Auditor & Green Campus Evaluator",
    geo_tag_photo_url: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80",
    created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const MOCK_PM_USHA_CERTIFICATES: PmUshaUtilizationCertificate[] = [
  {
    id: "uc-001",
    certificate_number: "PM-USHA-UC-2025-26-001",
    allocation_id: "alloc-001",
    financial_year: "2025-2026",
    gfr_format: "GFR 12-A",
    grant_in_aid_sanctioned_lakhs: 400.00,
    interest_earned_lakhs: 3.85,
    expenditure_incurred_lakhs: 360.50,
    unspent_balance_lakhs: 43.35,
    statutory_auditor_name: "M/s Deshmukh & Singhania Chartered Accountants",
    ca_membership_no: "CA-FCA-094812",
    signed_date: "2026-03-31",
    submission_status: "MoE_Accepted",
    verification_hash: "sha256:0x7d9f2b84e1a065c3b994821a37c901ee4389df0b",
    created_at: new Date(Date.now() - 40 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "uc-002",
    certificate_number: "PM-USHA-UC-2025-26-002",
    allocation_id: "alloc-002",
    financial_year: "2025-2026",
    gfr_format: "GFR 12-A",
    grant_in_aid_sanctioned_lakhs: 300.00,
    interest_earned_lakhs: 2.10,
    expenditure_incurred_lakhs: 245.80,
    unspent_balance_lakhs: 56.30,
    statutory_auditor_name: "M/s Deshmukh & Singhania Chartered Accountants",
    ca_membership_no: "CA-FCA-094812",
    signed_date: "2026-04-15",
    submission_status: "Submitted_to_SHEC",
    verification_hash: "sha256:0x3c2e1f980a7b5432d1efbc908123456789abcdef",
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// ==========================================
// Stateful In-Memory Store
// ==========================================

let profileStore: PmUshaInstitutionalProfile = { ...MOCK_PM_USHA_PROFILE };
let proposalsStore: PmUshaProjectProposal[] = [...MOCK_PM_USHA_PROPOSALS];
let allocationsStore: PmUshaFundAllocation[] = [...MOCK_PM_USHA_ALLOCATIONS];
let milestonesStore: PmUshaPhysicalMilestone[] = [...MOCK_PM_USHA_MILESTONES];
let certificatesStore: PmUshaUtilizationCertificate[] = [...MOCK_PM_USHA_CERTIFICATES];

export function getPmUshaProfile(): PmUshaInstitutionalProfile {
  return { ...profileStore };
}

export function updatePmUshaProfile(
  patch: Partial<PmUshaInstitutionalProfile>
): PmUshaInstitutionalProfile {
  profileStore = {
    ...profileStore,
    ...patch,
    updated_at: new Date().toISOString(),
  };
  return { ...profileStore };
}

export function getPmUshaProposals(): PmUshaProjectProposal[] {
  return [...proposalsStore];
}

export function addPmUshaProposal(
  proposal: Omit<PmUshaProjectProposal, "id" | "created_at" | "updated_at">
): PmUshaProjectProposal {
  const newProposal: PmUshaProjectProposal = {
    ...proposal,
    id: `prop-${Date.now()}`,
    proposal_code: proposal.proposal_code || generatePmUshaProposalCode(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  proposalsStore.unshift(newProposal);
  return newProposal;
}

export function updatePmUshaProposal(
  id: string,
  patch: Partial<PmUshaProjectProposal>
): PmUshaProjectProposal | null {
  const idx = proposalsStore.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  proposalsStore[idx] = {
    ...proposalsStore[idx],
    ...patch,
    updated_at: new Date().toISOString(),
  };
  return { ...proposalsStore[idx] };
}

export function getPmUshaFundAllocations(): PmUshaFundAllocation[] {
  return [...allocationsStore];
}

export function addPmUshaFundAllocation(
  allocation: Omit<PmUshaFundAllocation, "id" | "created_at" | "updated_at">
): PmUshaFundAllocation {
  const newAllocation: PmUshaFundAllocation = {
    ...allocation,
    id: `alloc-${Date.now()}`,
    allocation_code: allocation.allocation_code || `ALLOC-${Date.now().toString().slice(-6)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  allocationsStore.unshift(newAllocation);
  return newAllocation;
}

export function updatePmUshaFundAllocation(
  id: string,
  patch: Partial<PmUshaFundAllocation>
): PmUshaFundAllocation | null {
  const idx = allocationsStore.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  allocationsStore[idx] = {
    ...allocationsStore[idx],
    ...patch,
    updated_at: new Date().toISOString(),
  };
  return { ...allocationsStore[idx] };
}

export function getPmUshaMilestones(): PmUshaPhysicalMilestone[] {
  return [...milestonesStore];
}

export function addPmUshaMilestone(
  milestone: Omit<PmUshaPhysicalMilestone, "id" | "created_at" | "updated_at">
): PmUshaPhysicalMilestone {
  const newMilestone: PmUshaPhysicalMilestone = {
    ...milestone,
    id: `ms-${Date.now()}`,
    milestone_code: milestone.milestone_code || generatePmUshaMilestoneCode(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  milestonesStore.unshift(newMilestone);
  return newMilestone;
}

export function updatePmUshaMilestone(
  id: string,
  patch: Partial<PmUshaPhysicalMilestone>
): PmUshaPhysicalMilestone | null {
  const idx = milestonesStore.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  milestonesStore[idx] = {
    ...milestonesStore[idx],
    ...patch,
    updated_at: new Date().toISOString(),
  };
  return { ...milestonesStore[idx] };
}

export function getPmUshaUtilizationCertificates(): PmUshaUtilizationCertificate[] {
  return [...certificatesStore];
}

export function addPmUshaUtilizationCertificate(
  certificate: Omit<PmUshaUtilizationCertificate, "id" | "created_at" | "updated_at">
): PmUshaUtilizationCertificate {
  const newUc: PmUshaUtilizationCertificate = {
    ...certificate,
    id: `uc-${Date.now()}`,
    certificate_number: certificate.certificate_number || `UC-USHA-${Date.now().toString().slice(-6)}`,
    verification_hash: certificate.verification_hash || generatePmUshaUcVerificationHash(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  certificatesStore.unshift(newUc);
  return newUc;
}

export function updatePmUshaUtilizationCertificate(
  id: string,
  patch: Partial<PmUshaUtilizationCertificate>
): PmUshaUtilizationCertificate | null {
  const idx = certificatesStore.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  certificatesStore[idx] = {
    ...certificatesStore[idx],
    ...patch,
    updated_at: new Date().toISOString(),
  };
  return { ...certificatesStore[idx] };
}

// ==========================================
// Analytics & Calculations
// ==========================================

export function calculateFundUtilizationRate(
  utilizedCr: number,
  disbursedCr: number
): number {
  if (disbursedCr <= 0) return 0;
  return Math.min(100, Math.round((utilizedCr / disbursedCr) * 1000) / 10);
}

export function calculateMilestoneCompletionRate(
  milestones: PmUshaPhysicalMilestone[]
): number {
  if (!milestones.length) return 0;
  const avg =
    milestones.reduce((acc, m) => acc + (m.physical_progress_percentage || 0), 0) /
    milestones.length;
  return Math.round(avg * 10) / 10;
}

export function calculatePfmsComplianceScore(
  allocations: PmUshaFundAllocation[],
  certificates: PmUshaUtilizationCertificate[]
): number {
  if (!allocations.length) return 85;
  const creditedCount = allocations.filter(
    (a) => a.disbursal_status === "PFMS_Credited"
  ).length;
  const acceptedUcCount = certificates.filter(
    (c) => c.submission_status === "MoE_Accepted" || c.submission_status === "Submitted_to_SHEC"
  ).length;
  const allocScore = (creditedCount / allocations.length) * 50;
  const ucScore = certificates.length ? (acceptedUcCount / certificates.length) * 50 : 40;
  return Math.min(100, Math.round(allocScore + ucScore));
}

export function calculateCentralStateDisbursalRatio(
  allocations: PmUshaFundAllocation[]
): { centralLakhs: number; stateLakhs: number; centralRatio: number; stateRatio: number } {
  const centralLakhs = allocations.reduce((acc, a) => acc + (a.central_share_amount_lakhs || 0), 0);
  const stateLakhs = allocations.reduce((acc, a) => acc + (a.state_share_amount_lakhs || 0), 0);
  const total = centralLakhs + stateLakhs;
  return {
    centralLakhs,
    stateLakhs,
    centralRatio: total > 0 ? Math.round((centralLakhs / total) * 100) : 60,
    stateRatio: total > 0 ? Math.round((stateLakhs / total) * 100) : 40,
  };
}

export function getPmUshaSummaryStats(): PmUshaSummaryStats {
  const profile = getPmUshaProfile();
  const proposals = getPmUshaProposals();
  const allocations = getPmUshaFundAllocations();
  const milestones = getPmUshaMilestones();
  const certificates = getPmUshaUtilizationCertificates();

  const fundUtilizationRatePct = calculateFundUtilizationRate(
    profile.total_utilized_grant_cr,
    profile.total_disbursed_grant_cr
  );
  const milestoneCompletionRatePct = calculateMilestoneCompletionRate(milestones);
  const pfmsComplianceScorePct = calculatePfmsComplianceScore(allocations, certificates);
  const approvedProposalsCount = proposals.filter(
    (p) => p.approval_status === "MoE_Approved" || p.approval_status === "SHEC_Recommended"
  ).length;
  const milestonesCertifiedCount = milestones.filter(
    (m) => m.site_inspection_status === "Certified" || m.site_inspection_status === "Inspected_Satisfactory"
  ).length;

  return {
    institutionalCode: profile.institutional_code,
    shecState: profile.shec_state,
    pfmsAgencyCode: profile.pfms_agency_code,
    currentCycle: profile.current_cycle,
    totalApprovedGrantCr: profile.total_approved_grant_cr,
    totalDisbursedGrantCr: profile.total_disbursed_grant_cr,
    totalUtilizedGrantCr: profile.total_utilized_grant_cr,
    fundUtilizationRatePct,
    totalProposalsCount: proposals.length,
    approvedProposalsCount,
    milestonesTotalCount: milestones.length,
    milestonesCertifiedCount,
    milestoneCompletionRatePct,
    pfmsComplianceScorePct,
    profile,
    proposals,
    allocations,
    milestones,
    certificates,
  };
}
