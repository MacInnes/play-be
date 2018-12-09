const express = require('express');
const router  = express.Router();
const Song = require('../models/song.js')

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

// router.get(endpoint, callback) goes here

router.get('/:id', async function(request, response){
  song = await Song.findById(request.params.id)
  if (song.length){
    response.status(200).json(song);
  } else {
    response.status(404).json('');
  }

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

router.put('/:id', function(request, response){
  if (request.body.title && request.body.artist && request.body.genre && request.body.rating){
    database('songs')
      .where('id', request.params.id)
      .returning(['title', 'artist', 'genre', 'rating'])
      .update({
        title: request.body.title,
        artist: request.body.artist,
        genre: request.body.genre,
        rating: request.body.rating
      }).then(data => {
        response.status(200).json(data[0]);
      }).catch( error => {
        response.status(400).json({ error });
      })
  } else {
    response.status(400).json('')
  }
})

router.delete('/:id', function(request, response){
  database('songs')
    .where('id', request.params.id)
    .del()
    .then(data => {
      if (data != 0){
        response.status(204).json('');
      } else {
        response.status(400).json('');
      }
    });
})

module.exports = router;
