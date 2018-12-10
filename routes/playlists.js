const express = require('express');
const router  = express.Router();
const Playlist = require('../models/playlist.js');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
// router.get(endpoint, callback) goes here

router.get('/', async function(req, res){
  var playlists = await Playlist.all();
  // database('playlists')
  //   .join('playlists_songs', {'playlists.id': 'playlists_songs.playlist_id'})
  //   .join('songs', {'songs.id': 'playlists_songs.song_id'})
  //   .then((playlists) => {
  //     console.log(playlists);
  //     res.status(200).json(playlists);
  //   })
  //   .catch((error) => {
  //     res.status(500).json({ error });
  //   });
  res.status(200).json(playlists);
})

router.get('/:id/songs', async function(req, res){
  var playlist = await Playlist.findById(req.params.id);
  res.status(200).json(playlist);
})

module.exports = router;
