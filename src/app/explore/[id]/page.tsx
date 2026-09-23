import { notFound } from "next/navigation";
import Link from "next/link";
import { PortalLayout } from "@/components/layout/portal-layout";
import { getLocationById, MOCK_LOCATIONS } from "@/lib/supabase/queries";
import { CampusMap } from "@/components/campus/campus-map";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Phone,
  Building,
  CheckCircle2,
  Navigation,
  ShieldCheck,
  Compass,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

interface LocationDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return MOCK_LOCATIONS.map((loc) => ({
    id: loc.id,
  }));
}

export default async function LocationDetailPage({ params }: LocationDetailPageProps) {
  const { id } = await params;
  const location = await getLocationById(id);

  if (!location) {
    notFound();
  }

  return (
    <PortalLayout>
      <div className="space-y-8 pb-16 max-w-5xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between pb-3 border-b border-border/70">
          <Link
            href="/explore"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Campus Explorer</span>
          </Link>

          <Link
            href={`/map?id=${location.id}`}
            className={cn(
              buttonVariants({ size: "sm" }),
              "text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            )}
          >
            <Navigation className="h-3.5 w-3.5" />
            <span>Navigate on Map</span>
          </Link>
        </div>

        {/* Hero Header Card */}
        <div className="relative rounded-3xl overflow-hidden bg-card border border-border/70 shadow-md">
          {location.image_url && (
            <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-muted">
              <img
                src={location.image_url}
                alt={location.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="absolute top-4 left-4 flex items-center gap-2">
                <Badge className="capitalize text-xs font-bold px-3 py-1 shadow-xs">
                  {location.category}
                </Badge>
                {location.code && (
                  <Badge variant="outline" className="text-xs font-mono font-bold bg-background/80 backdrop-blur-md">
                    {location.code}
                  </Badge>
                )}
              </div>

              <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-md">
                  {location.name}
                </h1>
                <p className="text-sm text-white/90 flex items-center gap-1.5 drop-shadow-xs">
                  <Building className="h-4 w-4" />
                  <span>{location.building} • {location.floor || "Main Floor"}</span>
                  {location.room_number && (
                    <span className="font-mono">({location.room_number})</span>
                  )}
                </p>
              </div>
            </div>
          )}

          <div className="p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-base font-bold text-foreground mb-2">
                About this Campus Space
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {location.description ||
                  "A multi-functional institutional facility providing academic resources, student collaboration spaces, and faculty interaction zones."}
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2 border-t border-border/60">
              <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60 space-y-1">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  Operational Hours
                </span>
                <span className="font-bold text-foreground block">
                  {location.opening_time || "08:00 AM"} – {location.closing_time || "08:00 PM"}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60 space-y-1">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Building className="h-3.5 w-3.5 text-primary" />
                  Building & Floor
                </span>
                <span className="font-bold text-foreground block truncate">
                  {location.building}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60 space-y-1">
                <span className="text-muted-foreground flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Accessibility
                </span>
                <span className="font-bold text-foreground block">
                  {location.is_accessible ? "Wheelchair Accessible" : "Standard Stairway"}
                </span>
              </div>
            </div>

            {/* Amenities List */}
            {location.amenities && location.amenities.length > 0 && (
              <div className="pt-2 border-t border-border/60 space-y-3">
                <h3 className="text-sm font-bold text-foreground">
                  Available Amenities & Facilities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {location.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-background border border-border/60 text-xs font-medium text-foreground"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Embedded Location Geospatial Map */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Campus Map Location</span>
            </h3>
            <span className="text-xs font-mono text-muted-foreground">
              Lat: {Number(location.latitude).toFixed(4)} • Lng: {Number(location.longitude).toFixed(4)}
            </span>
          </div>

          <CampusMap
            locations={[location]}
            selectedLocationId={location.id}
            className="h-[380px] w-full"
          />
        </div>
      </div>
    </PortalLayout>
  );
}
