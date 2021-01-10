const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe.only('Words Endpoints', function() {
  let db;

  const {
    testUsers,
    testLists,
    testWords
  } = helpers.makePicturadesFixtures();

  before('make knex instance', () => {
    db = knex({
      'client': 'pg',
      'connection': process.env.TEST_DATABASE_URL
    });
    app.set('db', db);
  });

  before('clean tables', () => helpers.cleanTables(db));

  afterEach('clean tables', () => helpers.cleanTables(db));

  after('disconnect from db', () => db.destroy());

  describe('GET /api/words/:word_id', () => {
    context('Given there are words in the database', () => {
      beforeEach('seed tables', () => helpers.seedTables(db, testUsers, testLists, testWords));

      it('responds with 200 and the word requested by id', () => {
        const wordId = 1;
        const expectedWord = testWords[wordId - 1];

        return supertest(app)
          .get(`/api/words/${wordId}`)
          .expect(200, expectedWord);
      });
    });

    context('Given the database is empty', () => {
      it(`responds with 404 and 'Word doesn't exist' when invalid word id`, () => {
        const wordId = 123456;
        
        return supertest(app)
          .get(`/api/words/${wordId}`)
          .expect(404, { error: `Word doesn't exist` });
      });
    });
  
    context('Given xss attack in word', () => {
      const { maliciousWords, expectedWords } = helpers.makeMaliciousWords();
      
      beforeEach('seed malicious words', () => helpers.seedTables(db, testUsers, testLists, maliciousWords));

      it(`responds with 200 and serialized word`, () => {
        const wordId = 1;
        const expectedWord = expectedWords[wordId - 1];

        return supertest(app)
          .get(`/api/words/${wordId}`)
          .expect(200, expectedWord);
      });
    });
  });
});