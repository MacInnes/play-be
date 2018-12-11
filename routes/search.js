const express = require('express');
const router  = express.Router();
const request = require('request');
const Song = require('../models/song.js')

router.post('/', async function(req, res){

  var artist = req.body.artist;

  var songRequest = new Promise((resolve, reject) => {
    var options = {
      url: `http://api.musixmatch.com/ws/1.1/track.search?q_artist=${artist}&apikey=bf8a4b36f09e4df30ca2146f0821b791&page_size=100&s_track_rating=desc`,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    request(options, function(err, res, body){
      var jsonData = JSON.parse(body);
      var songData = jsonData.message.body.track_list;
      resolve(songData);
    });
  })

  var songs = await songRequest;

  // songs[0].track.track_id

  var formatted = songs.map(function(song){
    var title = song.track.track_name;
    var artist = song.track.artist_name;
    if (song.track.primary_genres.music_genre_list[0]){
      var genre = song.track.primary_genres.music_genre_list[0].music_genre.music_genre_name;
    } else {
      var genre = "";
    }
    var rating = song.track.track_rating;
    return new Song(title, artist, genre, rating);
  })

  if (formatted.length){
    res.status(200).json(formatted);
  } else {
    res.status(404).json({message: "No songs found by this artist"});
  }

});

module.exports = router;
