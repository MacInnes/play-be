const express = require('express');
const router  = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

// router.get(endpoint, callback) goes here

router.get('/:id', function(request, response){
  database('songs').where({ id: request.params.id })
  .then((songs) => {
    response.status(200).json(songs);
  })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

module.exports = router;
