"use client";

import React, { useState } from "react";
import {
  LibraryBook,
  LibraryBorrowRecord,
  LibraryReservation,
  LibraryEResource,
  BookCategory,
} from "@/types";
import {
  MOCK_LIBRARY_BOOKS,
  MOCK_STUDENT_BORROW_RECORDS,
  MOCK_STUDENT_RESERVATIONS,
  MOCK_LIBRARY_E_RESOURCES,
  generateBorrowPassCode,
  generateReservationCode,
  calculateStudentLibrarySummary,
  aggregateInstitutionalLibraryStats,
  DEFAULT_LOAN_DURATION_DAYS,
} from "@/lib/library/library-engine";
import { LibraryStatsOverview } from "@/components/library/library-stats-overview";
import { BookCard } from "@/components/library/book-card";
import { BorrowedBooksTable } from "@/components/library/borrowed-books-table";
import { BookReservationModal } from "@/components/library/book-reservation-modal";
import { DigitalResourceCard } from "@/components/library/digital-resource-card";
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  X,
  BookmarkCheck,
  FileText,
  RotateCw,
  Clock,
  Sparkles,
  Layers,
  MapPin,
  QrCode,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LibraryPortalPage() {
  const [activeTab, setActiveTab] = useState<"catalog" | "my_loans" | "reservations" | "e_resources">("catalog");

  // State
  const [books, setBooks] = useState<LibraryBook[]>(MOCK_LIBRARY_BOOKS);
  const [loans, setLoans] = useState<LibraryBorrowRecord[]>(MOCK_STUDENT_BORROW_RECORDS);
  const [reservations, setReservations] = useState<LibraryReservation[]>(MOCK_STUDENT_RESERVATIONS);
  const [eResources] = useState<LibraryEResource[]>(MOCK_LIBRARY_E_RESOURCES);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [digitalOnly, setDigitalOnly] = useState(false);

  // Modal State
  const [activePassModal, setActivePassModal] = useState<{
    item: LibraryBorrowRecord | LibraryReservation;
    type: "borrow" | "reservation";
  } | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const studentId = "student-uuid-alex";
  const summary = calculateStudentLibrarySummary(studentId, loans, reservations);
  const stats = aggregateInstitutionalLibraryStats(books, loans, reservations, eResources);

  // Filter books
  const filteredBooks = books.filter((b) => {
    if (selectedCategory !== "all" && b.category !== selectedCategory) return false;
    if (availableOnly && b.available_copies <= 0) return false;
    if (digitalOnly && !b.is_digital_available) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = b.title.toLowerCase().includes(q);
      const matchAuthor = b.author.toLowerCase().includes(q);
      const matchIsbn = b.isbn.toLowerCase().includes(q);
      const matchCall = b.call_number.toLowerCase().includes(q);
      const matchShelf = b.shelf_location.toLowerCase().includes(q);
      return matchTitle || matchAuthor || matchIsbn || matchCall || matchShelf;
    }
    return true;
  });

  // Handle Borrow
  const handleBorrow = async (bookId: string) => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return;

    if (book.available_copies <= 0) {
      setToastMessage("All copies are currently checked out. You may place a reservation hold.");
      return;
    }

    if (summary.activeBorrowsCount >= 3) {
      setToastMessage("Borrowing limit reached (3 active loans allowed). Please return a book first.");
      return;
    }

    if (!summary.borrowingPrivilegeActive) {
      setToastMessage("Borrowing suspended due to pending overdue fines. Clear dues at Circulation Desk.");
      return;
    }

    const borrowedAt = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + DEFAULT_LOAN_DURATION_DAYS);
    const borrowCode = generateBorrowPassCode();

    const newLoan: LibraryBorrowRecord = {
      id: `brw-${crypto.randomUUID()}`,
      college_id: book.college_id,
      book_id: book.id,
      student_id: studentId,
      borrow_pass_code: borrowCode,
      borrowed_at: borrowedAt.toISOString(),
      due_date: dueDate.toISOString(),
      returned_at: null,
      renewal_count: 0,
      max_renewals: 2,
      fine_amount: 0.0,
      fine_paid: true,
      status: "active",
      book,
    };

    setLoans((prev) => [newLoan, ...prev]);
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, available_copies: b.available_copies - 1 } : b))
    );

    setToastMessage(`✓ Checked out "${book.title}"! Borrow code: ${borrowCode}. Due in 14 days.`);
    setActivePassModal({ item: newLoan, type: "borrow" });
  };

  // Handle Reserve Hold
  const handleReserve = async (bookId: string) => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return;

    const existingHold = reservations.find(
      (r) => r.book_id === bookId && (r.status === "queued" || r.status === "ready_for_pickup")
    );
    if (existingHold) {
      setToastMessage("You already have an active hold placed on this title.");
      return;
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    const resCode = generateReservationCode();

    const newRes: LibraryReservation = {
      id: `res-${crypto.randomUUID()}`,
      college_id: book.college_id,
      book_id: book.id,
      student_id: studentId,
      reservation_code: resCode,
      status: book.available_copies > 0 ? "ready_for_pickup" : "queued",
      reserved_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
      book,
    };

    setReservations((prev) => [newRes, ...prev]);
    setToastMessage(`✓ Reservation hold confirmed for "${book.title}"! Voucher code: ${resCode}.`);
    setActivePassModal({ item: newRes, type: "reservation" });
  };

  // Handle Renew Loan
  const handleRenewLoan = async (loanId: string) => {
    const loan = loans.find((l) => l.id === loanId);
    if (!loan) return;

    if (loan.renewal_count >= loan.max_renewals) {
      setToastMessage("Maximum renewal limit (2/2) reached for this item.");
      return;
    }

    const currentDue = new Date(loan.due_date);
    currentDue.setDate(currentDue.getDate() + DEFAULT_LOAN_DURATION_DAYS);

    setLoans((prev) =>
      prev.map((l) =>
        l.id === loanId
          ? {
              ...l,
              due_date: currentDue.toISOString(),
              renewal_count: l.renewal_count + 1,
              status: "active",
              fine_amount: 0.0,
            }
          : l
      )
    );

    setToastMessage(
      `✓ Loan renewed successfully! Extended by 14 days until ${currentDue.toLocaleDateString("en-IN")}.`
    );
  };

  // Cancel reservation
  const handleCancelReservation = (reservationId: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === reservationId ? { ...r, status: "cancelled" } : r))
    );
    setToastMessage("Reservation hold cancelled.");
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-foreground text-background shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="p-1 rounded-full hover:bg-background/20 transition-colors ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-xl bg-primary/10 text-primary">
              <BookOpen className="w-6 h-6" />
            </span>
            <Badge className="bg-primary/15 text-primary border-primary/20 font-bold text-xs uppercase tracking-wider">
              Phase 22 • Library & Commons
            </Badge>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            Smart Digital Library & Knowledge Commons
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse physical book stacks, manage active loans, reserve titles, and access institutional IEEE & Springer repositories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-muted/60 border border-border/60 text-xs flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Location:</span>
            <span className="font-semibold text-foreground">Sarabhai Knowledge Hub (LOC-LIB)</span>
          </div>
        </div>
      </div>

      {/* Telemetry Summary Cards */}
      <LibraryStatsOverview summary={summary} stats={stats} />

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border/60 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab("catalog")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs transition-all whitespace-nowrap ${
            activeTab === "catalog"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Search className="w-4 h-4" />
          Search Catalog
          <Badge className="ml-1.5 bg-muted text-muted-foreground text-[10px]">
            {filteredBooks.length}
          </Badge>
        </button>

        <button
          onClick={() => setActiveTab("my_loans")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs transition-all whitespace-nowrap ${
            activeTab === "my_loans"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <RotateCw className="w-4 h-4" />
          My Borrowed Books
          <Badge className="ml-1.5 bg-primary/10 text-primary text-[10px]">
            {summary.activeBorrowsCount}
          </Badge>
        </button>

        <button
          onClick={() => setActiveTab("reservations")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs transition-all whitespace-nowrap ${
            activeTab === "reservations"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookmarkCheck className="w-4 h-4" />
          Active Holds & Queue
          <Badge className="ml-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px]">
            {reservations.filter((r) => r.status === "queued" || r.status === "ready_for_pickup").length}
          </Badge>
        </button>

        <button
          onClick={() => setActiveTab("e_resources")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs transition-all whitespace-nowrap ${
            activeTab === "e_resources"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="w-4 h-4" />
          Digital E-Resources
          <Badge className="ml-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px]">
            {eResources.length}
          </Badge>
        </button>
      </div>

      {/* Tab 1: Book Catalog */}
      {activeTab === "catalog" && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl border border-border/60 bg-card">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by book title, author, ISBN, call number, or shelf rack..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-input bg-background text-xs placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Category Dropdown */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-10 rounded-xl border border-input bg-background px-3 text-xs focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">All Departments & Subjects</option>
                  <option value="computer_science">Computer Science</option>
                  <option value="electronics">Electronics & Comm</option>
                  <option value="mechanical">Mechanical Engg</option>
                  <option value="civil">Civil Engineering</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="physics">Applied Physics</option>
                  <option value="management">Management & Tech</option>
                  <option value="literature">Literature & Arts</option>
                  <option value="general">General Reference</option>
                </select>
              </div>

              {/* Toggles */}
              <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={(e) => setAvailableOnly(e.target.checked)}
                  className="rounded border-input text-primary focus:ring-primary/20"
                />
                Available Only
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={digitalOnly}
                  onChange={(e) => setDigitalOnly(e.target.checked)}
                  className="rounded border-input text-primary focus:ring-primary/20"
                />
                E-Resource Included
              </label>
            </div>
          </div>

          {/* Book Cards Grid */}
          {filteredBooks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center bg-card">
              <BookOpen className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
              <h4 className="font-bold text-foreground text-base">No Matching Books Found</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                Try adjusting your search criteria or clear category filters to view all cataloged volumes.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setAvailableOnly(false);
                  setDigitalOnly(false);
                }}
                className="mt-4 rounded-xl text-xs"
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onBorrow={handleBorrow}
                  onReserve={handleReserve}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Borrowed Books Ledger */}
      {activeTab === "my_loans" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-foreground text-base">Active & Historical Circulation Loans</h3>
              <p className="text-xs text-muted-foreground">
                Return items on or before the due date to avoid standard daily overdue fines (₹5/day).
              </p>
            </div>
          </div>

          <BorrowedBooksTable
            records={loans}
            onRenewLoan={handleRenewLoan}
            onViewPass={(rec) => setActivePassModal({ item: rec, type: "borrow" })}
          />
        </div>
      )}

      {/* Tab 3: Active Reservations & Holds */}
      {activeTab === "reservations" && (
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-foreground text-base">Book Reservation Queue</h3>
            <p className="text-xs text-muted-foreground">
              When loaned books are returned by other students, reservations advance automatically to &quot;Ready for Pickup&quot;.
            </p>
          </div>

          {reservations.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center bg-card">
              <BookmarkCheck className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
              <h4 className="font-bold text-foreground text-base">No Reservation Holds Placed</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                You currently have no queued holds. You can place a hold on any borrowed volume from the catalog.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reservations.map((res) => {
                const isReady = res.status === "ready_for_pickup";
                const isCancelled = res.status === "cancelled";

                return (
                  <div
                    key={res.id}
                    className={`rounded-2xl border p-5 bg-card flex flex-col justify-between shadow-sm ${
                      isReady
                        ? "border-emerald-500/40 bg-gradient-to-br from-emerald-500/5 via-card to-card"
                        : "border-border/60"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        {isReady ? (
                          <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-xs font-semibold">
                            ✓ Ready for Desk Pickup
                          </Badge>
                        ) : isCancelled ? (
                          <Badge className="bg-muted text-muted-foreground border-border/40 text-xs">
                            Cancelled
                          </Badge>
                        ) : (
                          <Badge className="bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30 text-xs font-semibold">
                            <Clock className="w-3 h-3 mr-1" />
                            Queued in Hold List
                          </Badge>
                        )}

                        <span className="font-mono text-[11px] font-bold text-foreground">
                          {res.reservation_code}
                        </span>
                      </div>

                      <h4 className="font-bold text-foreground text-sm line-clamp-2 leading-snug">
                        {res.book?.title || "Reserved Title"}
                      </h4>

                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        by {res.book?.author || "Author Unspecified"}
                      </p>

                      <div className="mt-4 pt-3 border-t border-border/50 text-xs space-y-1.5 text-muted-foreground">
                        <div className="flex items-center justify-between">
                          <span>Hold Placed:</span>
                          <span className="font-medium text-foreground">
                            {new Date(res.reserved_at).toLocaleDateString("en-IN")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Pickup Shelf:</span>
                          <span className="font-medium text-foreground">
                            {res.book?.shelf_location || "Central Reserve Counter"}
                          </span>
                        </div>
                        {res.expires_at && (
                          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 font-semibold">
                            <span>Hold Deadline:</span>
                            <span>{new Date(res.expires_at).toLocaleDateString("en-IN")}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-border/50 flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setActivePassModal({ item: res, type: "reservation" })}
                        className="rounded-xl flex-1 text-xs h-8 text-primary border-primary/30"
                      >
                        <QrCode className="w-3.5 h-3.5 mr-1" />
                        Hold Voucher
                      </Button>

                      {!isCancelled && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCancelReservation(res.id)}
                          className="rounded-xl text-xs h-8 text-muted-foreground hover:text-red-500"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Digital E-Resources */}
      {activeTab === "e_resources" && (
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-foreground text-base">Institutional Digital Repository & E-Journals</h3>
            <p className="text-xs text-muted-foreground">
              Peer-reviewed engineering research journals, IEEE conference proceedings, and faculty lecture open monographs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {eResources.map((res) => (
              <DigitalResourceCard key={res.id} resource={res} />
            ))}
          </div>
        </div>
      )}

      {/* Voucher Modal */}
      {activePassModal && (
        <BookReservationModal
          item={activePassModal.item}
          type={activePassModal.type}
          onClose={() => setActivePassModal(null)}
        />
      )}
    </div>
  );
}
