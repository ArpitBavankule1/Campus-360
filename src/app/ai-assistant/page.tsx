import { PortalLayout } from "@/components/layout/portal-layout";
import { AiChatInterface } from "./ai-chat-interface";
import { Bot, Sparkles, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "CampusLens AI Assistant | Smart Campus Concierge",
  description: "24/7 Intelligent campus assistant for timetable queries, room navigation, professor office hours, and student help desk.",
};

export default function AiAssistantPage() {
  return (
    <PortalLayout>
      <div className="space-y-4">
        {/* Page Sub-header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 via-primary to-violet-600 flex items-center justify-center text-white shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">
                  CampusLens AI Assistant
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  Smart RAG
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Grounded conversational intelligence for student queries, room locations, timetables, and circulars
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Multi-Tenant Enterprise Verified</span>
          </div>
        </div>

        {/* AI Chat Interface */}
        <AiChatInterface />
      </div>
    </PortalLayout>
  );
}
