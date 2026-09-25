import { PortalLayout } from "@/components/layout/portal-layout";
import { BookmarksView } from "./bookmarks-view";
import { getUserBookmarks } from "@/lib/supabase/queries";
import { Bookmark, Sparkles } from "lucide-react";

export const metadata = {
  title: "My Saved Bookmarks | CampusLens AI",
  description: "Personalized quick access to your favorite campus locations, study pods, notices, events, and professors.",
};

export default async function BookmarksPage() {
  const bookmarks = await getUserBookmarks();

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 p-6 md:p-8 text-white shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold tracking-wide">
                <Bookmark className="w-3.5 h-3.5 text-indigo-300" />
                Personalized Campus Bookmarks
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                My Saved Campus Items
              </h1>

              <p className="text-indigo-200 text-sm max-w-xl leading-relaxed">
                Fast 1-click access to your essential study halls, laboratory coordinates, active circulars, and professors.
              </p>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-md text-xs text-indigo-200 border border-white/10">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{bookmarks.length} Items Synchronized</span>
            </div>
          </div>

          <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        </div>

        {/* Interactive View */}
        <BookmarksView initialBookmarks={bookmarks} />
      </div>
    </PortalLayout>
  );
}
