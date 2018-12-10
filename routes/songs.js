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

router.post('/', async function(request, response){
  if (request.body.title && request.body.artist && request.body.genre && request.body.rating){
    var songObject = {
      title: request.body.title,
      artist: request.body.artist,
      genre: request.body.genre,
      rating: request.body.rating
    };
    var inserted = await Song.insertSong(songObject);
    response.status(201).json(inserted[0]);
  } else {
    response.status(400).json({message: 'Invalid song data, song was not inserted.'});
  }
})

router.put('/:id', async function(request, response){
  if (request.body.title && request.body.artist && request.body.genre && request.body.rating){
    var songData = {
      id: request.params.id,
      title: request.body.title,
      artist: request.body.artist,
      genre: request.body.genre,
      rating: request.body.rating
    };
    var updated = await Song.updateSong(songData);
    response.status(200).json(updated);
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
