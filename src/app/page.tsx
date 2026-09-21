import Link from "next/link";
import {
  GraduationCap,
  School,
  Bot,
  Megaphone,
  CalendarDays,
  MessageSquareText,
  ArrowRight,
  Sparkles,
  MapPin,
  Users,
  Building2,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PublicHeader } from "@/components/layout/public-header";
import { Footer } from "@/components/layout/footer";
import {
  APP_NAME,
  APP_TAGLINE,
  APP_LONG_DESCRIPTION,
  FEATURES,
  HOW_IT_WORKS,
} from "@/lib/constants";

const FEATURE_ICONS = {
  GraduationCap,
  School,
  Bot,
  Megaphone,
  CalendarDays,
  MessageSquareText,
} as const;

const STATS = [
  { label: "Students", value: "2,500+", icon: Users },
  { label: "Faculty", value: "120+", icon: GraduationCap },
  { label: "Departments", value: "10", icon: Building2 },
  { label: "Events", value: "50+", icon: Calendar },
  { label: "Campus Locations", value: "40+", icon: MapPin },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* ======================== HERO ======================== */}
        <section className="relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-3xl" />
          </div>

          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
            <div className="mx-auto max-w-3xl text-center">
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Smart College Connect Platform
              </div>

              {/* Heading */}
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                <span className="text-gradient">{APP_NAME}</span>
              </h1>
              <p className="mt-3 text-xl font-medium text-muted-foreground sm:text-2xl">
                {APP_TAGLINE}
              </p>
              <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed">
                {APP_LONG_DESCRIPTION}
              </p>

              {/* CTA */}
              <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Button size="lg" className="gap-2 px-8" render={<Link href="/register" />}>
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="gap-2 px-8" render={<Link href="/#features" />}>
                  Explore Features
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="secondary" className="gap-2 px-8" render={<Link href="/about" />}>
                  <Bot className="h-4 w-4" />
                  Ask Campus AI
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ======================== FEATURES ======================== */}
        <section id="features" className="border-t border-border/40 bg-muted/20 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything You Need for Campus Life
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                One platform to access all college resources, communicate with
                administration, and stay connected.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => {
                const Icon =
                  FEATURE_ICONS[feature.icon as keyof typeof FEATURE_ICONS];
                return (
                  <Card
                    key={feature.title}
                    className="group relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                  >
                    <CardContent className="p-6">
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-semibold">{feature.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* ======================== HOW IT WORKS ======================== */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Get started in minutes and access your entire campus digitally.
              </p>
            </div>

            <div className="relative mt-14">
              {/* Connection line */}
              <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-border lg:block" />

              <div className="grid gap-8 lg:gap-12">
                {HOW_IT_WORKS.map((item) => (
                  <div
                    key={item.step}
                    className="relative flex flex-col items-center gap-4 lg:flex-row lg:gap-8"
                  >
                    {/* Step number */}
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg shadow-md shadow-primary/20">
                      {item.step}
                    </div>
                    <div className="text-center lg:text-left">
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ======================== STATS ======================== */}
        <section className="border-t border-border/40 bg-muted/20 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className="mx-auto h-6 w-6 text-primary mb-2" />
                  <div className="text-2xl font-bold sm:text-3xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======================== CTA ======================== */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-16 text-center text-primary-foreground shadow-xl sm:px-16">
              <div className="absolute inset-0 -z-0">
                <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute right-1/4 bottom-0 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
              </div>
              <div className="relative z-10">
                <h2 className="text-3xl font-bold sm:text-4xl">
                  Ready to Connect with Your Campus?
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
                  Join thousands of students already using {APP_NAME} to
                  navigate college life smarter.
                </p>
                <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="gap-2 px-8"
                    render={<Link href="/register" />}
                  >
                    Get Started Free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 border-primary-foreground/30 px-8 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                    render={<Link href="/login" />}
                  >
                    Log In
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
