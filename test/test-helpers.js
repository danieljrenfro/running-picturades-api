function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'djrenfro',
      password: 'password',
      full_name: 'Daniel Renfro'
    },
    {
      id: 2,
      user_name: 'larenfro',
      password: 'easypassword',
      full_name: 'Laurie Renfro'
    },
    { 
      id: 3,
      user_name: 'hcmacias',
      password: 'betterpassword',
      full_name: 'Hannah Macias'
    }
  ];
}

function makeListsArray() {
  return [
    {
      id: 1,
      title: 'Misc Actions 1',
      game_type: 'Charades',
      creator_id: 1,
      creator_name: 'Daniel Renfro'
    },
    {
      id: 2,
      title: 'Misc Actions 2',
      game_type: 'Charades',
      creator_id: 2,
      creator_name: 'Laurie Renfro'
    },
    {
      id: 3,
      title: 'Famous Cartoon Characters',
      game_type: 'Pictionary',
      creator_id: 2,
      creator_name: 'Laurie Renfro'
    }
  ];
}

function makeWordsArray() {
  return [
    {id: 1, list_id: 1, word: 'Washing Windows'},
    {id: 2, list_id: 1, word: 'Playing Twister'},
    {id: 3, list_id: 1, word: 'Diving in a Pool'},
    {id: 4, list_id: 1, word: 'Hiking'},
    {id: 5, list_id: 1, word: 'Taking a Picture'},
    {id: 6, list_id: 1, word: 'Cutting hair'},
    {id: 7, list_id: 1, word: 'Putting out a Fire'},
    {id: 8, list_id: 1, word: 'Opening Birthday Presents'},
    {id: 9, list_id: 1, word: 'Riding a Rollercoaster'},
    {id: 10, list_id: 1, word: 'Eating Spaghetti'},
    {id: 11, list_id: 1, word: 'Surfing'},
    {id: 12, list_id: 1, word: 'Climbing a Tree'},
    {id: 13, list_id: 1, word: 'Texting while Driving'},
    {id: 14, list_id: 1, word: 'Putting Makeup On'},
    {id: 15, list_id: 1, word: 'Running from a Bear'},
    {id: 16, list_id: 2, word: 'Skydiving'},
    {id: 17, list_id: 2, word: 'Sneezing'},
    {id: 18, list_id: 2, word: 'Jumping in Puddles'},
    {id: 19, list_id: 2, word: 'Putting a Baby to Sleep'},
    {id: 20, list_id: 2, word: 'Riding on a Zipline'},
    {id: 21, list_id: 2, word: 'Swing Dancing'},
    {id: 22, list_id: 2, word: 'Proposing'},
    {id: 23, list_id: 2, word: 'Building Sandcastles'},
    {id: 24, list_id: 2, word: 'Going down a waterslide'},
    {id: 25, list_id: 2, word: 'Jumping on a Trampoline'},
    {id: 26, list_id: 2, word: 'Studying at a Coffee Shop'},
    {id: 27, list_id: 2, word: 'Burping a baby'},
    {id: 28, list_id: 2, word: 'Trying on Clothes'},
    {id: 29, list_id: 2, word: 'Playing Hide & Seek'},
    {id: 30, list_id: 2, word: 'Making a Campfire'},
    {id: 31, list_id: 3, word: 'Bugs Bunny'},
    {id: 32, list_id: 3, word: 'Winnie the Pooh'},
    {id: 33, list_id: 3, word: 'Mickey Mouse'},
    {id: 34, list_id: 3, word: 'Fred Flinstone'},
    {id: 35, list_id: 3, word: 'Curious George'},
    {id: 36, list_id: 3, word: 'Popeye'},
    {id: 37, list_id: 3, word: 'The Grinch'},
    {id: 38, list_id: 3, word: 'Elmo'},
    {id: 39, list_id: 3, word: 'Donald Duck'},
    {id: 40, list_id: 3, word: 'Tom & Jerry'},
    {id: 41, list_id: 3, word: 'Pinnocchio'},
    {id: 42, list_id: 3, word: 'Tarzan'},
    {id: 43, list_id: 3, word: 'Clifford the Big Red Dog'},
    {id: 44, list_id: 3, word: 'Nemo'},
    {id: 45, list_id: 3, word: 'Tigger'}
  ];
}

function makePicturadesFixtures() {
  const testUsers = makeUsersArray();
  const testLists = makeListsArray();
  const testWords = makeWordsArray();
  return { testUsers, testLists, testWords };
}

function makeMaliciousLists() {
  
  const maliciousLists = [
    {
      id: 1,
      title: 'Naughty naughty very naughty <script>alert("xss");</script>',
      game_type: 'Charades',
      creator_id: 1,
      creator_name: 'Daniel Renfro'
    },
    {
      id: 2,
      title: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
      game_type: 'Charades',
      creator_id: 1,
      creator_name: 'Daniel Renfro'
    }
  ];

  const expectedLists = [
    {
      id: 1,
      title: 'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
      game_type: 'Charades',
      creator_id: 1,
      creator_name: 'Daniel Renfro'
    },
    {
      id: 2,
      title: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
      game_type: 'Charades',
      creator_id: 1,
      creator_name: 'Daniel Renfro'
    }
  ];
  
  return { 
    maliciousLists,
    expectedLists
  };
}

function makeMaliciousWords() {
  const maliciousWords = [
    {id: 1, list_id: 1, word: 'Naughty naughty very naughty <script>alert("xss");</script>'},
    {id: 2, list_id: 1, word: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`},
  ];

  const expectedWords = [
    {id: 1, list_id: 1, word: 'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;'},
    {id: 2, list_id: 1, word: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`},
  ];

  return {
    maliciousWords,
    expectedWords
  };
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      picturades_words,
      picturades_lists,
      picturades_users
      RESTART IDENTITY CASCADE`
  );
}

function seedUsers(db, users) {
  return db
    .insert(users)
    .into('picturades_users');
}

function seedLists(db, lists) {
  return db
    .insert(lists)
    .into('picturades_lists');
}

function seedTables(db, users, lists, words) {
  return seedUsers(db, users)
    .then(() => {
      return db
        .insert(lists)
        .into('picturades_lists');
    })
    .then(() => {
      return db
        .insert(words)
        .into('picturades_words');
    });
}


module.exports = {
  makeUsersArray,
  makeListsArray,
  makeWordsArray,
  makePicturadesFixtures,
  cleanTables,
  seedTables,
  seedUsers,
  makeMaliciousLists,
  seedLists,
  makeMaliciousWords
};