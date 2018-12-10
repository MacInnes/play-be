const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

class Song {

  constructor(title, artist, genre, rating){
    this.title = title;
    this.artist = artist;
    this.genre = genre;
    this.rating = rating;
  }

  static findById(id){
    return database('songs')
      .where('id', id)
      .returning('*')
      .then(song => song);
  }

  static insertSong(songObject){
    return database('songs')
      .insert(songObject)
      .returning('*')
      .then(song => song);
  }

  static updateSong(songObject){
    return database('songs')
      .where('id', songObject.id)
      .update(songObject)
      .returning('*')
      .then(song => song[0]);
  }

}

module.exports = Song;
