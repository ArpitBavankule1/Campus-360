"use client";

import React, { useState } from "react";
import { StageEquipmentRider, StageEquipmentType } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Volume2, CheckCircle2, Wrench } from "lucide-react";

interface StageEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (rider: StageEquipmentRider) => void;
}

export function StageEquipmentModal({
  isOpen,
  onClose,
  onSuccess,
}: StageEquipmentModalProps) {
  const [equipmentType, setEquipmentType] = useState<StageEquipmentType>("Wireless Lapel Mics");
  const [quantity, setQuantity] = useState("4");
  const [technicianAssigned, setTechnicianAssigned] = useState("Suresh Patil (Senior Sound Engineer)");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedRider, setConfirmedRider] = useState<StageEquipmentRider | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auditorium/equipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          equipmentType,
          quantity: Number(quantity),
          technicianAssigned,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setConfirmedRider(data.data);
        onSuccess(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setConfirmedRider(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-card/95 backdrop-blur-xl border-border/80">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Volume2 className="h-5 w-5 text-purple-500" />
            Dispatch AV Stage Equipment Rider
          </DialogTitle>
          <DialogDescription>
            Schedule acoustic sound, line array PA, or 4K telepresence gear.
          </DialogDescription>
        </DialogHeader>

        {confirmedRider ? (
          <div className="space-y-4 py-3 text-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
            <p className="text-sm font-semibold text-foreground">AV Gear Dispatched to Stage</p>
            <div className="rounded-lg bg-muted/60 p-3 text-xs space-y-1">
              <p>Gear: <strong className="text-foreground">{confirmedRider.equipment_type} ({confirmedRider.quantity} units)</strong></p>
              <p>Engineer: <strong className="text-foreground">{confirmedRider.technician_assigned}</strong></p>
            </div>
            <Button onClick={handleClose} className="w-full bg-purple-600 hover:bg-purple-500 text-white">
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Equipment Category</Label>
              <select
                value={equipmentType}
                onChange={(e) => setEquipmentType(e.target.value as any)}
                className="w-full text-xs rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="Wireless Lapel Mics">Wireless Lapel Mics (Shure ULX-D)</option>
                <option value="Digital Mixer 32-Ch">Digital Mixer 32-Ch (Behringer X32)</option>
                <option value="Line Array PA Speakers">Line Array PA Speakers (JBL VTX Series)</option>
                <option value="Moving Head LED Rigs">Moving Head LED Rigs (RoboSpot)</option>
                <option value="4K Telepresence Cameras">4K Telepresence Cameras (Sony PTZ)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Units Required</Label>
              <Input
                type="number"
                min="1"
                max="24"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Designated AV Technician</Label>
              <Input
                value={technicianAssigned}
                onChange={(e) => setTechnicianAssigned(e.target.value)}
                className="text-xs"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white mt-2"
            >
              {isSubmitting ? "Dispatching..." : "Assign & Dispatch Gear"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
