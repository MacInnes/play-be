
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('songs').del()
    .then(function () {
      // Inserts seed entries
      return knex('songs').insert([
        {id: 1, title: 'a song', artist: "asdf", genre: "rap", rating: 5},
        {id: 2, title: 'another song', artist: "an artist", genre: "country", rating: 8},
        {id: 3, title: 'wow more songs', artist: "Bob Ross", genre: "Heavy Metal", rating: 30}
      ])
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
    });
};
