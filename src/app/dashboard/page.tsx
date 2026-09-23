"use client";

import { useEffect, useState } from "react";
import { PortalLayout } from "@/components/layout/portal-layout";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { TodaySchedule } from "@/components/dashboard/today-schedule";
import { LatestNotices } from "@/components/dashboard/latest-notices";
import { UpcomingEvents } from "@/components/dashboard/upcoming-events";
import { CampusGlance } from "@/components/dashboard/campus-glance";
import { useAuth } from "@/components/layout/auth-provider";
import {
  getStudentDashboardData,
  type TimetableRow,
  type NoticeRow,
  type EventRow,
  type LocationRow,
  MOCK_TIMETABLE,
  MOCK_NOTICES,
  MOCK_EVENTS,
} from "@/lib/supabase/queries";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentDashboardPage() {
  const { profile, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [classes, setClasses] = useState<TimetableRow[]>(MOCK_TIMETABLE.slice(0, 4));
  const [notices, setNotices] = useState<NoticeRow[]>(MOCK_NOTICES);
  const [events, setEvents] = useState<EventRow[]>(MOCK_EVENTS);
  const [currentDay, setCurrentDay] = useState("Monday");

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getStudentDashboardData({
          collegeId: profile?.college_id,
          departmentId: profile?.department_id || undefined,
          year: profile?.year,
          division: profile?.division,
        });

        if (data) {
          setClasses(data.classes);
          setNotices(data.notices);
          setEvents(data.events);
          setCurrentDay(data.currentDay);
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [profile]);

  return (
    <PortalLayout>
      <div className="space-y-8 pb-10">
        {/* Welcome Hero Banner */}
        <WelcomeBanner />

        {/* Quick Actions Grid */}
        <QuickActions />

        {/* Interactive Today's Schedule & Latest Circulars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            {isLoading ? (
              <div className="rounded-3xl border p-6 space-y-4">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : (
              <TodaySchedule classes={classes} currentDay={currentDay} />
            )}
          </div>

          <div className="lg:col-span-5">
            {isLoading ? (
              <div className="rounded-3xl border p-6 space-y-4">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : (
              <LatestNotices notices={notices} />
            )}
          </div>
        </div>

        {/* Campus Facilities at a Glance */}
        <CampusGlance />

        {/* Upcoming Campus Events */}
        {isLoading ? (
          <div className="rounded-3xl border p-6 space-y-4">
            <Skeleton className="h-6 w-44" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-44 w-full" />
              <Skeleton className="h-44 w-full" />
              <Skeleton className="h-44 w-full" />
            </div>
          </div>
        ) : (
          <UpcomingEvents events={events} />
        )}
      </div>
    </PortalLayout>
  );
}
