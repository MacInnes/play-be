const express = require('express');
const router  = express.Router();
const Song = require('../models/song.js')

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

// router.get(endpoint, callback) goes here

router.get('/:id', function(request, response){
  database('songs').where({ id: request.params.id })
  .then((songs) => {
    response.status(200).json(songs);
  })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

router.post('/', function(request, response){
  var song = new Song(request.body.title,
                      request.body.artist,
                      request.body.genre,
                      request.body.rating);
  database('songs')
    .insert({
      title: song.title,
      artist: song.artist,
      genre: song.genre,
      rating: song.rating
    }).then(data => {
      response.status(201).json(song);
    }).catch(error => {
      response.status(400).json({ error });
    })
})

module.exports = router;
