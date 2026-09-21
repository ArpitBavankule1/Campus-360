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
