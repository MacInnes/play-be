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
        response.body.length.should.equal(2);
        done();
      });
  });

  it('responds to /api/v1/songs/:id', done => {
    database('songs').select('*').then(data => resolve(data))
    function resolve(song){
      chai.request(server)
      .get(`/api/v1/songs/${song[0].id}`)
      .end((error, response) => {
        response.should.have.status(200);
        response.body.length.should.equal(1);
        response.body[0].title.should.equal(song[0].title)
        response.body[0].artist.should.equal(song[0].artist)
        done();
      })
    }
  })

  it('responds to /api/v1/playlists', done => {
    chai.request(server)
      .get('/api/v1/playlists')
      .end((error, response) => {
        response.should.have.status(200);
        response.body.length.should.equal(2);
        response.body[0].name.should.equal("Lasagna for One")
        response.body[1].name.should.equal("Stylez with a z")
        done();
      })
  })

  it('responds to POST /api/v1/songs', done => {
    var song = {
      title: 'asdf',
      artist: 'asdfasdf',
      genre: "omg",
      rating: 54
    }

    chai.request(server)
      .post('/api/v1/songs')
      .send({
        'title': song.title,
        'artist': song.artist,
        'genre': song.genre,
        'rating': song.rating
      })
      .end(function(err, res){
        res.should.have.status(201);
        done();
      })
  })

});
