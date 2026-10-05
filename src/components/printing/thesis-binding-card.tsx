"use client";

import React from "react";
import { ThesisBindingOrder } from "@/types";
import { BookOpen, Calendar, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface ThesisBindingCardProps {
  order: ThesisBindingOrder;
}

export function ThesisBindingCard({ order }: ThesisBindingCardProps) {
  const isNavyGold = order.cover_type.includes("Royal Navy");

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-6 hover:border-indigo-500/40 transition-all duration-300">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl border ${
              isNavyGold
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                : "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
            }`}
          >
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {order.order_code}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {order.binding_status}
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-1 line-clamp-1">
              {order.thesis_title}
            </h3>
            <p className="text-xs text-slate-400">
              {order.scholar_name} • {order.degree_program}
            </p>
          </div>
        </div>

        <div className="p-1.5 bg-white rounded-lg shadow-sm border border-slate-200">
          <QRCodeSVG value={order.order_code} size={48} />
        </div>
      </div>

      <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 mb-4 text-xs space-y-1.5">
        <div className="flex justify-between">
          <span className="text-slate-400">Cover Specification:</span>
          <span className="font-semibold text-amber-300 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {order.cover_type}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Copies Ordered:</span>
          <span className="font-semibold text-slate-200">{order.copies_requested} Hardbound Volumes</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Dept Approval:</span>
          <span className="font-semibold text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {order.department_signoff_status}
          </span>
        </div>
      </div>

      {/* Embossing preview */}
      <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 mb-4 text-[10px] font-mono text-slate-400">
        <span className="text-slate-500 block mb-0.5 uppercase tracking-wider">Gold Foil Spine Emboss:</span>
        <span className="text-slate-300">{order.embossing_text}</span>
      </div>

      <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800 text-slate-400">
        <div className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          <span>Ready by: <strong className="text-slate-200">{order.target_delivery_date}</strong></span>
        </div>
        <div className="text-right">
          <span className="text-slate-500">Total: </span>
          <strong className="text-white text-sm">₹{order.total_fee_inr}</strong>
        </div>
      </div>
    </div>
  );
}
