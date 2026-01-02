-- Add additional fields to mentor_responses table for MentorResponseInput
-- These fields are required to store all the data from the mentor response form

ALTER TABLE mentor_responses
ADD COLUMN email TEXT,
ADD COLUMN posse TEXT CHECK (posse IN ('①', '②', '③')),
ADD COLUMN university TEXT,
ADD COLUMN generation TEXT CHECK (generation IN ('3期生', '4期生', '5期生', '6期生')),
ADD COLUMN available_capacity TEXT CHECK (available_capacity IN ('1チームならできます', '2〜3チームならできます', '3チーム以上できます'));

-- Add index for email queries
CREATE INDEX idx_mentor_responses_email ON mentor_responses(email);

COMMENT ON COLUMN mentor_responses.email IS 'メールアドレス';
COMMENT ON COLUMN mentor_responses.posse IS 'ポッセ（①、②、③）';
COMMENT ON COLUMN mentor_responses.university IS '大学名';
COMMENT ON COLUMN mentor_responses.generation IS '期生（3期生、4期生、5期生、6期生）';
COMMENT ON COLUMN mentor_responses.available_capacity IS '対応可能なチーム数';

