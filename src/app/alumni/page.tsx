"use client";

import React, { useState } from "react";
import {
  AlumniProfile,
  AlumniMentorshipSession,
  AlumniJobReferral,
  AlumniDonation,
  AlumniDigitalPass,
  DonationCampaign,
} from "@/types";
import {
  MOCK_ALUMNI,
  MOCK_MENTORSHIPS,
  MOCK_JOB_REFERRALS,
  MOCK_DONATIONS,
  MOCK_ALUMNI_PASSES,
  calculateAlumniOverview,
} from "@/lib/alumni/alumni-engine";
import { AlumniProfileCard } from "@/components/alumni/alumni-profile-card";
import { MentorshipBookingModal } from "@/components/alumni/mentorship-booking-modal";
import { JobReferralCard } from "@/components/alumni/job-referral-card";
import { DonationCampaignCard } from "@/components/alumni/donation-campaign-card";
import { AlumniPassModal } from "@/components/alumni/alumni-pass-modal";
import {
  Sparkles,
  Users,
  Briefcase,
  Heart,
  QrCode,
  Search,
  CheckCircle2,
  Calendar,
  Building2,
  GraduationCap,
  Video,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AlumniPortalPage() {
  const [activeTab, setActiveTab] = useState<
    "directory" | "mentorship" | "jobs" | "donations" | "pass"
  >("directory");

  // State
  const [alumniList, setAlumniList] = useState<AlumniProfile[]>(MOCK_ALUMNI);
  const [mentorships, setMentorships] = useState<AlumniMentorshipSession[]>(MOCK_MENTORSHIPS);
  const [jobReferrals, setJobReferrals] = useState<AlumniJobReferral[]>(MOCK_JOB_REFERRALS);
  const [donations, setDonations] = useState<AlumniDonation[]>(MOCK_DONATIONS);
  const [passes] = useState<AlumniDigitalPass[]>(MOCK_ALUMNI_PASSES);

  // Modals & Selection
  const [bookingAlumni, setBookingAlumni] = useState<AlumniProfile | null>(null);
  const [selectedPass, setSelectedPass] = useState<AlumniDigitalPass | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [mentorshipOnly, setMentorshipOnly] = useState(false);

  // Derived Overview
  const overview = calculateAlumniOverview(
    alumniList,
    mentorships,
    jobReferrals,
    donations
  );

  const filteredAlumni = alumniList.filter((a) => {
    const matchesIndustry =
      selectedIndustry === "all" ||
      a.industry.toLowerCase().includes(selectedIndustry.toLowerCase());
    const matchesMentorship = !mentorshipOnly || a.mentorship_available;
    const matchesSearch =
      !searchQuery.trim() ||
      a.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.current_role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesIndustry && matchesMentorship && matchesSearch;
  });

  const handleBookingSuccess = (newSession: AlumniMentorshipSession) => {
    setMentorships((prev) => [newSession, ...prev]);
    setActiveTab("mentorship");
  };

  const handleDonateCampaign = async (campaignId: DonationCampaign, amount: number) => {
    try {
      const res = await fetch("/api/alumni/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donor_name: "Arpit Bavankule",
          donor_email: "arpit.student@campuslens.edu",
          graduating_year: 2026,
          campaign: campaignId,
          amount,
          is_anonymous: false,
          message: "Proud to support institutional advancement!",
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setDonations((prev) => [data.data, ...prev]);
      }
    } catch (err) {
      console.error("Donation error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card/90 to-primary/10 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Phase 26 • Global Alumni Network & Mentorship Nexus</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Connect With World-Class Collegiate Alumni
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Book verified 1-on-1 career mentorships, access exclusive FAANG & startup job referrals, participate in institutional endowment giving, and carry your lifelong digital alumni pass.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Button
              size="sm"
              onClick={() => setSelectedPass(passes[0])}
              className="rounded-2xl gap-2 text-xs shadow-md bg-gradient-to-r from-primary to-primary/80"
            >
              <QrCode className="w-4 h-4" />
              My Alumni Pass
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab("jobs")}
              className="rounded-2xl gap-2 text-xs border-border"
            >
              <Briefcase className="w-4 h-4" />
              Referral Board
            </Button>
          </div>
        </div>

        {/* Telemetry Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-border/60">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-500" />
              Global Alumni
            </p>
            <p className="text-xl sm:text-2xl font-black text-foreground">
              1,420+
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              Active Mentors
            </p>
            <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {overview.activeMentors} Leaders
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-amber-500" />
              Open Referrals
            </p>
            <p className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">
              {overview.activeReferrals} Positions
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              Endowment Raised
            </p>
            <p className="text-xl sm:text-2xl font-black text-foreground">
              ₹{(overview.totalDonationsRaised / 100000).toFixed(1)} Lakhs
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border/80 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("directory")}
          className={`px-4 py-2.5 text-xs font-semibold rounded-2xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "directory"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Alumni Directory ({filteredAlumni.length})
        </button>

        <button
          onClick={() => setActiveTab("mentorship")}
          className={`px-4 py-2.5 text-xs font-semibold rounded-2xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "mentorship"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          Mentorship Sessions ({mentorships.length})
        </button>

        <button
          onClick={() => setActiveTab("jobs")}
          className={`px-4 py-2.5 text-xs font-semibold rounded-2xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "jobs"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          Job & Referral Board ({jobReferrals.length})
        </button>

        <button
          onClick={() => setActiveTab("donations")}
          className={`px-4 py-2.5 text-xs font-semibold rounded-2xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "donations"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          Endowment Giving
        </button>

        <button
          onClick={() => setActiveTab("pass")}
          className={`px-4 py-2.5 text-xs font-semibold rounded-2xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "pass"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          Alumni Digital Pass
        </button>
      </div>

      {/* Tab 1: Directory */}
      {activeTab === "directory" && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search alumni by name, company, or role..."
                className="w-full text-xs rounded-2xl border border-input bg-card pl-9 pr-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="text-xs rounded-2xl border border-input bg-card px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              >
                <option value="all">All Industries</option>
                <option value="intelligence">Artificial Intelligence</option>
                <option value="hardware">Hardware & Silicon</option>
                <option value="fintech">Fintech & Product</option>
                <option value="cleantech">CleanTech & Robotics</option>
              </select>

              <button
                type="button"
                onClick={() => setMentorshipOnly(!mentorshipOnly)}
                className={`text-xs px-3 py-2 rounded-2xl border transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  mentorshipOnly
                    ? "bg-primary/10 border-primary text-primary font-semibold"
                    : "bg-card border-input text-muted-foreground hover:text-foreground"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Mentors Only
              </button>
            </div>
          </div>

          {/* Alumni Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAlumni.map((alumni) => (
              <AlumniProfileCard
                key={alumni.id}
                alumni={alumni}
                onBookMentorship={(alm) => setBookingAlumni(alm)}
                onRequestReferral={() => setActiveTab("jobs")}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Mentorship Sessions */}
      {activeTab === "mentorship" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Your 1-on-1 Mentorship Sessions
              </h3>
              <p className="text-xs text-muted-foreground">
                Confirmed virtual guidance slots with alumni leaders
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setActiveTab("directory")}
              className="rounded-2xl text-xs gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              Schedule New Session
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mentorships.map((session) => (
              <div
                key={session.id}
                className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20">
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground capitalize">
                        {session.topic.replace("_", " ")}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        with {session.alumni?.full_name || "Alumni Mentor"} ({session.alumni?.company || "Tech"})
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 capitalize">
                    {session.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground p-3 rounded-2xl bg-muted/40 border border-border/40">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <span>{new Date(session.scheduled_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{session.duration_minutes} Mins Duration</span>
                  </div>
                </div>

                {session.notes && (
                  <p className="text-xs text-muted-foreground/90 italic">
                    "{session.notes}"
                  </p>
                )}

                {session.meeting_url && (
                  <div className="pt-2 border-t border-border/40 flex justify-end">
                    <a
                      href={session.meeting_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all"
                    >
                      <Video className="w-3.5 h-3.5" />
                      Join Google Meet
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Jobs & Referrals */}
      {activeTab === "jobs" && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Alumni Fast-Track Job & Internship Referrals
            </h3>
            <p className="text-xs text-muted-foreground">
              Direct recruitment opportunities submitted exclusively for scholars by alumni
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobReferrals.map((referral) => (
              <JobReferralCard key={referral.id} referral={referral} />
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Donations & Giving */}
      {activeTab === "donations" && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Institutional Endowment & Scholarship Giving
            </h3>
            <p className="text-xs text-muted-foreground">
              Contribute toward student hardship funds, STEM research, and advanced prototyping facilities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <DonationCampaignCard
              campaignId="stem_scholarship"
              title="Merit Women in STEM Scholarship"
              categoryName="Scholarships"
              description="Empowers deserving undergraduate women scholars in computing, robotics, and aerospace engineering."
              targetAmount={1000000}
              raisedAmount={500000}
              donorCount={14}
              onDonate={handleDonateCampaign}
            />
            <DonationCampaignCard
              campaignId="innovation_lab"
              title="Autonomous Maker & Robotics Lab"
              categoryName="Infrastructure"
              description="Supplies high-precision 5-axis CNC routers, LiDAR sensors, and edge AI compute clusters for student hardware teams."
              targetAmount={2500000}
              raisedAmount={1500000}
              donorCount={8}
              onDonate={handleDonateCampaign}
            />
            <DonationCampaignCard
              campaignId="hardship_fund"
              title="Emergency Scholar Hardship Fund"
              categoryName="Student Welfare"
              description="Rapid-disbursement tuition and living stipend support for scholars facing sudden family or medical hardships."
              targetAmount={500000}
              raisedAmount={250000}
              donorCount={32}
              onDonate={handleDonateCampaign}
            />
          </div>
        </div>
      )}

      {/* Tab 5: Alumni Pass */}
      {activeTab === "pass" && (
        <div className="space-y-6">
          <div className="max-w-md mx-auto space-y-4">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-foreground">
                Your Lifetime Alumni Digital Pass
              </h3>
              <p className="text-xs text-muted-foreground">
                Scan at campus turnstiles, digital library, and guest houses
              </p>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={() => setSelectedPass(passes[0])}
                className="rounded-2xl gap-2 text-xs"
              >
                <QrCode className="w-4 h-4" />
                Open High-Resolution Pass Modal
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mentorship Booking Modal */}
      {bookingAlumni && (
        <MentorshipBookingModal
          alumni={bookingAlumni}
          isOpen={!!bookingAlumni}
          onClose={() => setBookingAlumni(null)}
          onSuccess={handleBookingSuccess}
        />
      )}

      {/* Alumni Digital Pass Modal */}
      {selectedPass && (
        <AlumniPassModal
          pass={selectedPass}
          onClose={() => setSelectedPass(null)}
        />
      )}
    </div>
  );
}
