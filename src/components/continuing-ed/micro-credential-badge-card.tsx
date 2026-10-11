"use client";

import React from "react";
import { ProfessionalMicroCredential } from "@/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Award,
  Hash,
  Users,
  CheckCircle,
  FileCheck,
  Sparkles,
} from "lucide-react";

interface MicroCredentialBadgeCardProps {
  credential: ProfessionalMicroCredential;
  onVerify: (credential: ProfessionalMicroCredential) => void;
}

export function MicroCredentialBadgeCard({
  credential,
  onVerify,
}: MicroCredentialBadgeCardProps) {
  const getDomainColor = (domain: string) => {
    switch (domain) {
      case "generative_ai":
        return { label: "Generative AI", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30" };
      case "cloud_devops":
        return { label: "Cloud & DevOps", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30" };
      case "cybersecurity":
        return { label: "Cybersecurity", color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30" };
      case "quantum_computing":
        return { label: "Quantum Computing", color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30" };
      case "fintech_blockchain":
        return { label: "FinTech & Blockchain", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" };
      default:
        return { label: domain, color: "bg-muted text-muted-foreground" };
    }
  };

  const domainBadge = getDomainColor(credential.competency_domain);

  return (
    <Card className="border border-border/60 bg-gradient-to-br from-card/80 via-card/50 to-primary/5 backdrop-blur-md shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between overflow-hidden relative">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full pointer-events-none" />
      
      <CardHeader className="pb-3 border-b border-border/40">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <Badge variant="outline" className={`text-xs font-semibold ${domainBadge.color}`}>
              {domainBadge.label}
            </Badge>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border/40">
              {credential.credential_code}
            </span>
          </div>

          <CardTitle className="text-base font-bold tracking-tight text-foreground flex items-start gap-2.5 mt-1">
            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 border border-primary/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span>{credential.badge_title}</span>
              <p className="text-xs font-normal text-muted-foreground mt-0.5">{credential.issuing_board}</p>
            </div>
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-3.5 flex-1">
        {/* CEU Credits & Validity */}
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-muted/30 p-2.5 rounded-lg border border-border/30">
            <Award className="w-4 h-4 text-amber-500 mx-auto mb-1" />
            <span className="text-[10px] text-muted-foreground block">Credit Weight</span>
            <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{credential.ceu_credits} CEUs</span>
          </div>
          <div className="bg-muted/30 p-2.5 rounded-lg border border-border/30">
            <Users className="w-4 h-4 text-primary mx-auto mb-1" />
            <span className="text-[10px] text-muted-foreground block">Certified Scholars</span>
            <span className="text-sm font-bold">{credential.total_certified_scholars}</span>
          </div>
        </div>

        {/* Cryptographic Hash Preview */}
        <div className="bg-muted/30 p-2.5 rounded-lg border border-border/40 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1 font-medium">
              <Hash className="w-3 h-3 text-primary" /> Verification Hash
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-0.5">
              <CheckCircle className="w-3 h-3" /> SHA-256
            </span>
          </div>
          <p className="font-mono text-[10px] text-foreground/80 truncate bg-background/50 px-2 py-1 rounded border border-border/30">
            {credential.credential_hash}
          </p>
        </div>

        {/* Prerequisites */}
        <div className="text-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
            Prerequisites
          </span>
          <div className="flex flex-wrap gap-1">
            {credential.prerequisites.map((req, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-muted/60 text-muted-foreground px-2 py-0.5 rounded border border-border/30"
              >
                {req}
              </span>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2 pb-4 border-t border-border/40 bg-muted/10 flex items-center justify-between">
        <span className="font-mono text-xs text-primary font-bold">{credential.credential_token}</span>
        <Button
          size="sm"
          variant="outline"
          className="text-xs h-8 border-primary/30 hover:bg-primary/10 text-primary font-medium flex items-center gap-1.5"
          onClick={() => onVerify(credential)}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verify Credential</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
