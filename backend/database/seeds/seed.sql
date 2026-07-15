-- ============================================
-- Seed Data for Development
-- ============================================

-- Users (password for all: password123)
INSERT INTO users (id, name, email, role_id, password_hash) VALUES
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Alice Admin', 'alice@example.com', (SELECT id FROM roles WHERE name = 'admin'), '$2b$12$GamIU3O9zbCsZhctaOz0ZOog0dYnaWY9yJqiRKzkZT541az/5fjTa'),
    ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Bob Agent', 'bob@example.com', (SELECT id FROM roles WHERE name = 'agent'), '$2b$12$GamIU3O9zbCsZhctaOz0ZOog0dYnaWY9yJqiRKzkZT541az/5fjTa'),
    ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Charlie User', 'charlie@example.com', (SELECT id FROM roles WHERE name = 'user'), '$2b$12$GamIU3O9zbCsZhctaOz0ZOog0dYnaWY9yJqiRKzkZT541az/5fjTa'),
    ('d4e5f6a7-b8c9-0123-def0-234567890123', 'Diana Agent', 'diana@example.com', (SELECT id FROM roles WHERE name = 'agent'), '$2b$12$GamIU3O9zbCsZhctaOz0ZOog0dYnaWY9yJqiRKzkZT541az/5fjTa'),
    ('e5f6a7b8-c9d0-1234-ef01-345678901234', 'Eve User', 'eve@example.com', (SELECT id FROM roles WHERE name = 'user'), '$2b$12$GamIU3O9zbCsZhctaOz0ZOog0dYnaWY9yJqiRKzkZT541az/5fjTa');

-- Tickets
INSERT INTO tickets (id, title, description, priority, status, assigned_to, pr_link, created_by) VALUES
    (
        '11111111-1111-1111-1111-111111111111',
        'Login page shows blank screen on Safari',
        'Users on Safari 16+ report a blank white screen after entering credentials. Console shows a hydration mismatch error. Affects approximately 15% of users.',
        'critical',
        'in_progress',
        'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        'https://github.com/org/repo/pull/42',
        'c3d4e5f6-a7b8-9012-cdef-123456789012'
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'Add dark mode toggle to settings',
        'Users have requested a dark mode option. Should persist preference in localStorage and respect system preference by default.',
        'medium',
        'open',
        NULL,
        NULL,
        'e5f6a7b8-c9d0-1234-ef01-345678901234'
    ),
    (
        '33333333-3333-3333-3333-333333333333',
        'Database connection pool exhaustion under load',
        'During peak hours (9-10 AM), the connection pool maxes out causing 503 errors. Current pool size is 10, need to investigate optimal sizing and implement connection recycling.',
        'high',
        'open',
        'd4e5f6a7-b8c9-0123-def0-234567890123',
        NULL,
        'b2c3d4e5-f6a7-8901-bcde-f12345678901'
    ),
    (
        '44444444-4444-4444-4444-444444444444',
        'Update user onboarding email template',
        'The welcome email still references the old product name. Update copy and add the new logo. Marketing has approved the new text.',
        'low',
        'resolved',
        'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        'https://github.com/org/repo/pull/38',
        'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
    ),
    (
        '55555555-5555-5555-5555-555555555555',
        'Implement rate limiting on public API',
        'Public API endpoints need rate limiting to prevent abuse. Implement 100 req/min per IP for unauthenticated and 1000 req/min for authenticated users.',
        'high',
        'closed',
        'd4e5f6a7-b8c9-0123-def0-234567890123',
        'https://github.com/org/repo/pull/35',
        'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
    ),
    (
        '66666666-6666-6666-6666-666666666666',
        'Fix CSV export encoding issue',
        'Exported CSV files show garbled characters for non-ASCII names. Need to add BOM and ensure UTF-8 encoding throughout the export pipeline.',
        'medium',
        'cancelled',
        NULL,
        NULL,
        'c3d4e5f6-a7b8-9012-cdef-123456789012'
    );

-- Comments
INSERT INTO comments (ticket_id, message, created_by) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Reproduced on Safari 16.4. The issue is in the SSR hydration step where date formatting differs between server and client.', 'b2c3d4e5-f6a7-8901-bcde-f12345678901'),
    ('11111111-1111-1111-1111-111111111111', 'Found the root cause — Intl.DateTimeFormat returns different results on Safari. Switching to date-fns for consistent formatting.', 'b2c3d4e5-f6a7-8901-bcde-f12345678901'),
    ('11111111-1111-1111-1111-111111111111', 'Thanks for the quick turnaround! Will test once the PR is merged.', 'c3d4e5f6-a7b8-9012-cdef-123456789012'),
    ('33333333-3333-3333-3333-333333333333', 'Looking into pgBouncer as an intermediate connection pooler. Should help with connection reuse.', 'd4e5f6a7-b8c9-0123-def0-234567890123'),
    ('44444444-4444-4444-4444-444444444444', 'New copy applied and logo updated. Sent test email to marketing for final approval.', 'b2c3d4e5-f6a7-8901-bcde-f12345678901'),
    ('44444444-4444-4444-4444-444444444444', 'Marketing confirmed — looks great. Ready to close.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'),
    ('55555555-5555-5555-5555-555555555555', 'Deployed to production. Monitoring shows no legitimate users are hitting the limit.', 'd4e5f6a7-b8c9-0123-def0-234567890123'),
    ('22222222-2222-2222-2222-222222222222', 'I can pick this up next sprint. Should we use CSS variables or a theme context?', 'b2c3d4e5-f6a7-8901-bcde-f12345678901');
