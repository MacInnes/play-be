const express = require('express');
const router  = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
// router.get(endpoint, callback) goes here


//
// router.get('/', function(req, res){
//   database('playlists')
//     .join('playlists_songs', {'playlists.id': 'playlists_songs.playlist_id'})
//     .join('songs', {'songs.id': 'playlists_songs.song_id'})
//     .then((playlists) => {
//       res.status(200).json(playlists);
//     })
//     .catch((error) => {
//       res.status(500).json({ error });
//     });
// })

router.get('/:id/songs', function(req, res){
  database('playlists')
  .join('playlists_songs', {'playlists.id': 'playlists_songs.playlist_id'})
  .join('songs', {'songs.id': 'playlists_songs.song_id'})
  .where({'playlists_songs.playlist_id': req.params.id}).select()
  .then(playlist => {
    if (playlist.length) {
      var songs = []
      console.log(playlist['playlist_id'])
      playlist.forEach(function(song, index) {
        songs.push({
          "id": song["id"],
          "name": song["title"],
          "artist_name": song["artist"],
          "genre": song["genre"],
          "song_rating": song["rating"]
        })
      })

      res.status(200).json({
        "id": playlist[0]["playlist_id"],
        "playlist_name": playlist[0]["name"],
        "songs": songs
      })
    } else {
        res.status(404).json("No playlist found")
    }
  })
  .catch((error) => {
    res.status(500).json({ error });
  });
})

module.exports = router;
