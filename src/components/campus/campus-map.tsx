"use client";

import { useEffect, useRef, useState } from "react";
import type { LocationRow } from "@/lib/supabase/queries";
import "leaflet/dist/leaflet.css";

interface CampusMapProps {
  locations: LocationRow[];
  selectedLocationId?: string | null;
  onLocationSelect?: (location: LocationRow) => void;
  className?: string;
}

export function CampusMap({
  locations,
  selectedLocationId,
  onLocationSelect,
  className = "h-[550px] w-full",
}: CampusMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [id: string]: any }>({});
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !mapContainerRef.current) return;

    let L: any;
    let map: any;

    async function initMap() {
      L = (await import("leaflet")).default;

      // Ensure container has not already been initialized
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      // Center around demo Apex campus
      const initialLat = locations[0]?.latitude || 12.9716;
      const initialLng = locations[0]?.longitude || 77.5946;

      map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 16,
        scrollWheelZoom: false,
      });

      // Add OpenStreetMap tile layer with high-res styling
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;

      // Color mapping for categories
      const getCategoryColor = (cat: string) => {
        switch (cat) {
          case "academic":
            return "#2563eb";
          case "library":
            return "#d97706";
          case "laboratory":
            return "#9333ea";
          case "sports":
            return "#059669";
          case "cafeteria":
            return "#e11d48";
          case "auditorium":
            return "#4f46e5";
          default:
            return "#4b5563";
        }
      };

      // Add markers
      const markerGroup = L.featureGroup();
      markersRef.current = {};

      locations.forEach((loc) => {
        const color = getCategoryColor(loc.category);

        const customIcon = L.divIcon({
          className: "custom-map-marker",
          html: `
            <div style="
              background-color: ${color};
              width: 32px;
              height: 32px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              border: 3px solid #ffffff;
              box-shadow: 0 4px 10px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
            ">
              <div style="
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: #ffffff;
                transform: rotate(45deg);
              "></div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        });

        const popupContent = `
          <div style="min-width: 220px; font-family: inherit; padding: 4px;">
            ${loc.image_url ? `<img src="${loc.image_url}" alt="${loc.name}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 12px; margin-bottom: 8px;" />` : ""}
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
              <span style="background-color: ${color}20; color: ${color}; font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 2px 6px; border-radius: 6px;">
                ${loc.category}
              </span>
              ${loc.code ? `<span style="font-family: monospace; font-size: 10px; color: #6b7280;">${loc.code}</span>` : ""}
            </div>
            <h4 style="margin: 0; font-size: 13px; font-weight: 800; color: #111827; line-height: 1.3;">
              ${loc.name}
            </h4>
            <p style="margin: 4px 0 0 0; font-size: 11px; color: #4b5563;">
              <strong>Building:</strong> ${loc.building} (${loc.floor || "Main floor"})
            </p>
            <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 11px; color: #059669; font-weight: 600;">
                Open: ${loc.opening_time || "8 AM"} - ${loc.closing_time || "8 PM"}
              </span>
              <a href="/explore/${loc.id}" style="color: #2563eb; font-size: 11px; font-weight: 700; text-decoration: none;">
                View Details &rarr;
              </a>
            </div>
          </div>
        `;

        const marker = L.marker([Number(loc.latitude), Number(loc.longitude)], {
          icon: customIcon,
        })
          .bindPopup(popupContent)
          .addTo(markerGroup);

        marker.on("click", () => {
          if (onLocationSelect) {
            onLocationSelect(loc);
          }
        });

        markersRef.current[loc.id] = marker;
      });

      markerGroup.addTo(map);

      // If locations exist, fit bounds
      if (locations.length > 0) {
        map.fitBounds(markerGroup.getBounds(), { padding: [50, 50] });
      }
    }

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isMounted, locations]);

  // Handle selectedLocationId change (fly to location & open popup)
  useEffect(() => {
    if (!selectedLocationId || !mapInstanceRef.current || !markersRef.current[selectedLocationId]) return;

    const loc = locations.find((l) => l.id === selectedLocationId);
    if (loc) {
      mapInstanceRef.current.flyTo([Number(loc.latitude), Number(loc.longitude)], 18, {
        duration: 1.2,
      });
      const marker = markersRef.current[selectedLocationId];
      if (marker) {
        setTimeout(() => {
          marker.openPopup();
        }, 1250);
      }
    }
  }, [selectedLocationId, locations]);

  if (!isMounted) {
    return (
      <div className={`rounded-3xl bg-muted/40 border border-border/70 flex items-center justify-center ${className}`}>
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
          <span>Loading Campus Geospatial Map...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-3xl overflow-hidden border border-border/80 shadow-md">
      <div ref={mapContainerRef} className={className} />
    </div>
  );
}
