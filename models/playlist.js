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
      .select('playlists.id', 'playlists.name', 'playlists_songs.song_id', 'songs.title', 'songs.artist', 'songs.genre', 'songs.rating')
      .then(playlists => formatPlaylists(playlists))

    function formatPlaylists(playlists_songs){
      var playlist_ids = [];
      playlists_songs.forEach(function(each){
        if(!playlist_ids.includes(each.id)){
          playlist_ids.push(each.id)
        }
      })
      var playlists = [];
      playlist_ids.forEach(function(each){
        var playlist = {
          id: each
        };
        var filteredSongs = playlists_songs.filter(function(song){
          return song.id == each;
        })
        playlist.name = filteredSongs[0].name;
        playlist.songs = filteredSongs.map(function(song){
          return {
            id: song.song_id,
            title: song.title,
            artist: song.artist,
            genre: song.genre,
            rating: song.rating
          }
        })
        playlists.push(playlist);
      })
      return playlists;
    }
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
          return {
            id: song.id,
            title: song.title,
            artist: song.artist,
            genre: song.genre,
            rating: song.rating
          }
        })
      }
      return playlist;
    }
  }

}

module.exports = Playlist;
