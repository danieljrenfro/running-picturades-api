const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const supertest = require('supertest');

describe('Lists Endpoints', function() {
  let db; 

  const { 
    testUsers, 
    testLists, 
    testWords 
  } = helpers.makePicturadesFixtures(); 

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    });
    app.set('db', db);
  });

  before('clean tables', () => helpers.cleanTables(db));

  afterEach('clean tables', () => helpers.cleanTables(db));

  after('disconnect from db', () => db.destroy());
  
  describe('GET /api/lists', () => {
    context('Given there are lists in the database', () => {
      beforeEach('seed tables', () =>
        helpers.seedTables(db, testUsers, testLists, testWords)
      );

      it('responds with 200 and an array of lists', () => {
        return supertest(app)
          .get('/api/lists')
          .expect(200, testLists);
      });
    });
    
    context('Given the database is empty', () => {
      it('responds with 200 and an array of lists', () => {
        return supertest(app)
          .get('/api/lists')
          .expect(200, []);
      });
    });

    context('Given xss attach lists', () => {
      const { maliciousLists, expectedLists } = helpers.makeMaliciousLists();

      beforeEach('seed tables', () => {
        return helpers.seedUsers(db, testUsers)
          .then(() => helpers.seedLists(db, maliciousLists));
      });

      it('removes the xss attack from the lists', () => {
        return supertest(app)
          .get('/api/lists')
          .expect(200, expectedLists);
      });
    });
  });

  describe('POST /api/lists', () => {
    beforeEach('seed users', () => helpers.seedUsers(db, testUsers));

    it(`responds with 200, the serialized list and location for new list`, () => {
      const newList = {
        id: 1,
        creator_id: 1,
        creator_name: 'Daniel Renfro',
        title: 'New List',
        game_type:
      }
    });
  });

  describe('GET /api/lists/:list_id', () => {
    context('Given the database has lists', () => {
      beforeEach(() => {
        return helpers.seedTables(db, testUsers, testLists, testWords);
      });

      it('responds with 200 and found list', () => {
        const listId = 3;
        const expectedList = testLists[listId - 1];

        return supertest(app)
          .get(`/api/lists/${listId}`)
          .expect(200, expectedList);
      });

      it(`responds with 404 and 'List doesn't exist'`, () => {
        const listId = 123;

        return supertest(app)
          .get(`/api/lists/${listId}`)
          .expect(404, { error: `List doesn't exist` });
      });
    });

    context('Given the database is empty', () => {
      it(`responds with 404 and 'List doesn't exist'`, () => {
        const listId = 1;

        return supertest(app)
          .get(`/api/lists/${listId}`)
          .expect(404, { error: `List doesn't exist` });
      });
    });

    context('Given an xss attack', () => {
      const {maliciousLists, expectedLists } = helpers.makeMaliciousLists();
      
      beforeEach('insert malicious lists', () => {
        return helpers.seedUsers(db, testUsers)
          .then(() => helpers.seedLists(db, maliciousLists));
      });

      it('responds with 200 and serialized list', () => {
        const listId = 1;
        const expectedList = expectedLists[listId - 1];

        return supertest(app)
          .get(`/api/lists/${listId}`)
          .expect(200, expectedList);
      });
    });
  });

  describe('GET /api/lists/:list_id/words', () => {
    context('Given the database has lists and words', () => {
      beforeEach('seed tables', () => helpers.seedTables(db, testUsers, testLists, testWords));

      it('responds 200 with array words that belong to list', () => {
        const listId = 1;
        const expectedWords = testWords.filter(word => word.list_id === listId);

        return supertest(app)
          .get(`/api/lists/${listId}/words`)
          .expect(200, expectedWords);
      });
    });

    context('Given the database is empty', () => {
      it(`responds with 404 'List doesn't exist'`, () => {
        const listId = 1;

        return supertest(app)
          .get(`/api/lists/${listId}/words`)
          .expect(404, { error: `List doesn't exist` });
      });
    });

    context('Given an xss attack', () => {
      const { maliciousWords, expectedWords } = helpers.makeMaliciousWords();

      beforeEach('seed tables with malicious words', () => helpers.seedTables(db, testUsers, testLists, maliciousWords));

      it('responds with 200 and serialized words', () => {
        const listId = maliciousWords[0].list_id;

        return supertest(app)
          .get(`/api/lists/${listId}/words`)
          .expect(200, expectedWords);
      });
    });
  });
});