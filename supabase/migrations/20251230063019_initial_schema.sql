-- Initial schema for possy
-- Minimal DB design: only metadata, actual data stored in Google Sheets

-- surveys table: アンケートのメタ情報
CREATE TABLE surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  spreadsheet_url TEXT NOT NULL,
  spreadsheet_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- mentor_responses table: 回答記録のメタ情報
-- 実際のSlotデータはスプレッドシートに保存
CREATE TABLE mentor_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
  mentor_name TEXT NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  spreadsheet_row_number INT,
  UNIQUE(survey_id, mentor_name)
);

-- Indexes
CREATE INDEX idx_mentor_responses_survey ON mentor_responses(survey_id);
CREATE INDEX idx_surveys_dates ON surveys(start_date, end_date);

-- Updated at trigger for surveys
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_surveys_updated_at
  BEFORE UPDATE ON surveys
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
