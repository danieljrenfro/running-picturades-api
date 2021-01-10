ALTER TABLE picturades_lists
  DROP COLUMN game_type;

ALTER TABLE picturades_lists
  ADD COLUMN game_type TEXT NOT NULL;

DROP TYPE IF EXISTS category;