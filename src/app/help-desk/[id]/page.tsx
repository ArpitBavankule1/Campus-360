import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  LifeBuoy,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  User,
  ShieldCheck,
  Calendar,
  Sparkles,
} from "lucide-react";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TicketThread } from "./ticket-thread";
import {
  getHelpRequestById,
  MOCK_HELP_REQUESTS,
} from "@/lib/supabase/queries";

interface TicketDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  return MOCK_HELP_REQUESTS.map((ticket) => ({
    id: ticket.id,
  }));
}

export default async function TicketDetailPage({ params }: TicketDetailPageProps) {
  const { id } = await params;
  const ticket = await getHelpRequestById(id);

  if (!ticket) {
    return (
      <PortalLayout>
        <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <LifeBuoy className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold">Ticket Not Found</h2>
          <p className="text-xs text-muted-foreground">
            The support ticket you are looking for may have been archived or removed.
          </p>
          <Link
            href="/help-desk"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Help Desk
          </Link>
        </div>
      </PortalLayout>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 font-medium">
            <Clock className="w-3 h-3 mr-1" /> Submitted
          </Badge>
        );
      case "under_review":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 font-medium">
            <AlertCircle className="w-3 h-3 mr-1" /> Under Review
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/20 font-medium">
            <Clock className="w-3 h-3 mr-1" /> In Progress
          </Badge>
        );
      case "resolved":
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-medium">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Resolved
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return (
          <span className="inline-flex items-center text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5 animate-ping" />
            Urgent Priority
          </span>
        );
      case "high":
        return (
          <span className="inline-flex items-center text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
            High Priority
          </span>
        );
      case "medium":
        return (
          <span className="inline-flex items-center text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
            Medium Priority
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-500/10 px-2.5 py-0.5 rounded-full border border-slate-500/20">
            Low Priority
          </span>
        );
    }
  };

  const formattedCreated = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(ticket.created_at));

  const formattedUpdated = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(ticket.updated_at));

  const isResolved = ticket.status === "resolved" || ticket.status === "closed";

  return (
    <PortalLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/help-desk" className="hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Help Desk
          </Link>
          <span>/</span>
          <span className="font-mono text-muted-foreground uppercase">#{ticket.id.slice(0, 8)}</span>
        </div>

        {/* Ticket Header & Status Banner */}
        <div className="rounded-2xl border bg-card/80 backdrop-blur-sm p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                #{ticket.id.slice(0, 10)}
              </span>
              {getStatusBadge(ticket.status)}
              {getPriorityBadge(ticket.priority)}
              <Badge variant="secondary" className="text-xs">
                {ticket.category}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span>Created {formattedCreated}</span>
            </div>
          </div>

          <h1 className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight">
            {ticket.subject}
          </h1>

          {/* Quick metadata strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t text-xs">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <div>
                <span className="text-muted-foreground block text-[11px]">Assigned Department</span>
                <span className="font-semibold text-foreground">
                  {ticket.assigned_to || "Central Help Desk Triage"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <span className="text-muted-foreground block text-[11px]">Last Updated</span>
                <span className="font-semibold text-foreground">{formattedUpdated}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="text-muted-foreground block text-[11px]">SLA Status</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {isResolved ? "Resolved within SLA" : "Active SLA Monitoring"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Resolution Banner (if resolved) */}
        {ticket.resolution_notes && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 space-y-2">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Official Resolution Notes
            </div>
            <p className="text-sm text-emerald-950 dark:text-emerald-100 pl-7 leading-relaxed font-medium">
              {ticket.resolution_notes}
            </p>
          </div>
        )}

        {/* Original Issue Description Card */}
        <Card className="border shadow-sm">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <User className="w-3.5 h-3.5 text-primary" />
              Original Inquirer Statement
            </div>
            <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
              {ticket.description}
            </p>
          </CardContent>
        </Card>

        {/* Interactive Discussion Thread */}
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <TicketThread
              requestId={ticket.id}
              initialReplies={ticket.replies || []}
              isResolved={isResolved}
            />
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
