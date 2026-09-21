import type { Metadata } from "next";
import Link from "next/link";
import {
  GraduationCap,
  Users,
  MapPin,
  Bot,
  Shield,
  Building2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PublicHeader } from "@/components/layout/public-header";
import { Footer } from "@/components/layout/footer";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${APP_NAME} — the smart college connect platform.`,
};

const PILLARS = [
  {
    icon: Users,
    title: "Connect",
    description:
      "Bridge the gap between students, faculty, HODs, and administration through one unified digital platform.",
  },
  {
    icon: MapPin,
    title: "Explore",
    description:
      "Discover campus locations, departments, classrooms, facilities, and events with interactive maps.",
  },
  {
    icon: Bot,
    title: "Assist",
    description:
      "Get instant AI-powered answers to campus questions — grounded in real college data, never hallucinated.",
  },
];

const VALUES = [
  {
    icon: Shield,
    title: "Security First",
    description:
      "Role-based access with Supabase Row Level Security ensures data privacy and multi-college isolation.",
  },
  {
    icon: Building2,
    title: "Multi-College Ready",
    description:
      "Built with a scalable architecture that supports multiple colleges on the same platform.",
  },
  {
    icon: GraduationCap,
    title: "Student-Centric",
    description:
      "Designed with students in mind — fast, mobile-friendly, and easy to navigate.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden py-20 sm:py-28">
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/3 top-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                About <span className="text-gradient">{APP_NAME}</span>
              </h1>
              <p className="mt-4 text-xl text-muted-foreground">
                {APP_TAGLINE}
              </p>
              <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground leading-relaxed">
                {APP_NAME} is a smart digital college platform that connects
                students, faculty, and college administration in one centralized
                system. It enables students to access college information,
                communicate with the college, receive notices, explore the
                campus, check schedules, discover events, submit queries, and
                interact with an AI-powered campus assistant.
              </p>
            </div>
          </div>
        </section>

        {/* Three Pillars */}
        <section className="border-t border-border/40 bg-muted/20 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
              Our Three Pillars
            </h2>
            <div className="mt-14 grid gap-8 sm:grid-cols-3">
              {PILLARS.map((pillar) => (
                <Card
                  key={pillar.title}
                  className="border-border/50 bg-card/80 text-center"
                >
                  <CardContent className="p-8">
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <pillar.icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-semibold">{pillar.title}</h3>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {pillar.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
              Built with Purpose
            </h2>
            <div className="mt-14 grid gap-8 sm:grid-cols-3">
              {VALUES.map((value) => (
                <div key={value.title} className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <value.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold">{value.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section
          id="contact"
          className="border-t border-border/40 bg-muted/20 py-20 sm:py-28"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Get in Touch
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Have questions about {APP_NAME}? We&apos;d love to hear from
                you.
              </p>
              <div className="mt-8">
                <Button size="lg" className="gap-2" render={<Link href="/register" />}>
                  Join {APP_NAME}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
