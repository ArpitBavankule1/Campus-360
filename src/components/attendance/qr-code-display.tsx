"use client";

/**
 * CampusLens AI — Phase 17
 * QrCodeDisplay: renders a QR code from a string value using the
 * qrcode.react library (SVG-based, no canvas issues in Next.js).
 *
 * Falls back to a styled placeholder if the library is not installed.
 */

import { useEffect, useState } from "react";

interface QrCodeDisplayProps {
  value: string;
  size?: number;
  className?: string;
}

export function QrCodeDisplay({ value, size = 220, className = "" }: QrCodeDisplayProps) {
  const [QRCode, setQRCode] = useState<React.ComponentType<{
    value: string;
    size: number;
    level: string;
    bgColor: string;
    fgColor: string;
  }> | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Dynamically import qrcode.react so it tree-shakes when unused
    import("qrcode.react")
      .then((mod) => {
        // qrcode.react exports QRCodeSVG as named export
        setQRCode(() => (mod as { QRCodeSVG: typeof QRCode }).QRCodeSVG);
      })
      .catch(() => setError(true));
  }, []);

  if (error || !QRCode) {
    // Attractive SVG placeholder while loading / if package missing
    return (
      <div
        className={`flex items-center justify-center rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="text-center space-y-2 px-4">
          <div className="grid grid-cols-3 gap-1.5 mx-auto w-fit">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className={`rounded-sm ${[0, 2, 4, 6, 8].includes(i) ? "bg-primary w-6 h-6" : "bg-primary/20 w-6 h-6"}`}
              />
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground font-mono">
            {error ? "QR render failed" : "Loading QR…"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl overflow-hidden border border-border bg-white p-3 shadow-md ${className}`}
      style={{ width: size + 24, height: size + 24 }}
    >
      <QRCode
        value={value}
        size={size}
        level="H"
        bgColor="#ffffff"
        fgColor="#1a1a2e"
      />
    </div>
  );
}
