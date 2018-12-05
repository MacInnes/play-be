const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../app.js');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

// basic example

describe('Client Routes', () => {
  it('can get root', done => {
    chai.request(server)
      .get("/")
      .end((err, response) => {
        response.should.have.status(200);
        done();
      });
  });
});

describe('API Routes', () => {
  // db setup before each test

  before((done) => {
    database.migrate.latest()
      .then( () => done() )
      .catch(error => {
        throw error;
      });
  });

  beforeEach((done) => {
    database.seed.run()
      .then( () => done() )
      .catch(error => {
        throw error;
      })
  });

  it('responds to /api/v1/songs', done => {
    chai.request(server)
      .get('/api/v1/songs')
      .end((err, response) => {
        response.should.have.status(200);
        response.body.message.should.equal("Endpoint connected");
        done();
      });
  });

});
