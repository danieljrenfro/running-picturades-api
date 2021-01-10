const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');

const WordsService = require('../src/words/words-service');
const { expect } = require('chai');

describe('Words Endpoints', function() {
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

  describe('PATCH /api/words/:word_id', () => {
    context('Given the database has words', () => {
      beforeEach('seed tables', () => helpers.seedTables(db, testUsers, testLists, testWords));

      it('responds with 204 and updates word', () => {
        const wordId = 1;
        const updatedWord = {
          word: 'Updated Word'
        };
        const expectedWord = {
          ...testWords[wordId - 1],
          ...updatedWord
        };

        return supertest(app)
          .patch(`/api/words/${wordId}`)
          .send(updatedWord)
          .expect(204)
          .then(res => {
            return supertest(app)
              .get(`/api/words/${wordId}`)
              .expect(expectedWord);
          });
      });

      it(`responds with 400 and required field error`, () => {
        const wordId = 1;
        
        return supertest(app)
          .patch(`/api/words/${wordId}`)
          .send({ irrelevantField: 'foo' })
          .expect(400, { error: `Request body must contain 'word' field` });
      });

      it(`responds with 204 when only updating a sub-set of fields`, () => {
        const wordId = 1;
        const updatedWord = {
          word: 'Updated Word'
        };
        const expectedWord = {
          ...testWords[wordId - 1],
          ...updatedWord          
        };

        return supertest(app)
          .patch(`/api/words/${wordId}`)
          .send({
            ...updatedWord,
            fieldToIgnore: 'foo'
          })
          .expect(204)
          .then(res => {
            return supertest(app)
              .get(`/api/words/${wordId}`)
              .expect(expectedWord);
          });
      });
    });

    context('Given the database is empty', () => {
      it(`responds with 404 and 'Word doesn't exist'`, () => {
        const wordId = 1;
        const updatedWord = {
          word: 'Updated Word'
        };

        return supertest(app)
          .patch(`/api/words/${wordId}`)
          .send(updatedWord)
          .expect(404, { error: `Word doesn't exist` });
      });
    });
  });

  describe('POST /api/words', () => {
    beforeEach('seed lists', () => helpers.seedTables(db, testUsers, testLists));

    it(`responds with 201, array of words and location for words`, () => {
      const newWords = { words: testWords.slice(0, 14)};
      const listId = 1;

      return supertest(app)
        .post(`/api/words`)
        .send(newWords)
        .expect(201)
        .then(res => {
          expect(res.body).to.eql(newWords.words);
          expect(res.headers.location).to.eql(`/api/lists/${listId}/words`);
        })
        .then(res => {
          return supertest(app)
            .get(`/api/lists/${listId}/words`)
            .expect(newWords.words);
        });
    });

    describe('required fields are missing in POST request', () => {
      
      const requiredFields = ['word', 'list_id'];

      requiredFields.forEach(field => {
        const newWords = { words: helpers.makeWordsArray().slice(0, 14)};

        newWords.words.forEach(word => delete word[field]);
        
        it(`responds with 400 if '${field}' is missing from a word`, () => {
          return supertest(app)
            .post(`/api/words`)
            .send(newWords)
            .expect(400, { error: `Missing '${field}' in request body` });
        });
      });
      
    });

    context('Given xss attack', () => {
      
      it('removes xss attack from newWords', () => {
        const { maliciousWords, expectedWords } = helpers.makeMaliciousWords();
  
        return supertest(app)
          .post(`/api/words`)
          .send({ words: maliciousWords})
          .expect(201, expectedWords);
      });
    });
  });
});