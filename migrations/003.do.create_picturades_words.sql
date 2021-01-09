CREATE TABLE picturades_words (
  id SERIAL PRIMARY KEY,
  word TEXT NOT NULL,
  list_id INTEGER REFERENCES picturades_lists(id) ON DELETE CASCADE
);