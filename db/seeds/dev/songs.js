exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('playlists_songs').del()
    .then(() => knex('playlists').del())
    .then(() => knex('songs').del())
    .then(() => {
      return Promise.all([
        knex('songs').insert({ title: 'a song', artist: 'asdf', genre: 'rap', rating: 5 }, 'id')
          .then(song1 => {
            return knex('songs').insert({ title: 'Pink', artist: 'Janelle Monae', genre: 'R&B', rating: 80 }, 'id')
            .then(song2 => {
              return knex('playlists').insert({name: 'Lasagna for One'}, 'id')
              .then(playlist1 => {
                return knex('playlists').insert({name: 'Stylez with a z'}, 'id')
                .then(playlist2 => {
                  return knex('playlists_songs').insert({ playlist_id: playlist1[0], song_id: song1[0] })
                  .then(() => {
                    return knex('playlists_songs').insert({ playlist_id: playlist1[0], song_id: song2[0] })
                    .then(() => {
                      return knex('playlists_songs').insert({ playlist_id: playlist2[0], song_id: song1[0] })
                    })
                  })
                })
              })
            })
          })
          .then(() => console.log('Seeding complete!'))
          .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch(error => console.log(`Error seeding data: ${error}`))
};
