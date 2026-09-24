import Link from "next/link";
import { ArrowLeft, LifeBuoy, ShieldCheck, Clock, CheckCircle } from "lucide-react";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Card, CardContent } from "@/components/ui/card";
import { TicketForm } from "./ticket-form";
import { getDepartments } from "@/lib/supabase/queries";

export const metadata = {
  title: "Raise Support Ticket | CampusLens AI",
  description: "Submit a new student inquiry or maintenance issue to the campus help desk.",
};

export default async function NewTicketPage() {
  const departments = await getDepartments();

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
          <span className="text-foreground font-medium">New Support Ticket</span>
        </div>

        {/* Page Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <LifeBuoy className="w-3.5 h-3.5" />
            Student Service Desk
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Raise a Support Ticket
          </h1>
          <p className="text-muted-foreground text-sm">
            Fill in the details below. Our campus operations, academic, and IT staff will review and respond with resolution steps.
          </p>
        </div>

        {/* Form Container */}
        <Card className="border shadow-sm bg-card">
          <CardContent className="p-6 md:p-8">
            <TicketForm departments={departments.map((d) => ({ id: d.id, name: d.name, code: d.code }))} />
          </CardContent>
        </Card>

        {/* SLA Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="flex items-start gap-3 p-4 rounded-xl border bg-muted/20">
            <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-foreground">Rapid SLA Windows</h4>
              <p className="text-[11px] text-muted-foreground">
                Urgent requests (exam issues or lab blackouts) are addressed within 2 hours.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl border bg-muted/20">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-foreground">Official Accountability</h4>
              <p className="text-[11px] text-muted-foreground">
                Every ticket is logged with timestamped auditing and direct department assignment.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl border bg-muted/20">
            <CheckCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-foreground">Threaded Communication</h4>
              <p className="text-[11px] text-muted-foreground">
                Exchange comments, status clarifications, and verification files directly on the ticket.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
