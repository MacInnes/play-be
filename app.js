const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);
app.locals.title = 'Play';

require('./models/song.js')
require('./models/playlist.js')

const songs = require('./routes/songs.js')
const playlists = require('./routes/playlists.js')
const favorites = require('./routes/favorites.js')

app.use('/api/v1/songs', songs);
app.use('/api/v1/playlists', playlists);
app.use('/api/v1/favorites', favorites);

app.get('/', (request, response) => {
  response.send('Is it working?');
});

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
