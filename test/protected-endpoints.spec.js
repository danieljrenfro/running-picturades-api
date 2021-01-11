const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Protected Endpoints', function() {
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

  const protectedEndpoints = [
    {
      name: 'POST /api/lists',
      path: '/api/lists',
      method: supertest(app).post
    },
    {
      name: 'POST /api/words',
      path: '/api/words',
      method: supertest(app).post
    },
    {
      name: `GET /api/users`,
      path: '/api/users',
      method: supertest(app).get
    }
  ];

  protectedEndpoints.forEach(ep => {

    describe(ep.name, () => {
      beforeEach('seed tables', () => helpers.seedTables(db, testUsers, testLists, testWords)); 
  
      it(`responds with 401 'Missing bearer token' when no bearer token`, () => {
        
        return ep.method(ep.path)
          .expect(401, { error: `Missing bearer token` });
      });
    
      it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
        const validUser = testUsers[0];
        const invalidSecret = 'bad-secret';
        
        return ep.method(ep.path)
          .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
          .expect(401, { error: `Unauthorized request` });
      });
  
      it(`responds 401 'Unauthorized request' when sub in payload`, () => {
        const invalidUser = { user_name: 'user-not-existy', id: 1 };
        
        return ep.method(ep.path)
          .set('Authorization', helpers.makeAuthHeader(invalidUser))
          .expect(401, { error: 'Unauthorized request' });
      });
    });
  });
  
});