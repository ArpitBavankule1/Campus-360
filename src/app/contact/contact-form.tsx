"use client";

import { useState } from "react";
import { Send, CheckCircle2, Building, Mail, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    institution: "",
    role: "student",
    inquiryType: "technical",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const generatedId = `INQ-${Math.floor(100000 + Math.random() * 900000)}`;
      setTicketId(generatedId);
      setLoading(false);
      setSubmitted(true);
    }, 900);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center animate-in fade-in-50 duration-300">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Message Dispatched Successfully!</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
          Thank you for reaching out. Your institutional inquiry has been logged under reference code:
        </p>
        <div className="my-4 inline-block font-mono text-base font-bold bg-background px-4 py-2 rounded-xl border border-border/80 text-primary shadow-xs">
          {ticketId}
        </div>
        <p className="text-xs text-muted-foreground">
          Our campus operations team will reply to <strong>{formData.email}</strong> within 1 business day.
        </p>
        <div className="mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSubmitted(false);
              setFormData({
                fullName: "",
                email: "",
                phone: "",
                institution: "",
                role: "student",
                inquiryType: "technical",
                subject: "",
                message: "",
              });
            }}
          >
            Submit Another Inquiry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="fullName" className="text-xs font-semibold">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="fullName"
              required
              placeholder="e.g. Aarav Sharma"
              className="pl-9 h-10 rounded-xl"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-semibold">
            Email Address <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              required
              placeholder="name@college.edu"
              className="pl-9 h-10 rounded-xl"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-xs font-semibold">
            Contact Number (Optional)
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              placeholder="+91 98765 43210"
              className="pl-9 h-10 rounded-xl"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="institution" className="text-xs font-semibold">
            Institution / College Name
          </Label>
          <div className="relative">
            <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="institution"
              placeholder="e.g. Apex Institute of Technology"
              className="pl-9 h-10 rounded-xl"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="role" className="text-xs font-semibold">
            Your Institutional Role
          </Label>
          <select
            id="role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="student">Student / Scholar</option>
            <option value="faculty">Faculty Member / Professor</option>
            <option value="hod">Department Head (HOD)</option>
            <option value="admin">College Administrator / Dean</option>
            <option value="partner">EdTech / Institutional Partner</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="inquiryType" className="text-xs font-semibold">
            Inquiry Category
          </Label>
          <select
            id="inquiryType"
            value={formData.inquiryType}
            onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="onboarding">Campus Deployment & Onboarding</option>
            <option value="technical">Technical Assistance & Help Desk</option>
            <option value="academic">Academic Collaboration & Features</option>
            <option value="security">Security & Role-Based Access Inquiry</option>
            <option value="general">General Campus Inquiry</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="subject" className="text-xs font-semibold">
          Subject <span className="text-destructive">*</span>
        </Label>
        <Input
          id="subject"
          required
          placeholder="Brief summary of your inquiry"
          className="h-10 rounded-xl"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message" className="text-xs font-semibold">
          Message & Details <span className="text-destructive">*</span>
        </Label>
        <textarea
          id="message"
          required
          rows={4}
          placeholder="Please share details regarding your inquiry, department, or requirements..."
          className="flex min-h-[100px] w-full rounded-xl border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full h-11 gap-2 font-semibold rounded-xl cursor-pointer">
        {loading ? (
          <>
            <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            <span>Transmitting Inquiry...</span>
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            <span>Send Institutional Message</span>
          </>
        )}
      </Button>
    </form>
  );
}
