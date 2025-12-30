-- Seed data for local development
-- This file is run when you reset your database with: supabase db reset

-- Clear existing data (in reverse order of dependencies)
TRUNCATE mentor_responses, surveys CASCADE;

-- Insert surveys
INSERT INTO surveys (id, title, description, start_date, end_date, spreadsheet_url, spreadsheet_id, created_at) VALUES
  (
    'test-survey-123',
    '2025年新歓メンター日程調整',
    '新歓イベントのメンター参加可能日程を教えてください',
    '2025-01-01',
    '2025-01-31',
    'https://docs.google.com/spreadsheets/d/xxxxx',
    'xxxxx',
    '2024-12-20T10:00:00Z'
  ),
  (
    'survey-456',
    '春季イベントメンター募集',
    '春季イベントのメンター参加可能日程調査',
    '2025-03-01',
    '2025-03-31',
    'https://docs.google.com/spreadsheets/d/yyyyy',
    'yyyyy',
    '2024-12-25T15:00:00Z'
  ),
  (
    'survey-789',
    '夏季インターンメンター募集',
    '夏季インターンシップのメンター参加可能日程を教えてください',
    '2025-06-01',
    '2025-08-31',
    'https://docs.google.com/spreadsheets/d/zzzzz',
    'zzzzz',
    '2024-12-28T09:00:00Z'
  );

-- Insert mentor responses
-- Note: Actual slot data is stored in Google Sheets
INSERT INTO mentor_responses (id, survey_id, mentor_name, submitted_at, spreadsheet_row_number) VALUES
  (
    'r1',
    'test-survey-123',
    '山田 太郎',
    '2025-01-01T10:00:00Z',
    2
  ),
  (
    'r2',
    'test-survey-123',
    '佐藤 花子',
    '2025-01-01T11:30:00Z',
    3
  ),
  (
    'r3',
    'test-survey-123',
    '鈴木 次郎',
    '2025-01-02T09:00:00Z',
    4
  ),
  (
    'r4',
    'survey-456',
    '田中 三郎',
    '2025-01-03T14:00:00Z',
    2
  ),
  (
    'r5',
    'survey-456',
    '高橋 美咲',
    '2025-01-03T16:00:00Z',
    3
  );
