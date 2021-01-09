CREATE TABLE picturades_lists (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  game_type TEXT NOT NULL,
  creator_name TEXT NOT NULL,
  creator_id INTEGER REFERENCES picturades_users(id) ON DELETE SET NULL
);