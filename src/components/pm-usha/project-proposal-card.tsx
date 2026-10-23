"use client";

import React, { useState } from "react";
import { PmUshaProjectProposal, PmUshaProposalStatus } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  Building,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface ProjectProposalCardProps {
  proposals: PmUshaProjectProposal[];
  onSelectProposal?: (proposal: PmUshaProjectProposal) => void;
  onNewProposal?: () => void;
}

export function ProjectProposalCard({
  proposals,
  onSelectProposal,
  onNewProposal,
}: ProjectProposalCardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredProposals = proposals.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.proposal_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.component_type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || p.approval_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: PmUshaProposalStatus) => {
    switch (status) {
      case "MoE_Approved":
        return (
          <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[11px] font-semibold flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> MoE Approved
          </Badge>
        );
      case "SHEC_Recommended":
        return (
          <Badge className="bg-blue-500/15 text-blue-400 border-blue-500/30 text-[11px] font-semibold flex items-center gap-1">
            <Clock className="h-3 w-3" /> SHEC Recommended
          </Badge>
        );
      case "Submitted":
        return (
          <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-[11px] font-semibold flex items-center gap-1">
            <Clock className="h-3 w-3" /> In Scrutiny
          </Badge>
        );
      case "Revision_Requested":
        return (
          <Badge className="bg-rose-500/15 text-rose-400 border-rose-500/30 text-[11px] font-semibold flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> Revision Requested
          </Badge>
        );
      default:
        return (
          <Badge className="bg-muted text-muted-foreground text-[11px] font-semibold">
            {status}
          </Badge>
        );
    }
  };

  const getComponentBadge = (type: string) => {
    switch (type) {
      case "MERU_UPGRADE":
        return "bg-purple-500/15 text-purple-400 border-purple-500/30";
      case "INFRASTRUCTURE_GRANTS":
        return "bg-teal-500/15 text-teal-400 border-teal-500/30";
      case "GENDER_EQUITY":
        return "bg-pink-500/15 text-pink-400 border-pink-500/30";
      case "DIGITAL_LEARNING_CENTER":
        return "bg-blue-500/15 text-blue-400 border-blue-500/30";
      default:
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    }
  };

  return (
    <Card className="border-border/60 bg-card/60 shadow-sm">
      <CardHeader className="p-5 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-400" />
              Detailed Project Reports (DPR) & Proposals Portfolio
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Comprehensive institutional upgrade projects submitted under PM-USHA components
            </CardDescription>
          </div>
          {onNewProposal && (
            <Button
              onClick={onNewProposal}
              size="sm"
              variant="outline"
              className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-xs font-medium"
            >
              + Create Proposal
            </Button>
          )}
        </div>

        {/* Filter and Search Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search by title, code or component..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 text-xs h-8 bg-background/50 border-border/60"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {["ALL", "MoE_Approved", "SHEC_Recommended", "Submitted"].map((st) => (
              <Button
                key={st}
                size="sm"
                variant={statusFilter === st ? "default" : "ghost"}
                onClick={() => setStatusFilter(st)}
                className={`text-xs h-7 px-2.5 capitalize ${
                  statusFilter === st
                    ? "bg-emerald-600 text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {st.replace(/_/g, " ")}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredProposals.map((proposal) => (
            <div
              key={proposal.id}
              className="p-4 rounded-xl border border-border/50 bg-background/50 hover:border-emerald-500/40 hover:bg-emerald-950/10 transition-all flex flex-col justify-between group cursor-pointer"
              onClick={() => onSelectProposal && onSelectProposal(proposal)}
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {proposal.proposal_code}
                    </span>
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {proposal.title}
                    </h3>
                  </div>
                  {getStatusBadge(proposal.approval_status)}
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-medium border ${getComponentBadge(
                      proposal.component_type
                    )}`}
                  >
                    {proposal.component_type.replace(/_/g, " ")}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Target: {proposal.target_completion_date}
                  </span>
                </div>

                {proposal.review_remarks && (
                  <p className="text-[11px] text-muted-foreground/90 italic bg-muted/40 p-2 rounded border border-border/30">
                    "{proposal.review_remarks}"
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-muted-foreground block">Approved / Estimated</span>
                  <span className="font-bold text-foreground">
                    ₹{proposal.approved_budget_lakhs.toFixed(2)} / ₹{proposal.estimated_budget_lakhs.toFixed(2)} L
                  </span>
                </div>
                <div className="text-right space-y-0.5">
                  <span className="text-[10px] text-muted-foreground block">Share Ratio</span>
                  <span className="font-semibold text-emerald-400">
                    {proposal.central_share_percentage}% Central : {proposal.state_share_percentage}% State
                  </span>
                </div>
              </div>
            </div>
          ))}

          {filteredProposals.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              <Building className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No project proposals match the search criteria.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
