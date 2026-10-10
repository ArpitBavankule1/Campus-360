/**
 * CampusLens AI — Phase 45: Smart Campus Industry MoUs, Corporate CSR & Sponsored Research Partnerships Engine
 * File: src/lib/partnerships/partnerships-engine.ts
 */

import {
  IndustryMoU,
  SponsoredGrant,
  IndustryLab,
  TechnologyLicense,
  PartnershipsOverviewStats,
  MoUTier,
  GrantStatus,
  LicenseStatus,
} from "@/types";

// Token Generators
export function generateMoUToken(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CL-MOU-2026-${rand}`;
}

export function generateGrantToken(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CL-CSR-GRANT-2026-${rand}`;
}

export function generateLicensingToken(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CL-TECH-LIC-2026-${rand}`;
}

// Mock Industry MoUs
export const MOCK_INDUSTRY_MOUS: IndustryMoU[] = [
  {
    id: "mou-001",
    partner_name: "NVIDIA AI Research Labs",
    partner_logo: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=120&q=80",
    partner_tier: "strategic",
    industry_sector: "Artificial Intelligence & Semiconductors",
    mou_token: "CL-MOU-2026-8812",
    valid_from: "2026-01-15",
    valid_to: "2029-01-14",
    scope: "Establishment of Apex AI Supercomputing Pod, Co-sponsored Deep Learning Fellowships & GPU Cluster Compute grants.",
    key_objectives: [
      "Hardware donation of DGX H200 Superpod",
      "Annual ₹1.5 Cr Research Grant Pool",
      "Direct fast-track PhD internships at NVIDIA Research"
    ],
    executive_sponsor: "Jensen H. (VP, Academic Research Alliances)",
    nodal_faculty_coordinator: "Prof. K. Ramanathan (Dept. of Computer Science)",
    financial_commitment_inr: 45000000,
    status: "active",
    signed_document_url: "https://campuslens.ai/docs/mou-nvidia-2026.pdf",
    is_active: true,
    created_at: "2026-01-15T09:00:00Z",
  },
  {
    id: "mou-002",
    partner_name: "Tata Motors Mobility Innovation",
    partner_logo: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=120&q=80",
    partner_tier: "strategic",
    industry_sector: "Automotive & Electric Mobility",
    mou_token: "CL-MOU-2026-5120",
    valid_from: "2025-08-01",
    valid_to: "2028-07-31",
    scope: "Battery Management Systems (BMS), Autonomous Vehicle Testbed and Solid-State Battery chemistry research.",
    key_objectives: [
      "Electrification Dynamics test bench setup",
      "Co-developed Master of Technology curriculum in EV Engineering",
      "Corporate CSR funding for student formula electric race car"
    ],
    executive_sponsor: "Anand S. (Head of Advanced Technology)",
    nodal_faculty_coordinator: "Dr. Sunita Deshmukh (Dept. of Mechanical & Mechatronics)",
    financial_commitment_inr: 32000000,
    status: "active",
    signed_document_url: "https://campuslens.ai/docs/mou-tatamotors-2025.pdf",
    is_active: true,
    created_at: "2025-08-01T10:00:00Z",
  },
  {
    id: "mou-003",
    partner_name: "Serum Institute of India Biotech",
    partner_logo: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=120&q=80",
    partner_tier: "core",
    industry_sector: "Biotechnology & Pharmaceuticals",
    mou_token: "CL-MOU-2026-3490",
    valid_from: "2026-03-01",
    valid_to: "2029-02-28",
    scope: "Genomic sequence modeling, mRNA formulation analytics and clinical diagnostics biosensor prototyping.",
    key_objectives: [
      "Biosafety Level-3 pilot incubator access",
      "Sponsored vaccine cold-chain IoT research chair",
      "Graduate bioprocessing fellowships"
    ],
    executive_sponsor: "Dr. Cyrus V. (Chief Science Officer)",
    nodal_faculty_coordinator: "Prof. Arvind Trivedi (Dept. of Biotechnology)",
    financial_commitment_inr: 28000000,
    status: "active",
    signed_document_url: "https://campuslens.ai/docs/mou-serum-2026.pdf",
    is_active: true,
    created_at: "2026-03-01T11:00:00Z",
  },
  {
    id: "mou-004",
    partner_name: "Qualcomm Wireless Edge",
    partner_logo: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=120&q=80",
    partner_tier: "core",
    industry_sector: "Telecommunications & 6G Wireless",
    mou_token: "CL-MOU-2026-7241",
    valid_from: "2025-11-15",
    valid_to: "2027-11-14",
    scope: "Next-gen Open-RAN 6G prototyping, Terahertz communications, and Edge AI silicon co-optimization.",
    key_objectives: [
      "5G/6G RF anechoic chamber testing facilities",
      "Qualcomm Innovation Fellowship awards",
      "Student hackathons on Snapdragon on-device LLMs"
    ],
    executive_sponsor: "Vikram S. (Senior Director, Engineering)",
    nodal_faculty_coordinator: "Dr. Meenakshi Iyer (Dept. of Electronics & Communication)",
    financial_commitment_inr: 21000000,
    status: "active",
    signed_document_url: "https://campuslens.ai/docs/mou-qualcomm-2025.pdf",
    is_active: true,
    created_at: "2025-11-15T08:30:00Z",
  }
];

// Mock Sponsored Research & CSR Grants
export const MOCK_SPONSORED_GRANTS: SponsoredGrant[] = [
  {
    id: "grant-001",
    project_title: "Fault-Tolerant Distributed Quantum Optimization Algorithms",
    mou_id: "mou-001",
    sponsor_name: "NVIDIA AI Research Labs",
    grant_type: "sponsored_research",
    principal_investigator: "Prof. K. Ramanathan",
    co_investigators: ["Dr. Preeti Verma", "Dr. A. Sengupta"],
    department: "Computer Science & Engineering",
    grant_amount_inr: 12500000,
    disbursed_amount_inr: 7500000,
    grant_token: "CL-CSR-GRANT-2026-4401",
    milestones: [
      { title: "Quantum Simulator Benchmarking on cuQuantum", target_date: "2026-06-30", delivered: true, completion_pct: 100 },
      { title: "Noisy Intermediate-Scale Quantum Error Mitigation", target_date: "2026-12-15", delivered: false, completion_pct: 60 },
      { title: "End-to-End Hybrid Quantum-Classical Pipeline", target_date: "2027-04-30", delivered: false, completion_pct: 0 }
    ],
    deliverables: ["Open-source cuQuantum CUDA kernel library", "3 IEEE Transactions journal publications", "Patent filing for circuit synthesis"],
    status: "active",
    start_date: "2026-01-01",
    end_date: "2027-06-30",
    created_at: "2026-01-02T10:00:00Z",
  },
  {
    id: "grant-002",
    project_title: "Ultra-Fast Solid-State Electrolyte Formulations for Commercial EVs",
    mou_id: "mou-002",
    sponsor_name: "Tata Motors Mobility Innovation",
    grant_type: "corporate_csr",
    principal_investigator: "Dr. Sunita Deshmukh",
    co_investigators: ["Dr. Rajeshwari Nair"],
    department: "Materials Science & Mechanical",
    grant_amount_inr: 9800000,
    disbursed_amount_inr: 5000000,
    grant_token: "CL-CSR-GRANT-2026-8920",
    milestones: [
      { title: "Composite Polymer Solid Electrolyte Synthesis", target_date: "2026-05-15", delivered: true, completion_pct: 100 },
      { title: "Thermal Runaway In-Situ Impedance Spectrometry", target_date: "2026-11-30", delivered: false, completion_pct: 45 },
      { title: "Pouch Cell 1000-Cycle Durability Test Docket", target_date: "2027-03-31", delivered: false, completion_pct: 0 }
    ],
    deliverables: ["Electrochemical impedance database", "Prototype 10Ah pouch cell", "Technology Transfer Term Sheet"],
    status: "active",
    start_date: "2026-02-01",
    end_date: "2027-04-30",
    created_at: "2026-02-01T11:00:00Z",
  },
  {
    id: "grant-003",
    project_title: "Autonomous 6G Reconfigurable Intelligent Surface Arrays",
    mou_id: "mou-004",
    sponsor_name: "Qualcomm Wireless Edge",
    grant_type: "sponsored_research",
    principal_investigator: "Dr. Meenakshi Iyer",
    co_investigators: ["Prof. Tarun Sen"],
    department: "Electronics & Communication",
    grant_amount_inr: 8500000,
    disbursed_amount_inr: 4250000,
    grant_token: "CL-CSR-GRANT-2026-3112",
    milestones: [
      { title: "Metamaterial Reflectarray Phase Optimization", target_date: "2026-04-30", delivered: true, completion_pct: 100 },
      { title: "Real-time FPGA Beamforming Controller Implementation", target_date: "2026-10-31", delivered: false, completion_pct: 70 },
      { title: "Field Test over 300 GHz Millimeter-Wave Link", target_date: "2027-02-28", delivered: false, completion_pct: 0 }
    ],
    deliverables: ["Metasurface hardware prototype", "FPGA bitstream", "Joint whitepaper with Qualcomm Systems Group"],
    status: "active",
    start_date: "2026-01-15",
    end_date: "2027-03-15",
    created_at: "2026-01-15T09:30:00Z",
  }
];

// Mock Co-Branded Industry Labs
export const MOCK_INDUSTRY_LABS: IndustryLab[] = [
  {
    id: "lab-001",
    lab_name: "Apex NVIDIA GPU Supercomputing Center",
    mou_id: "mou-001",
    industry_partner: "NVIDIA AI Research Labs",
    facility_location: "Turing Computing Annex, Wing B, 3rd Floor",
    sponsored_equipment: [
      "8x NVIDIA H200 SXM5 141GB Compute Nodes",
      "Quantum-2 InfiniBand 400Gb/s Networking Spine",
      "Liquid Cooling Direct-to-Chip Manifold"
    ],
    compute_quota_teraflops: 260.5,
    access_tier: "research_fellows_only",
    active_scholars: 34,
    lab_director: "Prof. K. Ramanathan",
    status: "operational",
    created_at: "2026-01-20T10:00:00Z",
  },
  {
    id: "lab-002",
    lab_name: "Tata Motors Advanced EV Dynamics Laboratory",
    mou_id: "mou-002",
    industry_partner: "Tata Motors Mobility Innovation",
    facility_location: "Automotive Dynamics Hall, Block D, Ground Floor",
    sponsored_equipment: [
      "Chassis Dynamometer 4WD regenerative testing rig",
      "Climatic Environmental Test Chamber (-40°C to +85°C)",
      "High-precision Battery Cell Cycler & Impedance Analyzer"
    ],
    compute_quota_teraflops: 45.0,
    access_tier: "students_and_faculty",
    active_scholars: 28,
    lab_director: "Dr. Sunita Deshmukh",
    status: "operational",
    created_at: "2025-09-01T11:00:00Z",
  },
  {
    id: "lab-003",
    lab_name: "Qualcomm 6G Wireless Edge & RF Testbed",
    mou_id: "mou-004",
    industry_partner: "Qualcomm Wireless Edge",
    facility_location: "Shannon Telecommunications Wing, 4th Floor",
    sponsored_equipment: [
      "Keysight 110 GHz Sub-Terahertz Vector Signal Generator",
      "Shielded RF Anechoic Chamber (9 kHz to 110 GHz)",
      "Snapdragon X Elite Development Evaluation Platforms"
    ],
    compute_quota_teraflops: 32.0,
    access_tier: "students_and_faculty",
    active_scholars: 19,
    lab_director: "Dr. Meenakshi Iyer",
    status: "operational",
    created_at: "2025-12-01T12:00:00Z",
  }
];

// Mock Technology Licenses & Patents
export const MOCK_TECHNOLOGY_LICENSES: TechnologyLicense[] = [
  {
    id: "lic-001",
    patent_title: "Non-Intrusive Deep Neural Spectral Sensing for Smart Grid Fault Detection",
    patent_number: "IN-PAT-2026-99214",
    inventors: ["Prof. R. G. Sharma", "Dr. Alok Verma", "Nikhil Joshi"],
    licensee_org: "Adani Transmission & Grid Analytics Ltd.",
    licensing_token: "CL-TECH-LIC-2026-1049",
    trl_level: 7,
    license_type: "non_exclusive",
    royalty_terms: "3.5% Net Revenue Royalty per monitoring station deployed",
    upfront_fee_inr: 2500000,
    filing_date: "2025-10-14",
    status: "executed",
    created_at: "2026-02-10T10:00:00Z",
  },
  {
    id: "lic-002",
    patent_title: "Biocompatible Hydrogel Nanofiber Matrix for Rapid Hemostatic Wound Dressing",
    patent_number: "IN-PAT-2026-78103",
    inventors: ["Dr. Arvind Trivedi", "Dr. Sharmila Roy"],
    licensee_org: "Serum Institute MedTech BioPharma",
    licensing_token: "CL-TECH-LIC-2026-7782",
    trl_level: 6,
    license_type: "exclusive",
    royalty_terms: "5.0% Gross Sales Royalty + ₹15L Phase-III Clinical Milestone",
    upfront_fee_inr: 3500000,
    filing_date: "2026-01-22",
    status: "royalty_bearing",
    created_at: "2026-03-05T14:00:00Z",
  }
];

// In-Memory Storage
let mousStore: IndustryMoU[] = [...MOCK_INDUSTRY_MOUS];
let grantsStore: SponsoredGrant[] = [...MOCK_SPONSORED_GRANTS];
let labsStore: IndustryLab[] = [...MOCK_INDUSTRY_LABS];
let licensesStore: TechnologyLicense[] = [...MOCK_TECHNOLOGY_LICENSES];

// Read Functions
export function getIndustryMoUs(sector?: string, tier?: MoUTier): IndustryMoU[] {
  let list = [...mousStore];
  if (sector && sector !== "all") {
    list = list.filter((m) => m.industry_sector.toLowerCase().includes(sector.toLowerCase()));
  }
  if (tier) {
    list = list.filter((m) => m.partner_tier === tier);
  }
  return list;
}

export function getSponsoredGrants(status?: GrantStatus): SponsoredGrant[] {
  if (status) {
    return grantsStore.filter((g) => g.status === status);
  }
  return [...grantsStore];
}

export function getIndustryLabs(): IndustryLab[] {
  return [...labsStore];
}

export function getTechnologyLicenses(status?: LicenseStatus): TechnologyLicense[] {
  if (status) {
    return licensesStore.filter((l) => l.status === status);
  }
  return [...licensesStore];
}

export function getPartnershipsOverviewStats(): PartnershipsOverviewStats {
  const activeMoUs = mousStore.filter((m) => m.status === "active").length;
  const totalCommittedCapital = mousStore.reduce((acc, m) => acc + (m.financial_commitment_inr || 0), 0);
  const activeGrants = grantsStore.filter((g) => g.status === "active").length;
  const totalGrantFunding = grantsStore.reduce((acc, g) => acc + g.grant_amount_inr, 0);

  return {
    totalActiveMoUs: activeMoUs,
    totalCommittedCapitalInr: totalCommittedCapital,
    activeSponsoredGrants: activeGrants,
    totalGrantFundingInr: totalGrantFunding,
    coBrandedIndustryLabs: labsStore.length,
    patentsLicensedCount: licensesStore.length,
    mous: mousStore,
    grants: grantsStore,
    labs: labsStore,
    licenses: licensesStore,
  };
}

// Mutation Functions
export function submitGrantProposal(data: {
  project_title: string;
  sponsor_name: string;
  principal_investigator: string;
  co_investigators?: string[];
  department: string;
  grant_amount_inr: number;
  grant_type?: SponsoredGrant["grant_type"];
  deliverables?: string[];
  start_date?: string;
  end_date?: string;
}): SponsoredGrant {
  const grantToken = generateGrantToken();
  const newGrant: SponsoredGrant = {
    id: `grant-${Date.now()}`,
    project_title: data.project_title,
    sponsor_name: data.sponsor_name,
    grant_type: data.grant_type || "sponsored_research",
    principal_investigator: data.principal_investigator,
    co_investigators: data.co_investigators || [],
    department: data.department,
    grant_amount_inr: data.grant_amount_inr,
    disbursed_amount_inr: 0,
    grant_token: grantToken,
    milestones: [
      { title: "Literature Review & Architecture Definition", target_date: "2026-07-31", delivered: false, completion_pct: 0 },
      { title: "Mid-Term Prototyping & Laboratory Validation", target_date: "2026-11-30", delivered: false, completion_pct: 0 },
      { title: "Final Deliverables & Corporate Demonstration", target_date: "2027-03-31", delivered: false, completion_pct: 0 },
    ],
    deliverables: data.deliverables || ["Interim Technical Report", "Demonstrator Prototype"],
    status: "proposed",
    start_date: data.start_date || "2026-06-01",
    end_date: data.end_date || "2027-05-31",
    created_at: new Date().toISOString(),
  };

  grantsStore.unshift(newGrant);
  return newGrant;
}

export function requestTechLicense(data: {
  patent_title: string;
  patent_number?: string;
  licensee_org: string;
  trl_level: number;
  license_type: TechnologyLicense["license_type"];
  proposed_terms: string;
}): TechnologyLicense {
  const licensingToken = generateLicensingToken();
  const newLicense: TechnologyLicense = {
    id: `lic-${Date.now()}`,
    patent_title: data.patent_title,
    patent_number: data.patent_number || "IN-PAT-PENDING",
    inventors: ["Apex CampusLens Research Consortium"],
    licensee_org: data.licensee_org,
    licensing_token: licensingToken,
    trl_level: data.trl_level,
    license_type: data.license_type,
    royalty_terms: data.proposed_terms,
    upfront_fee_inr: 1000000,
    filing_date: new Date().toISOString().split("T")[0],
    status: "term_sheet",
    created_at: new Date().toISOString(),
  };

  licensesStore.unshift(newLicense);
  return newLicense;
}
