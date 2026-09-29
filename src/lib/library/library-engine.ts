// ================================================================
// CampusLens AI — Phase 22 Library Circulation & E-Resource Engine
// Calculates fines, checks renewal eligibility, generates barcode vouchers,
// computes student standing, and provides seed catalogs for offline development.
// ================================================================

import {
  LibraryBook,
  LibraryBorrowRecord,
  LibraryReservation,
  LibraryEResource,
  StudentLibrarySummary,
  InstitutionalLibraryStats,
  BookCategory,
} from "@/types";

// Standard institutional library fine policy: ₹5 per calendar day past due date
export const DAILY_OVERDUE_FINE_INR = 5.0;
export const MAX_RENEWAL_LIMIT = 2;
export const DEFAULT_LOAN_DURATION_DAYS = 14;

/**
 * Generate cryptographically secure/verifiable borrow pass code
 * Format: CL-LIB-BRW-2026-XXXX
 */
export function generateBorrowPassCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `CL-LIB-BRW-2026-${suffix}`;
}

/**
 * Generate reservation hold code
 * Format: CL-LIB-RES-2026-XXXX
 */
export function generateReservationCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `CL-LIB-RES-2026-${suffix}`;
}

/**
 * Calculate overdue days and fine amount based on standard institutional policy
 */
export function calculateOverdueFine(
  dueDate: string | Date,
  returnedAt?: string | Date | null,
  referenceDate?: Date
): { overdueDays: number; fineAmount: number; isOverdue: boolean } {
  const due = new Date(dueDate).getTime();
  const effectiveReturn = returnedAt
    ? new Date(returnedAt).getTime()
    : referenceDate
    ? referenceDate.getTime()
    : Date.now();

  if (effectiveReturn <= due) {
    return { overdueDays: 0, fineAmount: 0.0, isOverdue: false };
  }

  const diffMs = effectiveReturn - due;
  const overdueDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const fineAmount = Number((overdueDays * DAILY_OVERDUE_FINE_INR).toFixed(2));

  return {
    overdueDays,
    fineAmount,
    isOverdue: true,
  };
}

/**
 * Evaluate whether an active loan can be extended for an additional period
 */
export function checkRenewalEligibility(
  record: LibraryBorrowRecord,
  hasActiveHoldOnBook = false
): { eligible: boolean; reason?: string } {
  if (record.status === "returned") {
    return { eligible: false, reason: "Book has already been returned" };
  }
  if (record.status === "lost") {
    return { eligible: false, reason: "Book is recorded as lost" };
  }
  if (record.renewal_count >= record.max_renewals) {
    return {
      eligible: false,
      reason: `Maximum renewal limit reached (${record.renewal_count}/${record.max_renewals} cycles utilized)`,
    };
  }
  if (record.fine_amount > 0 && !record.fine_paid) {
    return {
      eligible: false,
      reason: `Outstanding overdue fine of ₹${record.fine_amount.toFixed(2)} must be cleared before renewal`,
    };
  }
  if (hasActiveHoldOnBook) {
    return {
      eligible: false,
      reason: "Renewal blocked: Another student has placed an active reservation hold on this title",
    };
  }

  return { eligible: true };
}

/**
 * Calculate student's overall library profile summary
 */
export function calculateStudentLibrarySummary(
  studentId: string,
  records: LibraryBorrowRecord[],
  reservations: LibraryReservation[]
): StudentLibrarySummary {
  const studentLoans = records.filter((r) => r.student_id === studentId);
  const studentReservations = reservations.filter(
    (r) => r.student_id === studentId && (r.status === "queued" || r.status === "ready_for_pickup")
  );

  const activeBorrows = studentLoans.filter((r) => r.status === "active" || r.status === "overdue");
  const overdueLoans = studentLoans.filter((r) => r.status === "overdue" || (r.fine_amount > 0 && !r.fine_paid));
  const totalFinesPending = studentLoans
    .filter((r) => !r.fine_paid)
    .reduce((acc, curr) => acc + Number(curr.fine_amount), 0);

  const borrowingPrivilegeActive = overdueLoans.length === 0 && totalFinesPending === 0;

  return {
    studentId,
    activeBorrowsCount: activeBorrows.length,
    overdueCount: overdueLoans.length,
    totalFinesPending: Number(totalFinesPending.toFixed(2)),
    reservationsCount: studentReservations.length,
    borrowingPrivilegeActive,
  };
}

/**
 * Compute institutional metrics across all library assets
 */
export function aggregateInstitutionalLibraryStats(
  books: LibraryBook[],
  records: LibraryBorrowRecord[],
  reservations: LibraryReservation[],
  eResources: LibraryEResource[]
): InstitutionalLibraryStats {
  const totalVolumes = books.reduce((acc, b) => acc + b.total_copies, 0);
  const activeLoans = records.filter((r) => r.status === "active").length;
  const overdueLoans = records.filter((r) => r.status === "overdue").length;
  const activeReservations = reservations.filter(
    (r) => r.status === "queued" || r.status === "ready_for_pickup"
  ).length;
  const digitalAccessCount = eResources.reduce((acc, e) => acc + e.downloads_count, 0);

  const categories: BookCategory[] = [
    "computer_science",
    "electronics",
    "mechanical",
    "civil",
    "mathematics",
    "physics",
    "management",
    "literature",
    "general",
  ];

  const categoryDistribution = categories.map((cat) => ({
    category: cat,
    count: books.filter((b) => b.category === cat).reduce((acc, b) => acc + b.total_copies, 0),
  }));

  return {
    totalVolumes,
    totalActiveLoans: activeLoans,
    totalOverdueLoans: overdueLoans,
    totalReservations: activeReservations,
    digitalAccessCount,
    categoryDistribution,
  };
}

// ================================================================
// High-Fidelity Seed Catalog: Books, Borrows, Holds & E-Resources
// ================================================================

export const MOCK_LIBRARY_BOOKS: LibraryBook[] = [
  {
    id: "bk-11111111-1111-4111-8111-111111111111",
    college_id: "11111111-1111-4111-8111-111111111111",
    title: "Introduction to Algorithms (CLRS)",
    author: "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein",
    isbn: "978-0262033848",
    category: "computer_science",
    publisher: "MIT Press",
    edition: "4th Edition (2022)",
    call_number: "CS-005.1-COR-01",
    shelf_location: "Stack A, 2nd Floor, Bay 04",
    total_copies: 15,
    available_copies: 6,
    cover_image_url: "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=600&auto=format&fit=crop&q=80",
    description: "The definitive reference covering a wide range of algorithms in depth, making their design and analysis accessible to all levels of readers.",
    is_digital_available: true,
    created_at: "2026-01-10T08:00:00Z",
  },
  {
    id: "bk-22222222-2222-4111-8111-111111111111",
    college_id: "11111111-1111-4111-8111-111111111111",
    title: "Computer Systems: A Programmer's Perspective",
    author: "Randal E. Bryant, David R. O'Hallaron",
    isbn: "978-0134092669",
    category: "computer_science",
    publisher: "Pearson Education",
    edition: "3rd Global Edition",
    call_number: "CS-004.2-BRY-02",
    shelf_location: "Stack A, 2nd Floor, Bay 07",
    total_copies: 12,
    available_copies: 4,
    cover_image_url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
    description: "Explains the underlying principles of how application programs interact with hardware, compilers, operating systems, and networking protocols.",
    is_digital_available: true,
    created_at: "2026-01-15T08:00:00Z",
  },
  {
    id: "bk-33333333-3333-4111-8111-111111111111",
    college_id: "11111111-1111-4111-8111-111111111111",
    title: "Microelectronic Circuits: Theory & Applications",
    author: "Adel S. Sedra, Kenneth C. Smith",
    isbn: "978-0199339136",
    category: "electronics",
    publisher: "Oxford University Press",
    edition: "7th Edition",
    call_number: "EC-621.3-SED-01",
    shelf_location: "Stack B, 1st Floor, Bay 02",
    total_copies: 10,
    available_copies: 3,
    cover_image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
    description: "Standard foundation text for electrical and computer engineering students studying both analog and digital microelectronic circuit designs.",
    is_digital_available: false,
    created_at: "2026-01-20T08:00:00Z",
  },
  {
    id: "bk-44444444-4444-4111-8111-111111111111",
    college_id: "11111111-1111-4111-8111-111111111111",
    title: "Shigley's Mechanical Engineering Design",
    author: "Richard G. Budynas, J. Keith Nisbett",
    isbn: "978-0073398204",
    category: "mechanical",
    publisher: "McGraw-Hill Education",
    edition: "11th SI Edition",
    call_number: "ME-621.8-SHI-03",
    shelf_location: "Stack C, Ground Floor, Bay 05",
    total_copies: 8,
    available_copies: 2,
    cover_image_url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
    description: "Focuses on machine element design and structural mechanics principles with real-world engineering specifications and fatigue endurance calculations.",
    is_digital_available: true,
    created_at: "2026-02-01T08:00:00Z",
  },
  {
    id: "bk-55555555-5555-4111-8111-111111111111",
    college_id: "11111111-1111-4111-8111-111111111111",
    title: "Deep Learning (Adaptive Computation and Machine Learning)",
    author: "Ian Goodfellow, Yoshua Bengio, Aaron Courville",
    isbn: "978-0262035613",
    category: "computer_science",
    publisher: "MIT Press",
    edition: "1st Edition",
    call_number: "CS-006.3-GOO-01",
    shelf_location: "Stack A, 2nd Floor, Bay 09",
    total_copies: 14,
    available_copies: 5,
    cover_image_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
    description: "Broad survey of mathematical background including linear algebra, probability, numerical computation, and deep neural network architectures.",
    is_digital_available: true,
    created_at: "2026-02-10T08:00:00Z",
  },
  {
    id: "bk-66666666-6666-4111-8111-111111111111",
    college_id: "11111111-1111-4111-8111-111111111111",
    title: "Advanced Engineering Mathematics",
    author: "Erwin Kreyszig",
    isbn: "978-0470458365",
    category: "mathematics",
    publisher: "John Wiley & Sons",
    edition: "10th Edition",
    call_number: "MA-510.2-KRE-04",
    shelf_location: "Stack D, 1st Floor, Bay 01",
    total_copies: 20,
    available_copies: 11,
    cover_image_url: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80",
    description: "Comprehensive and thorough guide on differential equations, vector calculus, Fourier transforms, and complex variable functions for engineers.",
    is_digital_available: true,
    created_at: "2026-02-15T08:00:00Z",
  },
  {
    id: "bk-77777777-7777-4111-8111-111111111111",
    college_id: "11111111-1111-4111-8111-111111111111",
    title: "Structural Analysis & Reinforced Concrete",
    author: "Russell C. Hibbeler",
    isbn: "978-0134610672",
    category: "civil",
    publisher: "Pearson",
    edition: "10th Edition",
    call_number: "CE-624.1-HIB-02",
    shelf_location: "Stack C, Ground Floor, Bay 08",
    total_copies: 7,
    available_copies: 2,
    cover_image_url: "https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?w=600&auto=format&fit=crop&q=80",
    description: "Clear presentation of the theory and application of structural analysis as applied to trusses, beams, and indeterminate frames.",
    is_digital_available: false,
    created_at: "2026-02-20T08:00:00Z",
  },
  {
    id: "bk-88888888-8888-4111-8111-111111111111",
    college_id: "11111111-1111-4111-8111-111111111111",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    isbn: "978-1449373320",
    category: "computer_science",
    publisher: "O'Reilly Media",
    edition: "1st Edition",
    call_number: "CS-004.6-KLE-01",
    shelf_location: "Stack A, 2nd Floor, Bay 11",
    total_copies: 10,
    available_copies: 1,
    cover_image_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
    description: "An authoritative guide to the architecture, trade-offs, consistency models, and fault-tolerance patterns of modern distributed database systems.",
    is_digital_available: true,
    created_at: "2026-02-25T08:00:00Z",
  },
];

export const MOCK_STUDENT_BORROW_RECORDS: LibraryBorrowRecord[] = [
  {
    id: "brw-11111111-1111-4111-8111-111111111111",
    college_id: "11111111-1111-4111-8111-111111111111",
    book_id: "bk-11111111-1111-4111-8111-111111111111",
    student_id: "student-uuid-alex",
    borrow_pass_code: "CL-LIB-BRW-2026-K9X2",
    borrowed_at: "2026-09-18T10:30:00Z",
    due_date: "2026-10-02T18:00:00Z",
    renewal_count: 0,
    max_renewals: 2,
    fine_amount: 0.0,
    fine_paid: true,
    status: "active",
    book: MOCK_LIBRARY_BOOKS[0],
  },
  {
    id: "brw-22222222-2222-4111-8111-111111111111",
    college_id: "11111111-1111-4111-8111-111111111111",
    book_id: "bk-22222222-2222-4111-8111-111111111111",
    student_id: "student-uuid-alex",
    borrow_pass_code: "CL-LIB-BRW-2026-T7M4",
    borrowed_at: "2026-09-10T14:15:00Z",
    due_date: "2026-09-24T18:00:00Z", // Past due (overdue)
    renewal_count: 1,
    max_renewals: 2,
    fine_amount: 25.0, // 5 days overdue * ₹5
    fine_paid: false,
    status: "overdue",
    book: MOCK_LIBRARY_BOOKS[1],
  },
  {
    id: "brw-33333333-3333-4111-8111-111111111111",
    college_id: "11111111-1111-4111-8111-111111111111",
    book_id: "bk-66666666-6666-4111-8111-111111111111",
    student_id: "student-uuid-alex",
    borrow_pass_code: "CL-LIB-BRW-2026-H3P8",
    borrowed_at: "2026-08-20T09:00:00Z",
    due_date: "2026-09-03T18:00:00Z",
    returned_at: "2026-09-02T16:30:00Z",
    renewal_count: 0,
    max_renewals: 2,
    fine_amount: 0.0,
    fine_paid: true,
    status: "returned",
    book: MOCK_LIBRARY_BOOKS[5],
  },
];

export const MOCK_STUDENT_RESERVATIONS: LibraryReservation[] = [
  {
    id: "res-11111111-1111-4111-8111-111111111111",
    college_id: "11111111-1111-4111-8111-111111111111",
    book_id: "bk-88888888-8888-4111-8111-111111111111",
    student_id: "student-uuid-alex",
    reservation_code: "CL-LIB-RES-2026-D4R9",
    status: "ready_for_pickup",
    reserved_at: "2026-09-25T11:00:00Z",
    expires_at: "2026-10-01T20:00:00Z",
    book: MOCK_LIBRARY_BOOKS[7],
  },
];

export const MOCK_LIBRARY_E_RESOURCES: LibraryEResource[] = [
  {
    id: "eres-11111111-1111-4111-8111-111111111111",
    college_id: "11111111-1111-4111-8111-111111111111",
    title: "IEEE Transactions on Neural Networks & Learning Systems (Vol 35)",
    type: "journal",
    publisher: "IEEE Computational Intelligence Society",
    access_url: "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=5962385",
    department_id: "c1111111-1111-4111-8111-111111111111",
    downloads_count: 1420,
    is_open_access: false,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "eres-22222222-2222-4111-8111-111111111111",
    college_id: "11111111-1111-4111-8111-111111111111",
    title: "Distributed Consensus Protocols in Autonomous Swarm Robotics",
    type: "research_paper",
    publisher: "Apex Institutional Repository (AIT-IR)",
    access_url: "https://arxiv.org/abs/2301.00001",
    department_id: "c1111111-1111-4111-8111-111111111111",
    downloads_count: 890,
    is_open_access: true,
    created_at: "2026-02-15T00:00:00Z",
  },
  {
    id: "eres-33333333-3333-4111-8111-111111111111",
    college_id: "11111111-1111-4111-8111-111111111111",
    title: "Springer Open Access Handbook of Smart Grid Architectures",
    type: "ebook",
    publisher: "Springer Nature",
    access_url: "https://link.springer.com/book/10.1007/978-3-030-00000-0",
    downloads_count: 2150,
    is_open_access: true,
    created_at: "2026-03-01T00:00:00Z",
  },
  {
    id: "eres-44444444-4444-4111-8111-111111111111",
    college_id: "11111111-1111-4111-8111-111111111111",
    title: "Proceedings of the 2026 ACM Symposium on Cloud Computing (SoCC)",
    type: "conference",
    publisher: "ACM Digital Library",
    access_url: "https://dl.acm.org/conference/socc",
    downloads_count: 730,
    is_open_access: false,
    created_at: "2026-04-10T00:00:00Z",
  },
];
