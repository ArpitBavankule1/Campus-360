import { NextResponse } from "next/server";
import {
  MOCK_LOCATIONS,
  MOCK_FACULTY,
  MOCK_TIMETABLE,
  MOCK_NOTICES,
  MOCK_EVENTS,
  MOCK_DEPARTMENTS,
} from "@/lib/supabase/queries";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages: ChatMessage[] = body.messages || [];

    if (!messages.length) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    const query = lastMessage.content.toLowerCase().trim();

    // Context knowledge grounding
    let reply = "";
    let relatedLinks: Array<{ title: string; href: string }> = [];
    let suggestions: string[] = [];

    // 1. Locations & Campus Navigation
    if (
      query.includes("where is") ||
      query.includes("location") ||
      query.includes("how to reach") ||
      query.includes("directions") ||
      query.includes("building") ||
      query.includes("library") ||
      query.includes("turing") ||
      query.includes("sports") ||
      query.includes("gym") ||
      query.includes("cafeteria") ||
      query.includes("auditorium") ||
      query.includes("lab")
    ) {
      if (query.includes("library") || query.includes("books")) {
        const lib = MOCK_LOCATIONS.find((l) => l.category === "library") || MOCK_LOCATIONS[1];
        reply = `🏛️ **${lib.name}**\n\n• **Location:** ${lib.building}, ${lib.floor} (${lib.room_number})\n• **Operating Hours:** ${lib.opening_time} – ${lib.closing_time}\n• **Amenities:** ${lib.amenities?.join(", ") || "Wi-Fi, Study Pods, Digital Catalog"}\n• **Description:** ${lib.description}\n• **Help Desk Contact:** ${lib.contact_number}\n\nYou can access quiet study pods on the 2nd floor with your student RFID card.`;
        relatedLinks = [
          { title: "View Library on Campus Map", href: `/map?id=${lib.id}` },
          { title: "Explore Location Details", href: `/explore/${lib.id}` },
        ];
        suggestions = [
          "What are the library RFID check-in rules?",
          "Where is the Turing Computer Science block?",
          "What is the schedule for today?",
        ];
      } else if (query.includes("ai") || query.includes("robotics") || query.includes("b-108")) {
        const lab = MOCK_LOCATIONS.find((l) => l.code === "LOC-AI-LAB") || MOCK_LOCATIONS[2];
        reply = `🤖 **${lab.name}**\n\n• **Location:** ${lab.building}, ${lab.floor} (Room ${lab.room_number})\n• **Hours:** ${lab.opening_time} – ${lab.closing_time}\n• **Facilities:** Equipped with NVIDIA DGX GPU compute clusters, 3D prototyping printers, and autonomous robotics testbeds.\n• **Access Requirement:** Requires research project clearance endorsed by your faculty guide or department HOD.`;
        relatedLinks = [
          { title: "Navigate to AI Lab on Map", href: `/map?id=${lab.id}` },
          { title: "Request Lab Access via Help Desk", href: "/help-desk/new" },
        ];
        suggestions = [
          "Who is Prof. Anita Desai?",
          "How do I request lab workstation access?",
          "What are the upcoming tech events?",
        ];
      } else if (query.includes("sports") || query.includes("gym") || query.includes("pool")) {
        const sp = MOCK_LOCATIONS.find((l) => l.category === "sports") || MOCK_LOCATIONS[5];
        reply = `⚽ **${sp.name}**\n\n• **Location:** ${sp.building}\n• **Hours:** Open daily from ${sp.opening_time} to ${sp.closing_time}\n• **Features:** Synthetic 400m running track, Olympic indoor swimming pool, multi-court gymnasium, and sports medicine room.\n• **Entry:** Free access for registered college students with active digital ID badge.`;
        relatedLinks = [
          { title: "Locate Sports Complex on Map", href: `/map?id=${sp.id}` },
          { title: "View Sports Tournaments & Events", href: "/events?category=sports" },
        ];
        suggestions = [
          "When is the Inter-College Sports Championship?",
          "Where is the Student Activity Center cafeteria?",
          "Show my digital student ID card",
        ];
      } else {
        reply = `🗺️ **Campus Navigation & Facilities Guide**\n\nApex Institute of Technology features 6 primary landmark hubs:\n\n1. **Alan Turing Block (Block A):** Computer Science & IT departments, classrooms, faculty suites.\n2. **Vikram Sarabhai Knowledge Hub:** 4-storey central library, IEEE digital commons (Open until 11:00 PM).\n3. **Ada Lovelace Block (Block B):** Innovation labs, AI & Robotics center (Room B-108).\n4. **Central Convocation Auditorium:** 1,200-seat theater for guest lectures and cultural events.\n5. **Student Activity Center (SAC):** Multi-cuisine food court, indoor games, and student council lounge.\n6. **Chhatrapati Shivaji Sports Pavilion:** Olympic athletic stadium, fitness gym, and courts.`;
        relatedLinks = [
          { title: "Open Interactive 3D Campus Map", href: "/map" },
          { title: "Browse Campus Directory", href: "/explore" },
        ];
        suggestions = [
          "Where is the Central Digital Library?",
          "Where is the AI & Robotics Lab?",
          "What is the food court timing?",
        ];
      }
    }

    // 2. Timetable & Classes
    else if (
      query.includes("timetable") ||
      query.includes("class") ||
      query.includes("lecture") ||
      query.includes("schedule") ||
      query.includes("monday") ||
      query.includes("tuesday") ||
      query.includes("wednesday") ||
      query.includes("thursday") ||
      query.includes("friday") ||
      query.includes("slot")
    ) {
      const day = query.includes("tuesday")
        ? "Tuesday"
        : query.includes("wednesday")
        ? "Wednesday"
        : query.includes("thursday")
        ? "Thursday"
        : query.includes("friday")
        ? "Friday"
        : "Monday";

      const dayClasses = MOCK_TIMETABLE.filter(
        (c) => c.day_of_week.toLowerCase() === day.toLowerCase()
      );

      reply = `📅 **Class Timetable for ${day} (Year 3 - CSE Div A)**\n\nHere are your scheduled academic slots for ${day}:\n\n` +
        dayClasses
          .map(
            (c, i) =>
              `${i + 1}. **${c.subject_name} (${c.subject_code})**\n   ⏰ ${c.start_time} - ${c.end_time} | 📍 Room ${c.room_number}\n   👨‍🏫 Faculty: ${c.faculty_name} (${c.type.toUpperCase()})`
          )
          .join("\n\n") +
        `\n\n💡 *Tip: Laboratory sessions require lab apron and pre-submitted journal assignments.*`;

      relatedLinks = [
        { title: `Open Full ${day} Timetable`, href: `/timetable?day=${day}` },
        { title: "Faculty Directory", href: "/faculty" },
      ];
      suggestions = [
        "What classes do I have on Tuesday?",
        "Who teaches Advanced Algorithms?",
        "Where is Room A-301?",
      ];
    }

    // 3. Faculty & HOD Details
    else if (
      query.includes("faculty") ||
      query.includes("professor") ||
      query.includes("teacher") ||
      query.includes("hod") ||
      query.includes("rajeshwar") ||
      query.includes("anita desai") ||
      query.includes("vikramaditya") ||
      query.includes("office hours")
    ) {
      if (query.includes("hod") || query.includes("rajeshwar") || query.includes("head")) {
        const hod = MOCK_FACULTY[0];
        reply = `👨‍🏫 **${hod.name}**\n\n• **Role:** ${hod.designation}\n• **Department:** Computer Science & Engineering\n• **Office:** ${hod.office_room}\n• **Office Hours:** ${hod.office_hours}\n• **Email:** [${hod.email}](mailto:${hod.email})\n• **Qualifications:** ${hod.qualifications}\n• **Specializations:** ${hod.specializations?.join(", ") || "Computer Science"}\n\n${hod.bio}`;
        relatedLinks = [
          { title: "View Computer Science Department", href: "/departments" },
          { title: "Full Faculty Directory", href: "/faculty" },
        ];
        suggestions = [
          "Who teaches Machine Learning?",
          "Where is Turing Block Room A-301?",
          "How to submit a grade re-check ticket?",
        ];
      } else if (query.includes("anita") || query.includes("ml") || query.includes("ai")) {
        const prof = MOCK_FACULTY[1];
        reply = `👩‍🏫 **${prof.name}**\n\n• **Designation:** ${prof.designation}\n• **Office:** ${prof.office_room}\n• **Consultation Hours:** ${prof.office_hours}\n• **Email:** [${prof.email}](mailto:${prof.email})\n• **Research Focus:** ${prof.specializations?.join(", ") || "Machine Learning"}\n\n${prof.bio}`;
        relatedLinks = [
          { title: "View AI Lab Details", href: "/explore/c3333333-3333-4111-8111-111111111111" },
          { title: "Browse Faculty Directory", href: "/faculty" },
        ];
        suggestions = [
          "How can I join the AI Robotics Lab?",
          "Who is the HOD of CSE?",
          "Show timetable for Wednesday",
        ];
      } else {
        reply = `👥 **Apex Engineering Faculty Directory**\n\nOur teaching staff includes distinguished researchers and professors:\n\n` +
          MOCK_FACULTY.map(
            (f) =>
              `• **${f.name}** — ${f.designation}\n  🏢 Office: ${f.office_room} | ⏰ Hours: ${f.office_hours}\n  📧 ${f.email}`
          ).join("\n\n");
        relatedLinks = [
          { title: "Explore Full Faculty Directory", href: "/faculty" },
          { title: "Browse Academic Departments", href: "/departments" },
        ];
        suggestions = [
          "Who is the HOD of Computer Science?",
          "When are Prof. Anita Desai's office hours?",
          "Where is Dr. Vikramaditya Rao's office?",
        ];
      }
    }

    // 4. Notices & Circulars
    else if (
      query.includes("notice") ||
      query.includes("circular") ||
      query.includes("exam") ||
      query.includes("announcement") ||
      query.includes("mid-term") ||
      query.includes("grades")
    ) {
      reply = `📢 **Latest Institutional Circulars & Notices**\n\n` +
        MOCK_NOTICES.map(
          (n) =>
            `• **[${n.priority.toUpperCase()}] ${n.title}** (${n.category.toUpperCase()})\n  ${n.content}`
        ).join("\n\n");
      relatedLinks = [
        { title: "View All Institutional Notices", href: "/notices" },
        { title: "Open Exam Timetable", href: "/timetable" },
      ];
      suggestions = [
        "What are the mid-term exam rules?",
        "When is the Hackathon 2026 registration deadline?",
        "How do I raise an exam mark inquiry?",
      ];
    }

    // 5. Events & Hackathons
    else if (
      query.includes("event") ||
      query.includes("hackathon") ||
      query.includes("fest") ||
      query.includes("sports") ||
      query.includes("cultural") ||
      query.includes("summit")
    ) {
      reply = `🎉 **Upcoming Campus Festivals & Tech Events**\n\n` +
        MOCK_EVENTS.map(
          (e) =>
            `✨ **${e.title}**\n• **Date:** ${new Date(e.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}${e.end_date ? ` - ${new Date(e.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : ""}\n• **Venue:** ${e.venue_name}\n• **Organizer:** ${e.organizer}\n• **Highlights:** ${e.description}`
        ).join("\n\n");
      relatedLinks = [
        { title: "Explore Campus Events Calendar", href: "/events" },
        { title: "Grand Tech Auditorium on Map", href: "/map" },
      ];
      suggestions = [
        "How do I register for the Hackathon?",
        "Where is the Grand Tech Auditorium?",
        "What is the schedule for Sports Championship?",
      ];
    }

    // 6. Help Desk & Support
    else if (
      query.includes("help") ||
      query.includes("support") ||
      query.includes("ticket") ||
      query.includes("wifi") ||
      query.includes("wi-fi") ||
      query.includes("rfid") ||
      query.includes("mess") ||
      query.includes("complaint")
    ) {
      reply = `🛠️ **Campus Help Desk & Service SLA Guide**\n\nIf you are experiencing any technical, hostel, or academic issues:\n\n1. **IT & Wi-Fi Support:** Report network drops or router outages in your hostel wing. Typical SLA: < 4 hours.\n2. **Library RFID Cards:** If turnstiles fail to recognize your card, visit Desk 2 in Vikram Sarabhai Hub or raise a ticket.\n3. **Grade / Exam Inquiries:** Submit mid-term score re-totaling requests within 7 days of result publishing.\n4. **Hostel & Amenities:** Mess rebate applications and room repair tickets can be tracked online with staff replies.`;
      relatedLinks = [
        { title: "Raise a Support Ticket", href: "/help-desk/new" },
        { title: "View Existing Tickets", href: "/help-desk" },
      ];
      suggestions = [
        "How do I apply for a hostel mess rebate?",
        "My RFID card does not work at library",
        "Where is the IT control room?",
      ];
    }

    // Default Fallback
    else {
      reply = `👋 **Hello! I am CampusLens AI, your personal 24/7 college connect assistant.**\n\nI can assist you with real-time institutional information, including:\n\n• **Campus Navigation:** Finding lecture halls, labs, library pods, cafeterias, and athletic fields.\n• **Class Schedules:** Looking up today's or weekly timetable slots, room numbers, and faculty.\n• **Faculty Directory:** Office rooms, email contacts, qualifications, and consultation hours.\n• **Circulars & Exams:** Important dates, mid-term announcements, and holiday circulars.\n• **Events & Fests:** Hackathons, technical summits, and cultural events.\n• **Help Desk:** Submitting and tracking service tickets for Wi-Fi, RFID cards, and hostel amenities.\n\n*How can I assist your campus journey today?*`;
      relatedLinks = [
        { title: "View Today's Timetable", href: "/timetable" },
        { title: "Interactive Campus Map", href: "/map" },
        { title: "Explore Support Help Desk", href: "/help-desk" },
      ];
      suggestions = [
        "Where is the AI & Robotics Lab?",
        "What classes do I have on Monday?",
        "Who is the Head of Computer Science?",
        "When is the next college hackathon?",
      ];
    }

    return NextResponse.json({
      reply,
      relatedLinks,
      suggestions,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Internal AI routing error" },
      { status: 500 }
    );
  }
}
