BEGIN;

TRUNCATE
  picturades_words,
  picturades_lists,
  picturades_users
  RESTART IDENTITY CASCADE;

INSERT INTO picturades_users
  (user_name, password, full_name)
VALUES
  ('djrenfro', 'password', 'Daniel Renfro'),
  ('larenfro', 'easypassword', 'Laurie Renfro');

INSERT INTO picturades_lists
  (title, game_type, user_id, creator_name)
VALUES
  ('Misc Actions 1', 'Charades', 1, 'Daniel Renfro'),
  ('Misc Actions 2', 'Charades', 2, 'Laurie Renfro'),
  ('Famous Cartoon Characters', 'Pictionary', 2, 'Laurie Renfro'),
  ('Vacation Spots: US', 'Pictionary', 2, 'Laurie Renfro'),
  ('Seasons: Summer', 'Pictionary', 1, 'Daniel Renfro');

INSERT INTO picturades_words
  (list_id, word)
VALUES
  (1, 'Washing Windows'),
  (1, 'Playing Twister'),
  (1, 'Diving in a Pool'),
  (1, 'Hiking'),
  (1, 'Taking a Picture'),
  (1, 'Cutting hair'),
  (1, 'Putting out a Fire'),
  (1, 'Opening Birthday Presents'),
  (1, 'Riding a Rollercoaster'),
  (1, 'Eating Spaghetti'),
  (1, 'Surfing'),
  (1, 'Climbing a Tree'),
  (1, 'Texting while Driving'),
  (1, 'Putting Makeup On'),
  (1, 'Running from a Bear'),
  (2, 'Skydiving'),
  (2, 'Sneezing'),
  (2, 'Jumping in Puddles'),
  (2, 'Putting a Baby to Sleep'),
  (2, 'Riding on a Zipline'),
  (2, 'Swing Dancing'),
  (2, 'Proposing'),
  (2, 'Building Sandcastles'),
  (2, 'Going down a waterslide'),
  (2, 'Jumping on a Trampoline'),
  (2, 'Studying at a Coffee Shop'),
  (2, 'Burping a baby'),
  (2, 'Trying on Clothes'),
  (2, 'Playing Hide & Seek'),
  (2, 'Making a Campfire'),
  (3, 'Bugs Bunny'),
  (3, 'Winnie the Pooh'),
  (3, 'Mickey Mouse'),
  (3, 'Fred Flinstone'),
  (3, 'Curious George'),
  (3, 'Popeye'),
  (3, 'The Grinch'),
  (3, 'Elmo'),
  (3, 'Donald Duck'),
  (3, 'Tom & Jerry'),
  (3, 'Pinnocchio'),
  (3, 'Tarzan'),
  (3, 'Clifford the Big Red Dog'),
  (3, 'Nemo'),
  (3, 'Tigger'),
  (4, 'Disney World'),
  (4, 'Niagara Falls'),
  (4, 'Golden Gate Bridge'),
  (4, 'Grand Canyon'),
  (4, 'Mount Rushmore'),
  (4, 'The Alamo'),
  (4, 'Statue ofliberty'),
  (4, 'Yellowstone National Park'),
  (4, 'Brooklyn Bridge'),
  (4, 'Empire State Building'),
  (4, 'Pearl Harbor'),
  (4, 'Six Flags'),
  (4, 'Alaska'),
  (4, 'Sea World'),
  (4, 'Redwoods'),
  (5, 'Swimming'),
  (5, 'Watermelon'),
  (5, 'Beach'),
  (5, '4th of July'),
  (5, 'Fireworks'),
  (5, 'Sandals'),
  (5, 'Pool Party'),
  (5, 'Road Trip'),
  (5, 'Sunscreen'),
  (5, 'Lemonade'),
  (5, 'No School'),
  (5, 'Tubing'),
  (5, 'Ice Cream'),
  (5, 'Fireflies'),
  (5, 'Picnic');

COMMIT;