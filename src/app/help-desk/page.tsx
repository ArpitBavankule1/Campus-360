import { Suspense } from "react";
import Link from "next/link";
import {
  LifeBuoy,
  PlusCircle,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ShieldAlert,
  ArrowRight,
  Filter,
  PhoneCall,
  Mail,
  HelpCircle,
} from "lucide-react";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getHelpRequests, type HelpRequestWithDetails } from "@/lib/supabase/queries";
import { cn } from "cn";

interface HelpDeskPageProps {
  searchParams: Promise<{
    status?: string;
    category?: string;
    search?: string;
  }>;
}

export default async function HelpDeskPage({ searchParams }: HelpDeskPageProps) {
  const params = await searchParams;
  const statusFilter = params.status || "all";
  const categoryFilter = params.category || "all";
  const searchQuery = params.search || "";

  const tickets = await getHelpRequests({
    status: statusFilter,
    category: categoryFilter,
    search: searchQuery,
  });

  const allTickets = await getHelpRequests();
  const totalCount = allTickets.length;
  const pendingCount = allTickets.filter((t) => t.status === "submitted" || t.status === "under_review").length;
  const inProgressCount = allTickets.filter((t) => t.status === "in_progress").length;
  const resolvedCount = allTickets.filter((t) => t.status === "resolved" || t.status === "closed").length;

  const categories = [
    "All Categories",
    "IT & Network",
    "Library & RFID",
    "Laboratory",
    "Examinations",
    "Hostel & Facilities",
  ];

  const statusTabs = [
    { label: "All Tickets", value: "all", count: totalCount },
    { label: "Submitted", value: "submitted", count: allTickets.filter(t => t.status === "submitted").length },
    { label: "Under Review", value: "under_review", count: allTickets.filter(t => t.status === "under_review").length },
    { label: "In Progress", value: "in_progress", count: inProgressCount },
    { label: "Resolved", value: "resolved", count: resolvedCount },
  ];

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
          <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/20 font-medium animate-pulse">
            <Clock className="w-3 h-3 mr-1" /> In Progress
          </Badge>
        );
      case "resolved":
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-medium">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Resolved
          </Badge>
        );
      case "closed":
        return (
          <Badge variant="outline" className="bg-muted text-muted-foreground font-medium">
            Closed
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
          <span className="inline-flex items-center text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5 animate-ping" />
            Urgent
          </span>
        );
      case "high":
        return (
          <span className="inline-flex items-center text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
            High
          </span>
        );
      case "medium":
        return (
          <span className="inline-flex items-center text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5" />
            Medium
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-500/10 px-2 py-0.5 rounded-full border border-slate-500/20">
            Low
          </span>
        );
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 p-6 md:p-8 text-white shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium tracking-wide">
                <LifeBuoy className="w-3.5 h-3.5 text-indigo-300" />
                24/7 Smart Campus Help Desk & Ticketing
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Student Support & Query Resolution
              </h1>
              <p className="text-indigo-200 text-sm md:text-base leading-relaxed">
                Track your service inquiries, IT tickets, hostel maintenance requests, and grade re-evaluations with transparent department SLA resolution times.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/help-desk/new"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-900 font-semibold text-sm shadow-lg hover:bg-indigo-50 transition-all active:scale-[0.98]"
              >
                <PlusCircle className="w-4 h-4 text-indigo-600" />
                Raise Support Ticket
              </Link>
            </div>
          </div>

          {/* Background Decorative Rings */}
          <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
          <div className="absolute right-1/3 top-0 w-48 h-48 rounded-full bg-blue-500/20 blur-2xl pointer-events-none" />
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-sm hover:border-primary/40 transition-colors">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <LifeBuoy className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Total Tickets</p>
                <p className="text-xl font-bold">{totalCount}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-sm hover:border-amber-500/40 transition-colors">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Pending Review</p>
                <p className="text-xl font-bold">{pendingCount}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-sm hover:border-purple-500/40 transition-colors">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">In Progress</p>
                <p className="text-xl font-bold">{inProgressCount}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-sm hover:border-emerald-500/40 transition-colors">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Resolved</p>
                <p className="text-xl font-bold">{resolvedCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {statusTabs.map((tab) => {
              const isActive = statusFilter === tab.value;
              const nextParams = new URLSearchParams();
              if (tab.value !== "all") nextParams.set("status", tab.value);
              if (categoryFilter !== "all") nextParams.set("category", categoryFilter);
              if (searchQuery) nextParams.set("search", searchQuery);

              return (
                <Link
                  key={tab.value}
                  href={`/help-desk${nextParams.toString() ? `?${nextParams.toString()}` : ""}`}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {tab.label}
                  <span
                    className={cn(
                      "px-1.5 py-0.2 rounded-full text-[10px]",
                      isActive ? "bg-white/20 text-white" : "bg-muted-foreground/20 text-muted-foreground"
                    )}
                  >
                    {tab.count}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Search and Category Filter */}
          <form method="GET" action="/help-desk" className="flex items-center gap-2">
            <input type="hidden" name="status" value={statusFilter} />
            <div className="relative flex-1 md:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                name="search"
                defaultValue={searchQuery}
                placeholder="Search ticket subject..."
                className="pl-9 h-9 text-xs"
              />
            </div>

            <select
              name="category"
              defaultValue={categoryFilter}
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {categories.map((c) => (
                <option key={c} value={c === "All Categories" ? "all" : c}>
                  {c}
                </option>
              ))}
            </select>

            <Button type="submit" variant="secondary" size="sm" className="h-9 text-xs">
              <Filter className="w-3.5 h-3.5 mr-1" />
              Filter
            </Button>
          </form>
        </div>

        {/* Tickets Listing Feed */}
        <div className="space-y-3">
          {tickets.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-dashed bg-card/40 flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-foreground">No Tickets Found</h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                No support requests match the selected filters. Change your filter query or submit a new inquiry.
              </p>
              <Link
                href="/help-desk/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Raise New Ticket
              </Link>
            </div>
          ) : (
            tickets.map((ticket) => {
              const repliesCount = ticket.replies?.length || 0;
              const formattedDate = new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(ticket.created_at));

              return (
                <Link
                  key={ticket.id}
                  href={`/help-desk/${ticket.id}`}
                  className="block group"
                >
                  <Card className="border border-border/70 hover:border-primary/50 transition-all hover:shadow-md bg-card/80 backdrop-blur-sm">
                    <CardContent className="p-5">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-mono text-muted-foreground uppercase">
                              #{ticket.id.slice(0, 8)}
                            </span>
                            {getStatusBadge(ticket.status)}
                            {getPriorityBadge(ticket.priority)}
                            <Badge variant="secondary" className="text-xs font-normal">
                              {ticket.category}
                            </Badge>
                          </div>

                          <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                            {ticket.subject}
                          </h3>

                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {ticket.description}
                          </p>
                        </div>

                        {/* Metadata & Reply Indicator */}
                        <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-3 md:pt-0 gap-2 text-xs text-muted-foreground shrink-0">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{formattedDate}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="inline-flex items-center gap-1 text-primary font-medium">
                              <MessageSquare className="w-3.5 h-3.5" />
                              {repliesCount} {repliesCount === 1 ? "reply" : "replies"}
                            </span>

                            <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                              <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          )}
        </div>

        {/* Emergency Assistance Footnote */}
        <div className="rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/20 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Need Urgent Campus Assistance?</p>
              <p className="text-xs text-muted-foreground">
                For emergency medical, hostel security, or network blackout concerns, contact campus control room directly.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="tel:+918023456799"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              +91 80 2345 6799
            </a>
            <a
              href="mailto:support@demo-apex.edu"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              support@demo-apex.edu
            </a>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
