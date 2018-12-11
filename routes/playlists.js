const express = require('express');
const router  = express.Router();
const Playlist = require('../models/playlist.js');

// router.get(endpoint, callback) goes here

router.get('/', async function(req, res){
  var playlists = await Playlist.all();
  res.status(200).json(playlists);
})

router.get('/:id/songs', async function(req, res){
  var playlist = await Playlist.findById(req.params.id);
  res.status(200).json(playlist);
})

router.post('/', async function(req, res){
  var name = req.body.name;
  var dbResponse = await Playlist.insert(name);
  res.status(201).json(dbResponse);
})

router.post('/:playlistId/songs/:songId', async function(req, res){
  var playlistResponse = await Playlist.insertSong(req.params.playlistId, req.params.songId);
  res.status(201).json(playlistResponse);
})

module.exports = router;
