// ===========================================
// CampusLens AI — Application Constants
// ===========================================

export const APP_NAME = "CampusLens AI";
export const APP_TAGLINE = "Connect. Explore. Learn. Grow.";
export const APP_DESCRIPTION =
  "Your smart digital connection to college life.";
export const APP_LONG_DESCRIPTION =
  "One smart platform connecting students, faculty and college administration with everything you need for a better campus experience.";

// Navigation links for the public site
export const PUBLIC_NAV_LINKS = [
  { title: "Home", href: "/" },
  { title: "Features", href: "/features" },
  { title: "Campus Map", href: "/map" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
] as const;

// Feature cards for the landing page
export const FEATURES = [
  {
    icon: "GraduationCap",
    title: "Student Portal",
    description:
      "Access your timetable, notices, and campus information in one place.",
  },
  {
    icon: "School",
    title: "Campus Explorer",
    description:
      "Navigate campus with interactive maps and discover every location.",
  },
  {
    icon: "Bot",
    title: "AI Assistant",
    description:
      "Ask anything about your campus — powered by real college data.",
  },
  {
    icon: "Megaphone",
    title: "Smart Notices",
    description:
      "Stay updated with college and department announcements instantly.",
  },
  {
    icon: "CalendarDays",
    title: "Events & Schedule",
    description:
      "Never miss a class, seminar, or college event with smart scheduling.",
  },
  {
    icon: "MessageSquareText",
    title: "Student Help Desk",
    description:
      "Submit queries and track resolutions with the college administration.",
  },
] as const;

// How it works steps
export const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Register",
    description: "Create your account and join your college.",
  },
  {
    step: 2,
    title: "Connect",
    description: "Link with your department, faculty, and classmates.",
  },
  {
    step: 3,
    title: "Explore",
    description: "Discover campus locations, classrooms, and facilities.",
  },
  {
    step: 4,
    title: "Stay Updated",
    description: "Receive notices, event alerts, and schedule changes.",
  },
  {
    step: 5,
    title: "Ask Campus AI",
    description: "Get instant answers to any campus question.",
  },
] as const;
