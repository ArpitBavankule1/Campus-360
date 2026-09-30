"use client";

import React from "react";
import { HostelBlock } from "@/types";
import {
  Phone,
  Mail,
  Shield,
  Clock,
  UserCheck,
  Building,
  HelpCircle,
} from "lucide-react";

interface WardenContactCardProps {
  block?: HostelBlock;
  wardenName?: string;
  wardenPhone?: string;
  wardenEmail?: string;
}

export function WardenContactCard({
  block,
  wardenName,
  wardenPhone,
  wardenEmail,
}: WardenContactCardProps) {
  const name = wardenName || block?.warden_name || "Dr. Suresh Varma";
  const phone = wardenPhone || block?.warden_phone || "+91 98765 43210";
  const email = wardenEmail || block?.warden_email || "suresh.varma@apex.edu";

  return (
    <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-border/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-foreground">
              Hostel Administration & Warden
            </h4>
            <p className="text-xs text-muted-foreground">
              {block?.name || "Aryabhata Hall Residency"}
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
          <Clock className="w-3 h-3 text-muted-foreground" />
          Office: 5 PM – 8 PM
        </span>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30 border border-border/40">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            {name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <span>{name}</span>
              <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="text-xs text-muted-foreground">Chief Resident Warden</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <a
            href={`tel:${phone.replace(/\s+/g, "")}`}
            className="flex items-center gap-2 p-2.5 rounded-xl border border-border/60 bg-background hover:bg-muted/50 hover:border-primary/40 transition-colors text-foreground"
          >
            <Phone className="w-4 h-4 text-emerald-500" />
            <span className="font-medium">{phone}</span>
          </a>

          <a
            href={`mailto:${email}`}
            className="flex items-center gap-2 p-2.5 rounded-xl border border-border/60 bg-background hover:bg-muted/50 hover:border-primary/40 transition-colors text-foreground"
          >
            <Mail className="w-4 h-4 text-blue-500" />
            <span className="font-medium truncate">{email}</span>
          </a>
        </div>

        <div className="p-3 rounded-2xl bg-primary/5 border border-primary/20 flex items-start gap-2.5 text-xs text-muted-foreground">
          <HelpCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <span>
            For medical emergencies after 10:00 PM, contact the Health Center ambulance directly or alert the floor proctor.
          </span>
        </div>
      </div>
    </div>
  );
}
