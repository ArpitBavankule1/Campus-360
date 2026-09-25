import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldAlert,
  Building2,
  LifeBuoy,
  Sparkles,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PublicHeader } from "@/components/layout/public-header";
import { Footer } from "@/components/layout/footer";
import { ContactForm } from "@/app/contact/contact-form";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact & Institutional Inquiries",
  description: `Get in touch with the ${APP_NAME} campus administration, admissions office, and student technical support.`,
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-background via-muted/20 to-background border-b border-border/40">
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/3 top-0 h-[450px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                Institutional Touchpoint
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                Connect with <span className="text-gradient">Campus Operations</span>
              </h1>
              <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                Whether you need technical support, institutional partnership details, or admissions guidance, our campus team is here to assist.
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-12 items-start">
              {/* Left Column: Campus Contact Cards */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    Campus Headquarters
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Direct access to official institutional contacts and administrative offices.
                  </p>
                </div>

                {/* Primary Campus Address */}
                <Card className="border-border/60 bg-card/80">
                  <CardContent className="p-5 flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">Apex Institute of Technology</h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        Innovation & Research Park, Sector 4<br />
                        Turing Academic Block, Ground Floor<br />
                        Pune, Maharashtra 411057
                      </p>
                      <div className="mt-2.5">
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs font-medium text-primary gap-1"
                          render={<Link href="/map" />}
                        >
                          <MapPin className="h-3.5 w-3.5" />
                          View on Interactive Campus Map
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Communication Channels */}
                <Card className="border-border/60 bg-card/80">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start gap-3.5">
                      <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">Email Communications</h4>
                        <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                          <p>General Inquiries: <span className="text-foreground font-medium">contact@campuslens.ai</span></p>
                          <p>Technical Desk: <span className="text-foreground font-medium">helpdesk@apex.edu</span></p>
                          <p>Registrar Office: <span className="text-foreground font-medium">registrar@apex.edu</span></p>
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-border/60" />

                    <div className="flex items-start gap-3.5">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">Direct Telephone Desk</h4>
                        <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                          <p>Campus Operator: <span className="text-foreground font-medium">+91 (020) 2765-8800</span></p>
                          <p>Academic Affairs: <span className="text-foreground font-medium">+91 (020) 2765-8822</span></p>
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-border/60" />

                    <div className="flex items-start gap-3.5">
                      <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">Operating Hours</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Monday – Saturday: 8:00 AM – 6:00 PM IST<br />
                          Sunday & Public Holidays: Closed (Emergency Hotline Active)
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Emergency Hotline Card */}
                <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-destructive/10 text-destructive shrink-0">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-destructive block">24/7 Campus Emergency Protocol</span>
                    <span className="text-muted-foreground">Immediate Security & Medical Dispatch: </span>
                    <span className="font-semibold text-foreground">+91 (020) 2765-8899</span>
                  </div>
                </div>

                {/* Registered Student Quick Link */}
                <div className="rounded-2xl border border-border/70 bg-muted/40 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <LifeBuoy className="h-5 w-5 text-primary" />
                    <div>
                      <h5 className="text-xs font-semibold text-foreground">Are you an enrolled student?</h5>
                      <p className="text-[11px] text-muted-foreground">Submit a formal ticket directly via the Help Desk.</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="h-8 text-xs gap-1" render={<Link href="/help-desk" />}>
                    Help Desk
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Right Column: Contact & Inquiry Form */}
              <div className="lg:col-span-7">
                <Card className="border border-border/70 shadow-lg bg-card">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl">Institutional Inquiry Form</CardTitle>
                    <CardDescription className="text-xs">
                      Send a message to our campus administrative or technical coordinators. All inquiries receive an automated tracking code.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ContactForm />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
