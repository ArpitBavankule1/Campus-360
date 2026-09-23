-- ================================================================
-- CampusLens AI — Safe Demo Seed Data
-- CAUTION: This seed data is for development / demonstration only.
-- All data is clearly marked as DEMO data.
-- ================================================================

-- 1. Demo Colleges
INSERT INTO public.colleges (
  id,
  name,
  code,
  description,
  logo_url,
  address,
  city,
  state,
  contact_email,
  contact_phone,
  website
) VALUES
(
  '11111111-1111-4111-8111-111111111111'::UUID,
  'Demo Apex Institute of Technology',
  'AIT',
  'Premier technological university committed to research, innovation, and holistic student development.',
  'https://images.unsplash.com/photo-1562774053-701939374585?w=200&auto=format&fit=crop&q=80',
  '100 Innovation Boulevard, Tech Park',
  'Bengaluru',
  'Karnataka',
  'admissions@demo-apex.edu',
  '+91 80 2345 6789',
  'https://demo-apex.edu'
),
(
  '22222222-2222-4222-8222-222222222222'::UUID,
  'Demo Metropolitan Engineering College',
  'MEC',
  'Autonomous engineering campus nurturing future engineering pioneers and entrepreneurs.',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=200&auto=format&fit=crop&q=80',
  '45 University Avenue, Knowledge City',
  'Pune',
  'Maharashtra',
  'connect@demo-mec.edu',
  '+91 20 9876 5432',
  'https://demo-mec.edu'
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = NOW();

-- 2. Demo Departments for Apex Institute of Technology (AIT)
INSERT INTO public.departments (
  id,
  college_id,
  name,
  code,
  description,
  building,
  room_number,
  contact_email
) VALUES
(
  'a1111111-1111-4111-8111-111111111111'::UUID,
  '11111111-1111-4111-8111-111111111111'::UUID,
  'Computer Science & Engineering',
  'CSE',
  'Department dedicated to algorithms, artificial intelligence, software systems, and data engineering.',
  'Alan Turing Block (Block A)',
  'A-301',
  'cse@demo-apex.edu'
),
(
  'a2222222-2222-4222-8222-222222222222'::UUID,
  '11111111-1111-4111-8111-111111111111'::UUID,
  'Information Technology',
  'IT',
  'Fostering cloud computing, cybersecurity, mobile app development, and enterprise applications.',
  'Ada Lovelace Block (Block B)',
  'B-205',
  'it@demo-apex.edu'
),
(
  'a3333333-3333-4333-8333-333333333333'::UUID,
  '11111111-1111-4111-8111-111111111111'::UUID,
  'Electronics & Telecommunication',
  'ECE',
  'Focusing on embedded systems, IoT, VLSI design, and signal processing.',
  'Shannon Hall (Block C)',
  'C-102',
  'ece@demo-apex.edu'
),
(
  'a4444444-4444-4444-8444-444444444444'::UUID,
  '11111111-1111-4111-8111-111111111111'::UUID,
  'Mechanical Engineering',
  'MECH',
  'Robotics, thermodynamics, automotive manufacturing, and CAD/CAM research.',
  'Newton Engineering Wing',
  'N-101',
  'mech@demo-apex.edu'
)
ON CONFLICT (college_id, code) DO NOTHING;

-- 3. Demo Departments for Metropolitan Engineering College (MEC)
INSERT INTO public.departments (
  id,
  college_id,
  name,
  code,
  description,
  building,
  room_number,
  contact_email
) VALUES
(
  'b1111111-1111-4111-8111-111111111111'::UUID,
  '22222222-2222-4222-8222-222222222222'::UUID,
  'Computer Engineering',
  'COMP',
  'Cutting edge software engineering, distributed systems, and machine learning.',
  'Aryabhata Academic Complex',
  'AC-401',
  'comp@demo-mec.edu'
),
(
  'b2222222-2222-4222-8222-222222222222'::UUID,
  '22222222-2222-4222-8222-222222222222'::UUID,
  'Data Science & AI',
  'DSAI',
  'Specialized in statistical modeling, neural networks, big data, and NLP.',
  'Ramanujan Tech Center',
  'RT-210',
  'dsai@demo-mec.edu'
)
ON CONFLICT (college_id, code) DO NOTHING;

-- ================================================================
-- 4. Demo Campus Locations for Apex Institute of Technology (AIT)
-- Coordinates centered around Bengaluru tech campus (12.9716° N, 77.5946° E)
-- ================================================================
INSERT INTO public.locations (
  id,
  college_id,
  name,
  code,
  category,
  building,
  floor,
  room_number,
  latitude,
  longitude,
  description,
  image_url,
  amenities,
  is_accessible,
  opening_time,
  closing_time
) VALUES
(
  'c1111111-1111-4111-8111-111111111111'::UUID,
  '11111111-1111-4111-8111-111111111111'::UUID,
  'Turing Computer Science Building',
  'LOC-CS',
  'academic',
  'Alan Turing Block (Block A)',
  '3rd Floor',
  'A-301 to A-320',
  12.9715987,
  77.5945627,
  'Main headquarters for Computer Science & Engineering department, faculty offices, and advanced computing labs.',
  'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&auto=format&fit=crop&q=80',
  ARRAY['Wi-Fi 6', 'Air Conditioned', 'Smart Displays', 'Elevator Access', 'Wheelchair Ramp'],
  true,
  '08:00 AM',
  '08:00 PM'
),
(
  'c2222222-2222-4111-8111-111111111111'::UUID,
  '11111111-1111-4111-8111-111111111111'::UUID,
  'Central Digital Library & Research Commons',
  'LOC-LIB',
  'library',
  'Vikram Sarabhai Knowledge Hub',
  'Ground to 3rd Floor',
  'LIB-100',
  12.9721050,
  77.5951200,
  'Four-storey state-of-the-art library with over 150,000 volumes, IEEE & ACM digital subscriptions, quiet study pods, and 24/7 reading hall.',
  'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=80',
  ARRAY['High-Speed Wi-Fi', 'Silent Study Pods', 'RFID Checkout', 'Cafe', 'Printing & Scanning'],
  true,
  '07:30 AM',
  '11:00 PM'
),
(
  'c3333333-3333-4111-8111-111111111111'::UUID,
  '11111111-1111-4111-8111-111111111111'::UUID,
  'Apex Innovation & AI Robotics Hub',
  'LOC-AI-LAB',
  'laboratory',
  'Ada Lovelace Block (Block B)',
  '1st Floor',
  'B-108',
  12.9712500,
  77.5939000,
  'Advanced AI and Machine Learning research facility equipped with NVIDIA DGX GPU workstations, robotics kits, and IoT testbeds.',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
  ARRAY['NVIDIA GPUs', '3D Printers', 'Oscilloscopes', 'VR Testbed'],
  true,
  '08:30 AM',
  '09:00 PM'
),
(
  'c4444444-4444-4111-8111-111111111111'::UUID,
  '11111111-1111-4111-8111-111111111111'::UUID,
  'Grand Tech Auditorium',
  'LOC-AUD',
  'auditorium',
  'Central Convocation Center',
  'Ground Floor',
  'AUD-01',
  12.9708000,
  77.5948000,
  '1,200-seat acoustic auditorium featuring 4K LED video wall, Dolby surround audio, and streaming infrastructure for conferences and festivals.',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
  ARRAY['4K Projection', 'Acoustic Walls', 'Green Rooms', 'Wheelchair Access'],
  true,
  '09:00 AM',
  '09:00 PM'
),
(
  'c5555555-5555-4111-8111-111111111111'::UUID,
  '11111111-1111-4111-8111-111111111111'::UUID,
  'Student Activity Center & Food Court',
  'LOC-CAFE',
  'cafeteria',
  'Student Plaza (Block D)',
  'Ground & 1st Floor',
  'SAC-G',
  12.9725000,
  77.5942000,
  'Dynamic culinary and recreation zone with multiple multi-cuisine counters, barista coffee bar, indoor table tennis, and lounge seating.',
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80',
  ARRAY['Organic Food Stations', 'Outdoor Patio', 'Charging Stations', 'Filtered Water'],
  true,
  '07:00 AM',
  '10:30 PM'
),
(
  'c6666666-6666-4111-8111-111111111111'::UUID,
  '11111111-1111-4111-8111-111111111111'::UUID,
  'Olympic Sports Complex & Gym',
  'LOC-SPORTS',
  'sports',
  'Chhatrapati Shivaji Sports Pavilion',
  'Ground Level',
  'SPT-01',
  12.9731000,
  77.5956000,
  'Full athletics stadium with synthetic 400m running track, Olympic-standard swimming pool, modern gym, and basketball courts.',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
  ARRAY['Locker Rooms', 'Showers', 'First Aid Station', 'Physiotherapy Center'],
  true,
  '06:00 AM',
  '09:30 PM'
)
ON CONFLICT (id) DO NOTHING;

-- ================================================================
-- 5. Demo Faculty for Computer Science & Engineering (AIT)
-- ================================================================
INSERT INTO public.faculty (
  id,
  college_id,
  department_id,
  name,
  designation,
  email,
  phone,
  office_room,
  bio,
  avatar_url,
  qualifications,
  specializations,
  office_hours
) VALUES
(
  'd1111111-1111-4111-8111-111111111111'::UUID,
  '11111111-1111-4111-8111-111111111111'::UUID,
  'a1111111-1111-4111-8111-111111111111'::UUID,
  'Dr. Rajeshwar Sharma',
  'Professor & Head of Department',
  'r.sharma@demo-apex.edu',
  '+91 80 2345 6701',
  'A-301, Turing Block',
  '20+ years of academia and industry research in Distributed Algorithms, Cloud Systems, and Database Optimizations.',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'Ph.D. in Computer Science (IISc Bengaluru)',
  ARRAY['Distributed Systems', 'Cloud Computing', 'Database Architecture'],
  'Mon & Wed: 02:00 PM - 04:00 PM'
),
(
  'd2222222-2222-4111-8111-111111111111'::UUID,
  '11111111-1111-4111-8111-111111111111'::UUID,
  'a1111111-1111-4111-8111-111111111111'::UUID,
  'Prof. Anita Desai',
  'Associate Professor',
  'anita.desai@demo-apex.edu',
  '+91 80 2345 6702',
  'A-308, Turing Block',
  'Leading the Artificial Intelligence & NLP laboratory. Author of 35+ peer-reviewed papers on deep neural networks.',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
  'M.Tech (IIT Bombay), Ph.D. (Pursuing)',
  ARRAY['Machine Learning', 'Computer Vision', 'Deep Learning', 'Python'],
  'Tue & Thu: 11:00 AM - 01:00 PM'
),
(
  'd3333333-3333-4111-8111-111111111111'::UUID,
  '11111111-1111-4111-8111-111111111111'::UUID,
  'a1111111-1111-4111-8111-111111111111'::UUID,
  'Dr. Vikramaditya Rao',
  'Assistant Professor',
  'v.rao@demo-apex.edu',
  '+91 80 2345 6703',
  'A-312, Turing Block',
  'Specialist in Cyber-Physical Systems, Operating Systems Kernel architecture, and modern secure network protocols.',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'Ph.D. in Computer Engineering (IIT Madras)',
  ARRAY['Operating Systems', 'Cybersecurity', 'Networks', 'Rust/C++'],
  'Wed & Fri: 03:00 PM - 05:00 PM'
)
ON CONFLICT (id) DO NOTHING;

-- ================================================================
-- 6. Demo Timetable for CSE Year 2 & 3
-- ================================================================
INSERT INTO public.timetable (
  id,
  college_id,
  department_id,
  year,
  division,
  day_of_week,
  start_time,
  end_time,
  subject_name,
  subject_code,
  faculty_id,
  faculty_name,
  room_number,
  type
) VALUES
-- Monday Schedule
(
  'e1111111-1111-4111-8111-111111111111'::UUID,
  '11111111-1111-4111-8111-111111111111'::UUID,
  'a1111111-1111-4111-8111-111111111111'::UUID,
  2,
  'A',
  'Monday',
  '09:00 AM',
  '10:00 AM',
  'Data Structures & Algorithms',
  'CS-201',
  'd1111111-1111-4111-8111-111111111111'::UUID,
  'Dr. Rajeshwar Sharma',
  'A-301 (Turing Lecture Hall)',
  'lecture'
),
(
  'e2222222-2222-4111-8111-111111111111'::UUID,
  '11111111-1111-4111-8111-111111111111'::UUID,
  'a1111111-1111-4111-8111-111111111111'::UUID,
  2,
  'A',
  'Monday',
  '10:15 AM',
  '11:15 AM',
  'Database Management Systems',
  'CS-202',
  'd3333333-3333-4111-8111-111111111111'::UUID,
  'Dr. Vikramaditya Rao',
  'A-302 (Seminar Room)',
  'lecture'
),
(
  'e3333333-3333-4111-8111-111111111111'::UUID,
  '11111111-1111-4111-8111-111111111111'::UUID,
  'a1111111-1111-4111-8111-111111111111'::UUID,
  2,
  'A',
  'Monday',
  '11:30 AM',
  '01:30 PM',
  'Data Structures Practical Lab',
  'CS-201L',
  'd1111111-1111-4111-8111-111111111111'::UUID,
  'Dr. Rajeshwar Sharma',
  'Lab 4 (Turing 2nd Floor)',
  'lab'
),
(
  'e4444444-4444-4111-8111-111111111111'::UUID,
  '11111111-1111-4111-8111-111111111111'::UUID,
  'a1111111-1111-4111-8111-111111111111'::UUID,
  2,
  'A',
  'Monday',
  '02:30 PM',
  '03:30 PM',
  'Artificial Intelligence Foundations',
  'CS-204',
  'd2222222-2222-4111-8111-111111111111'::UUID,
  'Prof. Anita Desai',
  'A-301 (Turing Lecture Hall)',
  'lecture'
),
-- Tuesday Schedule
(
  'e5555555-5555-4111-8111-111111111111'::UUID,
  '11111111-1111-4111-8111-111111111111'::UUID,
  'a1111111-1111-4111-8111-111111111111'::UUID,
  2,
  'A',
  'Tuesday',
  '09:00 AM',
  '10:00 AM',
  'Operating Systems & Kernel Architecture',
  'CS-203',
  'd3333333-3333-4111-8111-111111111111'::UUID,
  'Dr. Vikramaditya Rao',
  'A-301 (Turing Lecture Hall)',
  'lecture'
),
(
  'e6666666-6666-4111-8111-111111111111'::UUID,
  '11111111-1111-4111-8111-111111111111'::UUID,
  'a1111111-1111-4111-8111-111111111111'::UUID,
  2,
  'A',
  'Tuesday',
  '10:15 AM',
  '11:15 AM',
  'Discrete Mathematical Structures',
  'MA-201',
  'd1111111-1111-4111-8111-111111111111'::UUID,
  'Dr. Rajeshwar Sharma',
  'A-301 (Turing Lecture Hall)',
  'lecture'
),
-- Wednesday Schedule
(
  'e7777777-7777-4111-8111-111111111111'::UUID,
  '11111111-1111-4111-8111-111111111111'::UUID,
  'a1111111-1111-4111-8111-111111111111'::UUID,
  2,
  'A',
  'Wednesday',
  '09:00 AM',
  '11:00 AM',
  'Database Systems Lab & SQL Workshop',
  'CS-202L',
  'd3333333-3333-4111-8111-111111111111'::UUID,
  'Dr. Vikramaditya Rao',
  'Lab 2 (Turing 2nd Floor)',
  'lab'
),
-- Thursday Schedule
(
  'e8888888-8888-4111-8111-111111111111'::UUID,
  '11111111-1111-4111-8111-111111111111'::UUID,
  'a1111111-1111-4111-8111-111111111111'::UUID,
  2,
  'A',
  'Thursday',
  '10:00 AM',
  '11:00 AM',
  'Computer Networks & Protocols',
  'CS-205',
  'd3333333-3333-4111-8111-111111111111'::UUID,
  'Dr. Vikramaditya Rao',
  'A-301 (Turing Lecture Hall)',
  'lecture'
),
-- Friday Schedule
(
  'e9999999-9999-4111-8111-111111111111'::UUID,
  '11111111-1111-4111-8111-111111111111'::UUID,
  'a1111111-1111-4111-8111-111111111111'::UUID,
  2,
  'A',
  'Friday',
  '09:00 AM',
  '10:00 AM',
  'AI & Neural Networks Seminar',
  'CS-204T',
  'd2222222-2222-4111-8111-111111111111'::UUID,
  'Prof. Anita Desai',
  'Seminar Hall B',
  'tutorial'
)
ON CONFLICT (id) DO NOTHING;

-- ================================================================
-- 7. Demo Campus Notices
-- ================================================================
INSERT INTO public.notices (
  id,
  college_id,
  department_id,
  title,
  content,
  priority,
  category,
  author_name,
  is_pinned
) VALUES
(
  'f1111111-1111-4111-8111-111111111111'::UUID,
  '11111111-1111-4111-8111-111111111111'::UUID,
  'a1111111-1111-4111-8111-111111111111'::UUID,
  'Mid-Semester Theory & Practical Examination Schedule Announced',
  'The official schedule for the Autumn Semester Mid-Term Examinations is now released. Students must carry their institutional digital ID badge. Hall tickets will be verified at the entrance.',
  'urgent',
  'exam',
  'Office of the Controller of Examinations',
  true
),
(
  'f2222222-2222-4111-8111-111111111111'::UUID,
  '11111111-1111-4111-8111-111111111111'::UUID,
  NULL,
  'CampusLens Hackathon 2026: Registrations Now Live!',
  'Join 500+ student developers, designers, and innovators in a 36-hour sprint building real-world AI applications. Cash prizes worth ₹2,50,000 + internship interviews with top tech sponsors.',
  'important',
  'event',
  'Apex Innovation Council',
  true
),
(
  'f3333333-3333-4111-8111-111111111111'::UUID,
  '11111111-1111-4111-8111-111111111111'::UUID,
  NULL,
  'Central Digital Library: Extended 24/7 Hours for Study Weeks',
  'Starting this Monday, the Vikram Sarabhai Central Library reading floors will remain open 24 hours daily. Quiet study pods can be booked up to 48 hours in advance through the campus portal.',
  'normal',
  'academic',
  'Chief Librarian Desk',
  false
)
ON CONFLICT (id) DO NOTHING;

-- ================================================================
-- 8. Demo Campus Events
-- ================================================================
INSERT INTO public.events (
  id,
  college_id,
  department_id,
  title,
  description,
  category,
  start_date,
  end_date,
  location_id,
  venue_name,
  organizer,
  registration_link,
  image_url,
  is_featured
) VALUES
(
  '1a111111-1111-4111-8111-111111111111'::UUID,
  '11111111-1111-4111-8111-111111111111'::UUID,
  'a1111111-1111-4111-8111-111111111111'::UUID,
  'Apex AI & Cloud Summit 2026',
  'Keynote addresses by AI researchers from Google, Microsoft, and premier startups. Live demonstrations on autonomous robotics, multimodal LLMs, and quantum computing.',
  'tech',
  NOW() + INTERVAL '4 days',
  NOW() + INTERVAL '5 days',
  'c4444444-4444-4111-8111-111111111111'::UUID,
  'Grand Tech Auditorium (AUD-01)',
  'Computer Science Dept & IEEE Student Branch',
  'https://demo-apex.edu/ai-summit-2026',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
  true
),
(
  '1a222222-2222-4111-8111-111111111111'::UUID,
  '11111111-1111-4111-8111-111111111111'::UUID,
  NULL,
  'Inter-College Sports Championship 2026',
  'Athletics, football, basketball, and badminton tournaments featuring over 24 competing regional institutions. Opening ceremony starts at 08:30 AM.',
  'sports',
  NOW() + INTERVAL '10 days',
  NOW() + INTERVAL '12 days',
  'c6666666-6666-4111-8111-111111111111'::UUID,
  'Shivaji Sports Arena & Stadium',
  'Apex Sports Council',
  'https://demo-apex.edu/sports-2026',
  'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80',
  true
)
ON CONFLICT (id) DO NOTHING;

-- ================================================================
-- 9. Demo Facilities
-- ================================================================
INSERT INTO public.facilities (
  id,
  college_id,
  location_id,
  name,
  category,
  description,
  timings,
  in_charge,
  contact_email,
  is_available
) VALUES
(
  'fa111111-1111-4111-8111-111111111111'::UUID,
  '11111111-1111-4111-8111-111111111111'::UUID,
  'c2222222-2222-4111-8111-111111111111'::UUID,
  '24/7 Digital Research Commons & E-Library',
  'library',
  'Access to 250+ workstations, high-speed gigabit fiber, and quiet research rooms.',
  'Open 24/7 during semester terms',
  'Dr. Rameshwar Rao',
  'library@demo-apex.edu',
  true
),
(
  'fa222222-2222-4111-8111-111111111111'::UUID,
  '11111111-1111-4111-8111-111111111111'::UUID,
  'c3333333-3333-4111-8111-111111111111'::UUID,
  'NVIDIA High-Performance Computing Cluster',
  'laboratory',
  'Multi-node cluster dedicated to undergraduate and postgraduate AI/ML deep learning model training.',
  '08:30 AM - 09:00 PM (Requires lab pass)',
  'Prof. Anita Desai',
  'hpc-lab@demo-apex.edu',
  true
),
(
  'fa333333-3333-4111-8111-111111111111'::UUID,
  '11111111-1111-4111-8111-111111111111'::UUID,
  'c5555555-5555-4111-8111-111111111111'::UUID,
  'Student Center Cafeteria & Lounge',
  'cafeteria',
  'Healthy, hygienic meal options, fresh fruit juices, and student lounge area.',
  '07:00 AM - 10:30 PM',
  'Mr. Suresh Kadam',
  'dining@demo-apex.edu',
  true
)
ON CONFLICT (id) DO NOTHING;

