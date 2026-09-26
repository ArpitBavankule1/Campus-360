/**
 * CampusLens AI - Academic Timetable CSV & Printable Schedule Export Utility
 */

import type { TimetableSlotWithDetails } from "@/lib/supabase/queries";

export function exportTimetableToCSV(slots: TimetableSlotWithDetails[], departmentCode: string): void {
  if (typeof window === "undefined" || slots.length === 0) return;

  const headers = ["Day", "Start Time", "End Time", "Course Name", "Course Code", "Room", "Building", "Faculty", "Batch"];
  
  const rows = slots.map((slot) => [
    slot.day_of_week,
    slot.start_time,
    slot.end_time,
    `"${(slot.course_name || "").replace(/"/g, '""')}"`,
    slot.course_code || "",
    slot.room_number || "",
    slot.building_name || "",
    `"${(slot.faculty_name || "").replace(/"/g, '""')}"`,
    slot.batch_division || "All",
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `timetable-${departmentCode.toLowerCase()}-${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
