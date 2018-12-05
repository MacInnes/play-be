
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('songs', function(table) {
      table.increments('id').primary();
      table.string('title');
      table.string('artist');
      table.string('genre');
      table.integer('rating');

      table.timestamps(true, true);
    }),

    knex.schema.createTable('playlists_songs', function(table){
      table.increments('id').primary();
      table.integer('playlist_id').unsigned();
      table.foreign('playlist_id').references('playlists.id');
      table.integer('song_id').unsigned();
      table.foreign('song_id').references('songs.id');

      table.timestamps(true, true);
    }),

    knex.schema.createTable('playlists', function(table){
      table.increments('id').primary();
      table.string('name');

      table.timestamps(true, true)
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('playlists'),
    knex.schema.dropTable('songs'),
    knex.schema.dropTable('playlists_songs'),
  ]);
};
