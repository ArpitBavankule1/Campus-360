import { PortalLayout } from "@/components/layout/portal-layout";
import { NotificationsView } from "./notifications-view";
import { getNotificationsList } from "@/lib/supabase/queries";
import { Bell, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Campus Notifications & Alerts | CampusLens AI",
  description: "Stay informed with real-time academic announcements, urgent circulars, schedule changes, and event invites.",
};

export default async function NotificationsPage() {
  const notifications = await getNotificationsList();

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header Hero */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium tracking-wide">
                <Bell className="w-3.5 h-3.5 text-indigo-300" />
                Live Notification Center
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Campus Alerts & Bulletins
              </h1>
              <p className="text-indigo-200 text-sm leading-relaxed">
                Review your personalized updates regarding examination timetables, urgent dean notices, club hackathons, and help desk responses.
              </p>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-md text-xs text-indigo-200 border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Campus broadcast synchronized</span>
            </div>
          </div>

          {/* Background circles */}
          <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        </div>

        {/* Notifications interactive view */}
        <NotificationsView initialNotifications={notifications} />
      </div>
    </PortalLayout>
  );
}
