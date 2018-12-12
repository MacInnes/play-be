# Play Backend API Documentation

This project provides API endpoints which allows a user to search for songs by Artist.  It consumes the [MusixMatch API](https://developer.musixmatch.com/) and also utilizes a PostgreSQL database for users to store favorite songs and create playlists.

This project was built by [Andrew Mockett](https://github.com/MacInnes) and [Tara Craig](https://github.com/TCraig7) for a [Turing School of Software and Design](https://turing.io/) project in Module 4.  This application was built using Node.js, Express, and PostgreSQL, and deployed to Heroku with the help of CircleCI continuous integration.  Our testing suite uses Mocha, Chai, and Chai-http.  The deployed production URL is https://api-play.herokuapp.com/.  All endpoints respond with JSON, and any POST/PUT requests require a JSON formatted body.

This project was built alongside the [Play-FE](https://github.com/TCraig7/Play-FE) project, which is a separate Frontend application to consume the data from this project.  You can view the live production site [here](https://tcraig7.github.io/Play-FE/).

## Endpoints

All endpoints respond with JSON, and any POST/PUT requests require a JSON formatted body.  The base url for each endpoint is https://api-play.herokuapp.com/.  No API key is required to access these endpoints.

#### POST /api/v1/search
This endpoint uses MusixMatch's API to search for songs by artist, sorted by rating.

Example request body:
```
{
  "artist": "Queen"
}
```
Example response (100 results maximum):
```
[
  {
    "title": "Bohemian Rhapsody",
    "artist": "Queen",
    "genre": "Pop/Rock",
    "rating": 99
  },
  {
    "title": "Bohemian Rhapsody - Remastered 2011",
    "artist": "Queen",
    "genre": "Rock",
    "rating": 97
  },
  ...etc...
]
```

#### POST /api/v1/songs
This endpoint lets you save a song to the database as a "favorite".  All fields are required.

Example request body:
```
{
  "title": "Bohemian Rhapsody",
  "artist": "Queen",
  "genre": "Pop/Rock",
  "rating": 99
}
```
Example response:
```
{
  "id": 9644,
  "title": "Bohemian Rhapsody",
  "artist": "Queen",
  "genre": "Pop/Rock",
  "rating": 99,
  "created_at": "2018-12-12T21:16:16.159Z",
  "updated_at": "2018-12-12T21:16:16.159Z"
}
```

#### GET /api/v1/favorites
This endpoint will return all favorited songs in the database.

Example response:
```
[
  {
    "id": 9644,
    "title": "Bohemian Rhapsody",
    "artist": "Queen",
    "genre": "Pop/Rock",
    "rating": 99,
    "created_at": "2018-12-12T21:16:16.159Z",
    "updated_at": "2018-12-12T21:16:16.159Z"
  },
  ...etc...
]
```

#### PUT /api/v1/songs/:id
This endpoint allows you to update a song stored in the database by ID.  All fields must be specified, even if they aren't being updated.

Example request body (to the id of our previous example song):
```
{
  "title": "Bohemian Rhapsody",
  "artist": "Queen",
  "genre": "Pop/Rock",
  "rating": 100
}
```
Example response:
```
{
  "id": 9644,
  "title": "Bohemian Rhapsody",
  "artist": "Queen",
  "genre": "Pop/Rock",
  "rating": 100,
  "created_at": "2018-12-12T21:16:16.159Z",
  "updated_at": "2018-12-12T21:16:16.159Z"
}
```
Note that this update will only affect songs stored in our database, not the data coming from MusixMatch's API.  If a song is deleted from our database, any updated changes will be lost.

#### DELETE /api/v1/songs/:id
This endpoint will delete a song saved in the database.  No request body is required.  A 202 response will be returned if successful.

Example response:
```
{
  "message": "Song deleted.""
}
```

#### POST /api/v1/playlists
This endpoint will create a new playlist in the database.

Example request body:
```
{
  name: "Queen Playlist"
}
```

Example response:
```
{
  "message": "Successfully created Playlist: Queen Playlist"
}
```

#### PUT /api/v1/playlists/:id
This endpoint lets you update the name of a playlist by ID.

Example request body:
```
{
  name: "The Best Queen Playlist"
}
```

Example response:
```
{
  "playlist": {
    "id": 7285,
    "name": "The Best Queen Playlist",
    "created_at": "2018-12-12T21:43:41.154Z",
    "updated_at": "2018-12-12T21:43:41.154Z"
  }
}
```

#### POST /api/v1/playlists/:playlist_id/songs/:song_id
This endpoint will add a song to a playlist.  Both the song and playlist must exist in the the database.  No body is needed for the request.

Example response:
```
{
  "message": "Successfully added song (id: 9763) to playlist (id: 7268)"
}
```

#### DELETE /api/v1/playlists/:playlist_id/songs/:song_id
This endpoint deletes a song from a playlist.  The song will remain in the database, but will no longer be associated with this playlist.

Example response:
```
{
  "message": "Successfully deleted song (id: 9763) to playlist (id: 7268)"
}
```

#### DELETE /api/v1/playlists/:id
This endpoint deletes a playlist entirely.  All songs will remain in the database, but will no longer be associated with this playlist.

Example response:
```
{
  "message": "Playlist The Best Queen Playlist successfully deleted"
}
```
