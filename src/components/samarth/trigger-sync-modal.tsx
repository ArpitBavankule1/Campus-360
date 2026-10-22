"use client";

import React, { useState } from "react";
import { SamarthModule } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  RefreshCw,
  Layers,
  ArrowLeftRight,
  Database,
  CheckCircle2,
} from "lucide-react";

interface TriggerSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  modules: SamarthModule[];
  onTrigger: (payload: {
    module_key: string;
    direction: "INBOUND" | "OUTBOUND" | "BIDIRECTIONAL";
    records_processed: number;
  }) => Promise<void>;
}

export function TriggerSyncModal({
  isOpen,
  onClose,
  modules,
  onTrigger,
}: TriggerSyncModalProps) {
  const [selectedModule, setSelectedModule] = useState(modules[0]?.module_key || "student_admissions_cuet");
  const [direction, setDirection] = useState<"INBOUND" | "OUTBOUND" | "BIDIRECTIONAL">("BIDIRECTIONAL");
  const [records, setRecords] = useState(150);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onTrigger({
        module_key: selectedModule,
        direction,
        records_processed: Number(records),
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-card border-border/80">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
            <RefreshCw className="h-5 w-5 text-indigo-500" />
            Trigger SAMARTH Microservice Sync
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Initiate manual bi-directional data exchange with MoE SAMARTH ERP Gateway.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Select Microservice Module</label>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="w-full text-xs h-9 bg-background border border-border/60 rounded px-2 text-foreground"
            >
              {modules.map((m) => (
                <option key={m.id} value={m.module_key}>
                  {m.name} ({m.module_key})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Sync Direction</label>
            <div className="grid grid-cols-3 gap-2">
              {(["INBOUND", "OUTBOUND", "BIDIRECTIONAL"] as const).map((dir) => (
                <button
                  type="button"
                  key={dir}
                  onClick={() => setDirection(dir)}
                  className={`text-xs py-1.5 px-2 rounded border font-medium transition-all ${
                    direction === dir
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "border-border/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {dir}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Batch Records to Process</label>
            <Input
              type="number"
              min="10"
              max="5000"
              value={records}
              onChange={(e) => setRecords(Number(e.target.value))}
              className="text-xs h-9 bg-background/50"
            />
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs h-8">
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8"
            >
              {isSubmitting ? "Syncing..." : "Execute Sync Pipeline"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
