const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const supertest = require('supertest');
const { expect } = require('chai');

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

    it(`responds with 200, the list and location for new list`, function() {
      const newList = {
        id: 1,
        creator_id: 1,
        creator_name: 'Daniel Renfro',
        title: 'New List',
        game_type: 'Pictionary'
      };

      return supertest(app)
        .post('/api/lists')
        .send(newList)
        .expect(201)
        .expect(res => {
          expect(res.body.id).to.eql(newList.id);
          expect(res.body.creator_id).to.eql(newList.creator_id);
          expect(res.body.creator_name).to.eql(newList.creator_name);
          expect(res.body.title).to.eql(newList.title);
          expect(res.body.game_type).to.eql(newList.game_type);
          expect(res.headers.location).to.eql(`/api/lists/${newList.id}`);
        })
        .then(res =>
          db
            .from('picturades_lists')
            .select('*')
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row.id).to.eql(newList.id);
              expect(row.creator_id).to.eql(newList.creator_id);
              expect(row.creator_name).to.eql(newList.creator_name);
              expect(row.title).to.eql(newList.title);
              expect(row.game_type).to.eql(newList.game_type);
            })
        );
    });

    it(`responds with 400 and 'creator_id' must be a valid user`, () => {
      const newListWithInvalidCreatorId = {
        id: 1,
        creator_id: 123456,
        creator_name: 'Invalid User',
        title: 'New List',
        game_type: 'Pictionary'
      };

      return supertest(app)
        .post('/api/lists')
        .send(newListWithInvalidCreatorId)
        .expect(400, { error: `'creator_id' must be a real user` });
    });

    it(`responds with 400 and 'creator_name' must match full_name of 'creator_id'`, () => {
      const newListWithInvalidCreatorName = {
        id: 1,
        creator_id: 1,
        creator_name: 'Wrong Name',
        title: 'New List',
        game_type: 'Pictionary'
      };

      return supertest(app)
        .post('/api/lists')
        .send(newListWithInvalidCreatorName)
        .expect(400, { error: `'creator_name' must match full_name of 'creator_id' user` });
    });

    it(`responds with 400 and 'Invalid game_type' when game_type doesn't equal 'Charades' or 'Pictionary'`, () => {
      const newListWithInvalidGameType = {
        id: 1,
        creator_id: 1,
        creator_name: 'Daniel Renfro',
        title: 'New List',
        game_type: 'Wrong Type'
      };

      return supertest(app)
        .post('/api/lists')
        .send(newListWithInvalidGameType)
        .expect(400, { error: `'game_type' must either be 'Pictionary' or 'Charades'` });
    });

    it(`responds with 200 and serialized item when xss attack`, () => {
      const { maliciousLists, expectedLists } = helpers.makeMaliciousLists();
      const maliciousNewList = maliciousLists[0];
      const expectedNewList = expectedLists[0];

      return supertest(app)
        .post('/api/lists')
        .send(maliciousNewList)
        .expect(201, expectedNewList);
    });

    describe('required fields are missing in POST request', () => {

      const requiredFields = ['creator_id', 'creator_name', 'title', 'game_type'];
  
      requiredFields.forEach(field => {
        const newListBody = {
          id: 1,
          creator_id: 2,
          creator_name: 'Daniel Renfro',
          title: 'New List',
          game_type: 'Pictionary'
        };
  
        it(`responds with 400 and 'Missing '${field} in request body'`, () => {
          delete newListBody[field];
          
          return supertest(app)
            .post('/api/lists')
            .send(newListBody)
            .expect(400, { error: `Missing '${field}' in request body` });
        });
      });
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

  describe('PATCH /api/lists/:list_id', () => {
    context('Given the database has lists in it', () => {
      beforeEach('send tables', () => helpers.seedTables(db, testUsers, testLists, testWords));

      it(`responds with 204 when update successful`, () => {
        const listId = 1;
        const updatedList = {
          title: 'Updated Title',
          game_type: 'Pictionary'
        };
        const expectedList = {
          ...testLists[listId - 1],
          ...updatedList
        };

        return supertest(app)
          .patch(`/api/lists/${listId}`)
          .send(updatedList)
          .expect(204)
          .then(() => {
            return supertest(app)
              .get(`/api/lists/${listId}`)
              .expect(expectedList);
          });
      });

      it(`responds 400 when no required field is present`, () => {
        const listId = 1;

        return supertest(app)
          .patch(`/api/lists/${listId}`)
          .send({ irrelevantField: 'foo' })
          .expect(400, { error: `Request body must contain either 'title' or 'game_type'` });
      });

      it(`responds with 204 when updating only a subset of fields`, () => {
        const listId = 1;
        const updatedList = {
          title: 'Updated Title'
        };
        const expectedList = {
          ...testLists[listId - 1],
          ...updatedList
        };

        return supertest(app)
          .patch(`/api/lists/${listId}`)
          .send({
            ...updatedList,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
          .then(() => {
            return supertest(app)
              .get(`/api/lists/${listId}`)
              .expect(expectedList);
          });
      });

    });
    
    context('Given the database is empty', () => {
      it(`responds with 404 when list isn't found`, () => {
        const listId = 1;
        const updatedList = {
          title: 'Updated Title',
          game_type: 'Pictionary'
        };

        return supertest(app)
          .patch(`/api/lists/${listId}`)
          .send(updatedList)
          .expect(404, { error: `List doesn't exist` });
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