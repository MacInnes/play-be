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

  it('responds to /api/v1/favorites', done => {
    chai.request(server)
      .get('/api/v1/favorites')
      .end((err, response) => {
        response.should.have.status(200);
        response.body.length.should.equal(3);
        done();
      });
  });

  it('responds to /api/v1/songs/:id', done => {
    chai.request(server)
      .get('/api/v1/songs/1')
      .end((error, response) => {
        response.should.have.status(200);
        response.body.length.should.equal(1);
        response.body[0].title.should.equal('a song')
        response.body[0].artist.should.equal('asdf')
        done();
      })
  })

});
