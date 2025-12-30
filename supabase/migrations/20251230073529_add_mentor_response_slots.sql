-- Add mentor_response_slots table to store slot information in DB
-- This allows displaying slots without requiring Google Sheets API access

CREATE TABLE mentor_response_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id UUID NOT NULL REFERENCES mentor_responses(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_mentor_response_slots_response_id ON mentor_response_slots(response_id);
CREATE INDEX idx_mentor_response_slots_date ON mentor_response_slots(date);

-- Add some seed data for existing responses (example)
-- Note: This is just for demonstration. Actual data would come from form submissions.
COMMENT ON TABLE mentor_response_slots IS 'Stores time slots for mentor availability responses';
