CREATE TYPE category AS ENUM ('Charades', 'Pictionary');

ALTER TABLE picturades_lists
  DROP COLUMN game_type;

ALTER TABLE picturades_lists
  ADD COLUMN game_type category NOT NULL;