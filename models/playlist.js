const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const Song = require('./song.js');

class Playlist {

  constructor(name){
    this.name = name;
  }

  static all(){
    return database('playlists')
      .join('playlists_songs', {'playlists.id': 'playlists_songs.playlist_id'})
      .join('songs', {'playlists_songs.song_id': 'songs.id'})
      .then(playlists => console.log("ALL: ", playlists))
  }

  static findById(id){
    return database('playlists')
      .where('playlists.id', id)
      .join('playlists_songs', {'playlists.id': 'playlists_songs.playlist_id'})
      .join('songs', {'playlists_songs.song_id': 'songs.id'})
      .then(songs => format(songs));
    function format(songs){
      var playlist = {
        id: songs[0].id,
        playlist_name: songs[0].name,
        songs: songs.map(function(song){
          return new Song(song.title, song.artist, song.genre, song.rating);
        })
      }
      return playlist;
    }
  }

}

module.exports = Playlist;
