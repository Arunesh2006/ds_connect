-- ==============================================================================
-- DS-CONNECT SEED DATA
-- Migration: seed.sql
-- Description: Realistic mock data for local testing and demonstration.
-- ==============================================================================

-- Mock User UUIDs for testing (Standard deterministic UUIDs)
do $$
declare
    admin_id uuid := '00000000-0000-0000-0000-000000000001';
    student1_id uuid := '00000000-0000-0000-0000-000000000002';
    student2_id uuid := '00000000-0000-0000-0000-000000000003';
    opp1_id uuid := '11111111-1111-1111-1111-111111111111';
    opp2_id uuid := '22222222-2222-2222-2222-222222222222';
    opp3_id uuid := '33333333-3333-3333-3333-333333333333';
begin
    -- 1. Insert Mock Profiles
    insert into public.profiles (id, name, email, avatar_url, college_year, role, bio, skills, github_handle, linkedin_url)
    values
    (
        admin_id,
        'Admin DS-Connect',
        'admin@dsconnect.edu',
        'https://api.dicebear.com/7.x/bottts/svg?seed=admin',
        4,
        'admin',
        'Platform Administrator and Data Science Society Lead.',
        array['System Design', 'PostgreSQL', 'Python', 'FastAPI'],
        'dsconnect-admin',
        'https://linkedin.com/in/dsconnect-admin'
    ),
    (
        student1_id,
        'Aarav Sharma',
        'aarav.sharma@dsconnect.edu',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=aarav',
        3,
        'student',
        'ML Enthusiast interested in Computer Vision and Transformer Architectures.',
        array['PyTorch', 'TensorFlow', 'FastAPI', 'Docker', 'Python'],
        'aarav-ml',
        'https://linkedin.com/in/aarav-sharma'
    ),
    (
        student2_id,
        'Priya Patel',
        'priya.patel@dsconnect.edu',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
        2,
        'student',
        'Aspiring Data Scientist with passion for Data Analytics, SQL, and PowerBI.',
        array['SQL', 'Pandas', 'Next.js', 'TypeScript', 'Tableau'],
        'priya-ds',
        'https://linkedin.com/in/priya-patel'
    )
    on conflict (id) do nothing;

    -- 2. Insert Sample Opportunities
    insert into public.opportunities (id, title, description, type, status, organizer, deadline, location, external_link, tags, submitted_by)
    values
    (
        opp1_id,
        'Kaggle AI Olympiad 2026',
        'Global competitive machine learning challenge focused on foundation models and complex reasoning.',
        'hackathon',
        'published',
        'Kaggle & Google AI',
        now() + interval '30 days',
        'Online',
        'https://kaggle.com/competitions',
        array['Kaggle', 'Machine Learning', 'NLP', 'Competition'],
        admin_id
    ),
    (
        opp2_id,
        'Smart India Hackathon 2026',
        'Nationwide initiative providing students a platform to solve pressing real-world problems through technology.',
        'hackathon',
        'published',
        'Ministry of Education Innovation Cell',
        now() + interval '45 days',
        'New Delhi / Hybrid',
        'https://sih.gov.in',
        array['National', 'GovTech', 'FullStack', 'AI'],
        admin_id
    ),
    (
        opp3_id,
        'Google Summer of Code (GSoC) 2026',
        'Global, online program focused on bringing new contributors into open source software development.',
        'internship',
        'published',
        'Google Open Source',
        now() + interval '60 days',
        'Remote',
        'https://summerofcode.withgoogle.com',
        array['OpenSource', 'Internship', 'Mentorship', 'Remote'],
        student1_id
    )
    on conflict (id) do nothing;

    -- 3. Insert Team Requests
    insert into public.team_requests (opportunity_id, requester_id, title, role_needed, skills_required, max_members, current_members_count, status)
    values
    (
        opp1_id,
        student1_id,
        'Looking for NLP Specialist for Kaggle Olympiad',
        'NLP / LLM Fine-tuning Engineer',
        array['PyTorch', 'HuggingFace', 'LoRA', 'LangChain'],
        3,
        1,
        'pending'
    ),
    (
        opp2_id,
        student2_id,
        'Frontend & UI/UX Developer for SIH Team',
        'React / Next.js Developer',
        array['Next.js', 'TailwindCSS', 'TypeScript', 'Figma'],
        4,
        2,
        'pending'
    )
    on conflict do nothing;

    -- 4. Sample Projects
    insert into public.projects (id, title, description, technologies, repo_url, live_url, owner_id)
    values
    (
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        'Campus Placement Predictor',
        'An end-to-end ML application predicting campus hiring fit using past placement datasets with explainable SHAP values.',
        array['Python', 'Scikit-Learn', 'FastAPI', 'Next.js'],
        'https://github.com/dsconnect/placement-predictor',
        'https://placement-predictor.demo.app',
        student1_id
    )
    on conflict (id) do nothing;

    -- 5. Sample Placements & Hiring Drives
    insert into public.placements (id, student_id, company, role, package_lpa, placement_year, eligibility, skills, location, application_deadline, application_link, description, status, is_verified, consent_for_public_display)
    values
    (
        '44444444-4444-4444-4444-444444444441',
        null,
        'Amazon AWS',
        'Applied Data Scientist - GenAI',
        34.50,
        2026,
        'B.Tech / M.Tech DS & AI, CGPA >= 7.5',
        array['Python', 'PyTorch', 'AWS SageMaker', 'Transformers', 'Distributed Training'],
        'Bangalore / Hybrid',
        now() + interval '25 days',
        'https://amazon.jobs',
        'Full-time campus drive for LLM fine-tuning and retrieval-augmented generation systems.',
        'active',
        true,
        true
    ),
    (
        '44444444-4444-4444-4444-444444444442',
        null,
        'Google Cloud',
        'Data Engineer & Systems Associate',
        38.00,
        2026,
        'B.Tech Pre-Final & Final Year, Strong DSA & SQL',
        array['SQL', 'BigQuery', 'Apache Spark', 'Python', 'Kafka'],
        'Hyderabad / Remote',
        now() + interval '35 days',
        'https://careers.google.com',
        'Infrastructure and petabyte-scale streaming analytics engineering role.',
        'active',
        true,
        true
    ),
    (
        '44444444-4444-4444-4444-444444444443',
        student1_id,
        'Microsoft IDC',
        'Research Engineer Intern',
        28.00,
        2026,
        'Past Published Research or Open Source Portfolio',
        array['C++', 'Python', 'ONNX Runtime', 'Deep Learning'],
        'Noida / Hybrid',
        now() + interval '15 days',
        'https://careers.microsoft.com',
        'Verified student placement offer for Aarav Sharma.',
        'active',
        true,
        true
    )
    on conflict (id) do nothing;

    -- 6. Sample Achievements
    insert into public.achievements (student_id, category, title, description, achievement_date, certificate_url)
    values
    (
        student1_id,
        'Hackathon Win',
        '1st Place — National AI Hackathon 2026',
        'Built real-time audio deepfake detector on edge hardware.',
        current_date - interval '10 days',
        'https://certificates.example.com/ai-hack-win'
    ),
    (
        student2_id,
        'Certification',
        'Google Professional Data Engineer',
        'Certified cloud data architect with BigQuery, Dataproc, and Pub/Sub mastery.',
        current_date - interval '30 days',
        'https://certificates.example.com/gcp-data-eng'
    )
    on conflict do nothing;

    -- 7. User Consents (DPDP Act Sample Audit)
    insert into public.user_consents (user_id, purpose, status, policy_version, ip_address)
    values
    (
        student1_id,
        'placement_public_listing',
        'granted',
        'v1.0',
        '127.0.0.1'
    ),
    (
        student2_id,
        'email_notifications',
        'granted',
        'v1.0',
        '127.0.0.1'
    )
    on conflict do nothing;

end $$;
