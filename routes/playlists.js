const express = require('express');
const router  = express.Router();
const Playlist = require('../models/playlist.js');

// router.get(endpoint, callback) goes here

router.get('/', async function(req, res){
  var playlists = await Playlist.all();
  res.status(200).json(playlists);
})

router.get('/:id', async function(req, res){
  var playlistResponse = await Playlist.findById(req.params.id);
  res.status(200).json(playlistResponse);
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

router.put('/:id', async function(req, res){
  var playlistResponse = await Playlist.updateName(req.params.id, req.body.name);
  res.status(200).json(playlistResponse);
})

router.delete('/:playlistId/songs/:songId', async function(req, res){
  var playlistResponse = await Playlist.deleteSong(req.params.playlistId, req.params.songId);
  res.status(202).json(playlistResponse);
})

router.delete('/:id', async function(req, res){
  var playlistResponse = await Playlist.deletePlaylist(req.params.id);
  res.status(202).json(playlistResponse);
})

module.exports = router;
