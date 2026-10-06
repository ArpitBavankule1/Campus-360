"use client";

import React, { useState } from "react";
import {
  HeartHandshake,
  Users,
  Smile,
  PhoneCall,
  ShieldCheck,
  Calendar,
  Sparkles,
  Plus,
  Lock,
  Clock,
  ExternalLink,
} from "lucide-react";
import {
  MOCK_COUNSELING_SESSIONS,
  MOCK_PEER_CIRCLES,
  MOCK_MOOD_CHECKINS,
  MOCK_CRISIS_HELPLINES,
  calculateCounselingOverview,
} from "@/lib/counseling/counseling-engine";
import { CounselingSession, PeerSupportCircle, MoodCheckin } from "@/types";
import { CounselorSessionCard } from "@/components/counseling/counselor-session-card";
import { PeerCircleCard } from "@/components/counseling/peer-circle-card";
import { BookSessionModal } from "@/components/counseling/book-session-modal";
import { MoodCheckinModal } from "@/components/counseling/mood-checkin-modal";

export default function CounselingPortalPage() {
  const [sessions, setSessions] = useState<CounselingSession[]>(MOCK_COUNSELING_SESSIONS);
  const [circles, setCircles] = useState<PeerSupportCircle[]>(MOCK_PEER_CIRCLES);
  const [moodCheckins, setMoodCheckins] = useState<MoodCheckin[]>(MOCK_MOOD_CHECKINS);
  const [helplines] = useState(MOCK_CRISIS_HELPLINES);

  const [activeTab, setActiveTab] = useState<"sessions" | "circles" | "mood" | "helplines">("sessions");
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [isMoodOpen, setIsMoodOpen] = useState(false);

  const stats = calculateCounselingOverview(sessions, circles, moodCheckins, helplines);

  const handleJoinCircle = (circle: PeerSupportCircle) => {
    setCircles((prev) =>
      prev.map((c) =>
        c.id === circle.id && c.enrolled_count < c.max_participants
          ? { ...c, enrolled_count: c.enrolled_count + 1 }
          : c
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold mb-2">
            <HeartHandshake className="w-3.5 h-3.5" />
            Phase 41 • Psychological Counseling, Peer Circles & Mental Health Sanctuary
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Student Mental Health & Counseling Sanctuary
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Confidential 1-on-1 licensed clinical psychologist appointments, anonymous peer support circles, daily emotional pulse tracking, and 24x7 crisis response.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMoodOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors flex items-center gap-2"
          >
            <Smile className="w-4 h-4 text-teal-400" />
            Log Mood Pulse
          </button>
          <button
            onClick={() => setIsBookOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Book Confidential Session
          </button>
        </div>
      </div>

      {/* Telemetry Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-violet-500/30 bg-violet-950/20 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-semibold text-violet-400 mb-2">
            <span>Confirmed Consultations</span>
            <Calendar className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-3xl font-black text-white">{stats.totalConfirmedSessions}</div>
          <p className="text-[11px] text-slate-400 mt-1">Private video & clinic visits</p>
        </div>

        <div className="rounded-2xl border border-teal-500/30 bg-teal-950/20 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-semibold text-teal-400 mb-2">
            <span>Active Peer Circles</span>
            <Users className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-3xl font-black text-white">{stats.activePeerCirclesCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">Anonymous group fellowship</p>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 mb-2">
            <span>Daily Mood Pulse</span>
            <Smile className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">{stats.todayMoodAverage} / 5.0</div>
          <p className="text-[11px] text-slate-400 mt-1">Average emotional equilibrium</p>
        </div>

        <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-semibold text-rose-400 mb-2">
            <span>Crisis Lifelines</span>
            <PhoneCall className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-black text-white">{stats.emergencyHelplinesCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">24x7 Round-the-clock SOS</p>
        </div>
      </div>

      {/* Confidentiality Assurance Banner */}
      <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-950/10 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-emerald-300">
              Statutory UGC / National Medical Commission Privacy Guarantee
            </div>
            <div className="text-slate-400">
              Counseling consultations are strictly confidential. No attendance records, transcripts, or faculty grade reports will ever disclose mental health counseling visits.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-400 shrink-0 font-mono text-[11px]">
          <Lock className="w-3.5 h-3.5 text-emerald-400" /> SHA-256 Client Anonymity
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3 text-sm">
        <button
          onClick={() => setActiveTab("sessions")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "sessions"
              ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          1-on-1 Sessions ({sessions.length})
        </button>
        <button
          onClick={() => setActiveTab("circles")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "circles"
              ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          Peer Support Circles ({circles.length})
        </button>
        <button
          onClick={() => setActiveTab("mood")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "mood"
              ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          Emotional Pulse History ({moodCheckins.length})
        </button>
        <button
          onClick={() => setActiveTab("helplines")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "helplines"
              ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          24x7 Emergency Helplines ({helplines.length})
        </button>
      </div>

      {/* Tab 1: Sessions */}
      {activeTab === "sessions" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <CounselorSessionCard key={session.id} session={session} />
          ))}
        </div>
      )}

      {/* Tab 2: Circles */}
      {activeTab === "circles" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {circles.map((circle) => (
            <PeerCircleCard
              key={circle.id}
              circle={circle}
              onJoin={handleJoinCircle}
            />
          ))}
        </div>
      )}

      {/* Tab 3: Mood History */}
      {activeTab === "mood" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {moodCheckins.map((checkin) => (
              <div
                key={checkin.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {checkin.mood_score >= 4 ? "🌿" : checkin.mood_score === 3 ? "🌊" : "⚡"}
                    </span>
                    <div>
                      <div className="text-base font-bold text-white">{checkin.mood_tag}</div>
                      <div className="text-xs text-slate-400 font-mono">
                        {new Date(checkin.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Sleep</div>
                    <div className="font-bold text-teal-300">{checkin.sleep_hours}h</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {checkin.stress_factors.map((f, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300"
                    >
                      {f}
                    </span>
                  ))}
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                  <div className="text-[11px] text-teal-400 font-semibold mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Coping Practice
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {checkin.coping_exercise}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: 24x7 Helplines */}
      {activeTab === "helplines" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {helplines.map((hl) => (
            <div
              key={hl.id}
              className="rounded-2xl border border-rose-500/30 bg-rose-950/10 p-6 backdrop-blur-md flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                    <PhoneCall className="w-3 h-3" /> {hl.availability}
                  </span>
                  {hl.is_toll_free && (
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      Toll-Free 24x7
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-white mb-1.5">{hl.service_name}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{hl.coverage_scope}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Emergency Dial</div>
                  <div className="text-lg font-mono font-black text-rose-400">{hl.phone_number}</div>
                </div>
                <a
                  href={`tel:${hl.phone_number.replace(/[^0-9+]/g, "")}`}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/30 flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> Call Now
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <BookSessionModal
        isOpen={isBookOpen}
        onClose={() => setIsBookOpen(false)}
        onSessionBooked={(newSession) => {
          setSessions((prev) => [newSession, ...prev]);
        }}
      />

      <MoodCheckinModal
        isOpen={isMoodOpen}
        onClose={() => setIsMoodOpen(false)}
        onCheckinCompleted={(newCheckin) => {
          setMoodCheckins((prev) => [newCheckin, ...prev]);
        }}
      />
    </div>
  );
}
