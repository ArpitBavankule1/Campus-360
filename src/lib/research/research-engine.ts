// ================================================================
// CampusLens AI — Phase 28: Research Publications & Innovation Hub Engine
// Business logic, patent registration codes, and academic research portfolios
// ================================================================

import {
  ResearchPublication,
  ResearchGrant,
  PatentApplication,
  InnovationStartup,
  ResearchOverviewStats,
} from "@/types";

export function generatePatentAppNumber(iprType: string = "Patent"): string {
  const prefix = iprType.substring(0, 3).toUpperCase() || "PAT";
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CL-IPR-${prefix}-2026-${randomSuffix}`;
}

export function calculateResearchOverview(
  publications: ResearchPublication[] = MOCK_PUBLICATIONS,
  grants: ResearchGrant[] = MOCK_GRANTS,
  patents: PatentApplication[] = MOCK_PATENTS,
  startups: InnovationStartup[] = MOCK_STARTUPS
): ResearchOverviewStats {
  const totalPublications = publications.length;
  const totalCitations = publications.reduce((acc, p) => acc + p.citation_count, 0);
  const totalGrantFunding = grants.reduce((acc, g) => acc + Number(g.total_grant_amount), 0);
  const totalPatentsFiled = patents.length;
  const incubatedStartupsCount = startups.length;

  return {
    totalPublications,
    totalCitations,
    totalGrantFunding,
    totalPatentsFiled,
    incubatedStartupsCount,
    publications,
    grants,
    patents,
    startups,
  };
}

export const MOCK_PUBLICATIONS: ResearchPublication[] = [
  {
    id: "pub-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    title: "Zero-Latency Transformer Quantization on Edge Micro-Controllers for Autonomous Micro-Aerial Vehicles",
    authors: ["Dr. Rajeshwar Rao", "Arpit Bavankule", "Dr. Shalini Gupta"],
    department: "Computer Science & Engineering",
    journal_or_conference: "IEEE Transactions on Pattern Analysis and Machine Intelligence (TPAMI)",
    publication_date: "2026-04-15",
    doi: "10.1109/TPAMI.2026.3190241",
    citation_count: 42,
    indexing: "IEEE Xplore",
    open_access: true,
    abstract: "We introduce a novel 2-bit integer post-training quantization framework that achieves a 4.8x acceleration in attention weight matrix multiplication on ARM Cortex-M85 microcontrollers with negligible perplexity degradation.",
    pdf_url: "https://ieeexplore.ieee.org/document/mock-pub-01",
    created_at: "2026-04-15T09:00:00Z",
  },
  {
    id: "pub-22222222-2222-4111-8111-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    title: "High-Efficiency Perovskite-Silicon Tandem Solar Photovoltaics with Graphene Passivation Layers",
    authors: ["Dr. Sunita Kulkarni", "Prof. Kevin Vance", "Pooja Hegde"],
    department: "Electronics & Communication",
    journal_or_conference: "Nature Energy (Springer Nature)",
    publication_date: "2026-03-20",
    doi: "10.1038/s41560-026-01290-x",
    citation_count: 89,
    indexing: "Springer",
    open_access: true,
    abstract: "Demonstrating a certified 33.8% power conversion efficiency in tandem photovoltaic cells utilizing single-layer functionalized graphene interface diffusion barriers under continuous 1,000-hour thermal stress testing.",
    pdf_url: "https://nature.com/articles/mock-pub-02",
    created_at: "2026-03-20T11:30:00Z",
  },
  {
    id: "pub-33333333-3333-4111-8111-333333333333",
    college_id: "c1111111-1111-4111-8111-111111111111",
    title: "Autonomous Closed-Loop Deep Brain Stimulation via Adaptive Neuromorphic Spiking Neural Ensembles",
    authors: ["Dr. Aniruddh Joshi", "Meera Sanyal"],
    department: "Biomedical & AI Engineering",
    journal_or_conference: "ACM Transactions on Computing for Healthcare",
    publication_date: "2026-02-10",
    doi: "10.1145/3591823",
    citation_count: 27,
    indexing: "ACM",
    open_access: false,
    abstract: "An ultra-low power sub-milliwatt neuromorphic processor detecting early electrophysiological biomarkers of Parkinsonian tremors with 98.4% specificity, dynamically modulating pulse stimulation amplitude.",
    pdf_url: "https://dl.acm.org/doi/mock-pub-03",
    created_at: "2026-02-10T14:00:00Z",
  }
];

export const MOCK_GRANTS: ResearchGrant[] = [
  {
    id: "grn-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    project_title: "National Quantum Teleportation & Cryogenic CMOS Qubit Control Infrastructure",
    principal_investigator: "Dr. Rajeshwar Rao",
    co_pis: ["Dr. Shalini Gupta", "Dr. Vikram Seth"],
    funding_agency: "DST",
    total_grant_amount: 32000000,
    disbursed_amount: 21500000,
    start_date: "2025-04-01",
    end_date: "2028-03-31",
    milestone_status: "ongoing",
    deliverables_summary: "Installation of 10mK Dilution Refrigerator and fabrication of 16-qubit superconducting silicon testbed.",
    created_at: "2025-04-01T10:00:00Z",
  },
  {
    id: "grn-22222222-2222-4111-8111-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    project_title: "High-Temperature Ceramic Matrix Composites for Hypersonic Aerospace Thermal Protection",
    principal_investigator: "Prof. Arvind Trivedi",
    co_pis: ["Dr. Meenakshi Sundaram"],
    funding_agency: "ISRO",
    total_grant_amount: 18500000,
    disbursed_amount: 14000000,
    start_date: "2025-08-01",
    end_date: "2027-07-31",
    milestone_status: "ongoing",
    deliverables_summary: "Oxy-acetylene torch ablation testing at 2,200°C for reusable launch vehicle leading-edge prototypes.",
    created_at: "2025-08-01T12:00:00Z",
  }
];

export const MOCK_PATENTS: PatentApplication[] = [
  {
    id: "pat-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    title: "Self-Healing Solid-State Lithium Metal Electrolyte Membrane with Silicate Nanotube Scaffolding",
    inventors: ["Dr. Sunita Kulkarni", "Arpit Bavankule", "Rohan Singhania"],
    application_number: "CL-IPR-PAT-2026-8912",
    filing_date: "2026-01-20",
    status: "published",
    ipr_type: "Patent",
    abstract: "A dendrite-impermeable composite ceramic electrolyte demonstrating 10^3 S/cm ionic conductivity at ambient temperature with intrinsic microcrack self-healing over 1,200 discharge cycles.",
    commercial_partner: "VoltDrive Energy Systems",
    created_at: "2026-01-20T10:00:00Z",
  },
  {
    id: "pat-22222222-2222-4111-8111-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    title: "Non-Invasive Continuous Blood Glucose Sensing Radar via Photonic Crystal Terahertz Resonators",
    inventors: ["Dr. Aniruddh Joshi", "Aditi Deshmukh"],
    application_number: "CL-IPR-PAT-2026-4401",
    filing_date: "2026-03-04",
    status: "filed",
    ipr_type: "Patent",
    abstract: "A wearable wrist-worn millimeter-wave photonic radar detecting transdermal dielectric resonance shifts with clinical accuracy matching venous enzymatic blood draws.",
    commercial_partner: "Apollo HealthTech Research",
    created_at: "2026-03-04T11:00:00Z",
  }
];

export const MOCK_STARTUPS: InnovationStartup[] = [
  {
    id: "stp-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    startup_name: "AeroPulse Autonomous Avionics",
    founder_name: "Tanmay Bapat & Team",
    founder_role: "student",
    sector: "Robotics",
    funding_stage: "Seed Funded",
    incubation_space: "T-Hub Maker Lab Suite 12",
    seed_grant_awarded: 2500000,
    pitch_deck_url: "https://campuslens.ai/startups/aeropulse-deck.pdf",
    website_url: "https://aeropulse-robotics.tech",
    description: "Developing heavy-payload electric autonomous drones equipped with multi-spectral LiDAR for precision agricultural crop canopy disease detection.",
    created_at: "2026-01-15T09:00:00Z",
  },
  {
    id: "stp-22222222-2222-4111-8111-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    startup_name: "NeuraMed Cognitive Therapeutics",
    founder_name: "Dr. Aniruddh Joshi",
    founder_role: "faculty",
    sector: "HealthTech",
    funding_stage: "Prototype",
    incubation_space: "Biotech Cleanroom B2",
    seed_grant_awarded: 1500000,
    pitch_deck_url: "https://campuslens.ai/startups/neuramed-deck.pdf",
    website_url: "https://neuramed-ai.org",
    description: "AI-guided non-invasive transcranial neuro-stimulation headsets improving post-stroke motor skill rehabilitation in geriatric patients.",
    created_at: "2026-02-01T14:30:00Z",
  }
];
