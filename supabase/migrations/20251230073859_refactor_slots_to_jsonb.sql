-- Refactor: Store slots as JSONB in mentor_responses table instead of separate table
-- This is more efficient: 1 response = 1 record with embedded slots

-- Drop the separate slots table
DROP TABLE IF EXISTS mentor_response_slots CASCADE;

-- Add slots column to mentor_responses
ALTER TABLE mentor_responses
ADD COLUMN slots JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Add index for querying slots
CREATE INDEX idx_mentor_responses_slots ON mentor_responses USING gin(slots);

COMMENT ON COLUMN mentor_responses.slots IS 'Array of slot objects with date, startTime, endTime';
