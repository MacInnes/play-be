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
    database('songs').first('*').then(data => resolve(data))
    function resolve(song){
      chai.request(server)
      .get(`/api/v1/songs/${song.id}`)
      .end((error, response) => {
        response.should.have.status(200);
        response.body.length.should.equal(1);
        response.body[0].title.should.equal(song.title)
        response.body[0].artist.should.equal(song.artist)
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
        response.body[0].playlist_name.should.equal("Lasagna for One")
        response.body[1].playlist_name.should.equal("Stylez with a z")
        response.body[0].songs[0].title.should.equal("a song")
        done();
      })
  })

  it("responds properly to GET /api/v1/songs/:id with invalid id", done => {
    database('songs').first('*').then(data => resolve(data))
    function resolve(song){
      chai.request(server)
      .get(`/api/v1/songs/${song.id - 5}`)
      .end((error, response) => {
        response.should.have.status(404);
        done();
      })
    }
  })

  it('responds to GET /api/v1/playlists/:id/songs', done => {
    database('playlists').first('*').then(data => resolve(data))
    function resolve(playlist){
      chai.request(server)
      .get(`/api/v1/playlists/${playlist.id}/songs`)
      .end((error, response) => {
        response.should.have.status(200);
        response.body.playlist_name.should.equal(playlist.name);
        response.body.songs.length.should.equal(3);
        done();
      })
    }
  })
  // add test for invalid ID!!!

  it('posts a playlist to /api/v1/playlists', done => {
    let name = "Funk"
    chai.request(server)
      .post('/api/v1/playlists')
      .send({
        'name': name
      })
      .end(function(err, res){
        res.should.have.status(201);
        res.body.message.should.equal(`Successfully created Playlist: ${name}`)
        done();
      })
  })

  it('posts an existing song to an existing playlist POST /api/v1/playlists/:id/songs/:id', done => {
    database('playlists').first('*').then(playlist => {
      database('songs').first('*').then(song => {
        chai.request(server)
          .post(`/api/v1/playlists/${playlist.id + 1}/songs/${song.id + 1}`)
          .end(function(err, res){
            res.should.have.status(201);
            res.body.message.should.equal(`Successfully added song (id: ${song.id + 1}) to playlist (id: ${playlist.id + 1})`)
            done();
          })
      })
    })
  })

  it('can delete a song DELETE /api/v1/playlists/:id/songs/:id', done => {
    database('playlists').first('*').then(playlist => {
      database('songs').first('*').then(song => {
        chai.request(server)
          .delete(`/api/v1/playlists/${playlist.id}/songs/${song.id}`)
          .end(function(req, res){
            res.should.have.status(202)
            res.body.message.should.equal(`Successfully deleted song (id: ${song.id}) from playlist (id: ${playlist.id})`)
            done();
          })
      })
    })
  })

  it('can update the name of a playlist', done => {
    newName = "Workout mix"
    database('playlists').first('*').then(playlist => {
      chai.request(server)
        .put(`/api/v1/playlists/${playlist.id}`)
        .send({ name: newName })
        .end(function(req, res){
          res.should.have.status(200);
          res.body.playlist.name.should.equal(newName);
          done();
        })
    })
  })

  it('can delete a playlist', done => {
    database('playlists').first('*').then(playlist => {
      chai.request(server)
        .delete(`/api/v1/playlists/${playlist.id}`)
        .end(function(req, res){
          res.should.have.status(202);
          res.body.message.should.equal(`Playlist ${playlist.name} successfully deleted`)
          done();
        })
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
        res.body.title.should.equal(song.title);
        res.body.artist.should.equal(song.artist);
        done();
      })
  })

  it('fails POST /api/v1/songs with insufficient data', done => {
    var song = {
      title: 'asdf'
    }

    chai.request(server)
      .post('/api/v1/songs')
      .send({
        'title': song.title,
      })
      .end(function(err, res){
        res.should.have.status(400);
        done();
      })
  })

  it('responds to PATCH /api/v1/songs/:id', done => {
    var newTitle = 'omg a new title';
    database('songs').first('*').then(data => resolve(data))
    function resolve(song){
      chai.request(server)
      .put(`/api/v1/songs/${song.id}`)
      .send({
        'title': newTitle,
        'artist': song.artist,
        'genre': song.genre,
        'rating': song.rating
      })
      .end((error, response) => {
        response.should.have.status(200);
        response.body.title.should.equal(newTitle);
        response.body.artist.should.equal(song.artist)
        done();
      })
    }
  })

  it('fails PATCH /api/v1/songs/:id if not all fields are present', done => {
    var newTitle = 'omg a new title';
    database('songs').first('*').then(data => resolve(data))
    function resolve(song){
      chai.request(server)
      .put(`/api/v1/songs/${song.id}`)
      .send({
        'title': newTitle,
        'artist': song.artist,
        'genre': song.genre
      })
      .end((error, response) => {
        response.should.have.status(400);
        done();
      })
    }
  })

  it('deletes a song with DELETE /api/v1/songs/:id', done => {
    database('songs').first('*')
      .then(song => {
        chai.request(server)
          .delete(`/api/v1/songs/${song.id}`)
          .end((error, response) => {
            response.should.have.status(202)
            response.body.message.should.equal("Song deleted.")
            database('songs').select('*')
              .then(songs => {
                songs.length.should.equal(2);
                done();
              })
          })
      })
  })
  it("sends an error when it couldn't find the song", done => {
    database('songs').first('*')
      .then(song => {
        chai.request(server)
          .delete(`/api/v1/songs/${song.id - 5}`)
          .end((error, response) => {
            response.should.have.status(400)
            database('songs').select('*')
              .then(songs => {
                songs.length.should.equal(3);
                done();
              })
          })
      })
  })

});
