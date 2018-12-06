const express = require('express');
const router  = express.Router();
const request = require('request');

router.post('/', async function(req, res){
  var artist = req.body.artist;
  var promise = new Promise((resolve, reject) => {
    var options = {
      url: `http://api.musixmatch.com/ws/1.1/track.search?q_artist=${artist}&apikey=bf8a4b36f09e4df30ca2146f0821b791`,
      headers: {
        'Content-Type': 'application/json'
      }
    }

    return request(options, function(err, res, body){
      var jsonData = JSON.parse(body);
      var songData = jsonData.message.body.track_list;
      console.log(songData);
      resolve(songData);
    });
  })
  var songs = await promise;
  console.log("ROUTE SONGS", songs)
  if (songs){
    res.status(200).json(songs);
  } else {
    res.status(404).json({message: "No songs found by this artist"});
  }
});

module.exports = router;
