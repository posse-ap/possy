-- Seed data for local development
-- This file is run when you reset your database with: supabase db reset

-- Clear existing data (in reverse order of dependencies)
TRUNCATE mentor_responses, surveys CASCADE;

-- Insert surveys
INSERT INTO surveys (id, title, description, start_date, end_date, spreadsheet_url, spreadsheet_id, created_at) VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    '2025年新歓メンター日程調整',
    '新歓イベントのメンター参加可能日程を教えてください',
    '2025-01-01',
    '2025-01-31',
    'https://docs.google.com/spreadsheets/d/xxxxx',
    'xxxxx',
    '2024-12-20T10:00:00Z'
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    '春季イベントメンター募集',
    '春季イベントのメンター参加可能日程調査',
    '2025-03-01',
    '2025-03-31',
    'https://docs.google.com/spreadsheets/d/yyyyy',
    'yyyyy',
    '2024-12-25T15:00:00Z'
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    '夏季インターンメンター募集',
    '夏季インターンシップのメンター参加可能日程を教えてください',
    '2025-06-01',
    '2025-08-31',
    'https://docs.google.com/spreadsheets/d/zzzzz',
    'zzzzz',
    '2024-12-28T09:00:00Z'
  );

-- Insert mentor responses with slot data
INSERT INTO mentor_responses (id, survey_id, mentor_name, slots, submitted_at) VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    '山田 太郎',
    '[
      {"id": "slot-1-1", "date": "2025-01-05", "startTime": "10:00", "endTime": "12:00"},
      {"id": "slot-1-2", "date": "2025-01-06", "startTime": "14:00", "endTime": "16:00"},
      {"id": "slot-1-3", "date": "2025-01-10", "startTime": "09:00", "endTime": "11:00"}
    ]'::jsonb,
    '2025-01-01T10:00:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    '佐藤 花子',
    '[
      {"id": "slot-2-1", "date": "2025-01-07", "startTime": "13:00", "endTime": "15:00"},
      {"id": "slot-2-2", "date": "2025-01-08", "startTime": "10:00", "endTime": "12:00"}
    ]'::jsonb,
    '2025-01-01T11:30:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    '鈴木 次郎',
    '[
      {"id": "slot-3-1", "date": "2025-01-12", "startTime": "15:00", "endTime": "17:00"},
      {"id": "slot-3-2", "date": "2025-01-15", "startTime": "10:00", "endTime": "12:00"},
      {"id": "slot-3-3", "date": "2025-01-20", "startTime": "14:00", "endTime": "16:00"}
    ]'::jsonb,
    '2025-01-02T09:00:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000002',
    '田中 三郎',
    '[
      {"id": "slot-4-1", "date": "2025-03-05", "startTime": "09:00", "endTime": "11:00"},
      {"id": "slot-4-2", "date": "2025-03-10", "startTime": "13:00", "endTime": "15:00"}
    ]'::jsonb,
    '2025-01-03T14:00:00Z'
  ),
  (
    '10000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000002',
    '高橋 美咲',
    '[
      {"id": "slot-5-1", "date": "2025-03-08", "startTime": "10:00", "endTime": "12:00"},
      {"id": "slot-5-2", "date": "2025-03-15", "startTime": "14:00", "endTime": "16:00"},
      {"id": "slot-5-3", "date": "2025-03-20", "startTime": "09:00", "endTime": "11:00"}
    ]'::jsonb,
    '2025-01-03T16:00:00Z'
  );
