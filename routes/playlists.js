const express = require('express');
const router  = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
// router.get(endpoint, callback) goes here

router.get('/', function(req, res){
  database('playlists').select()
    .then((playlists) => {
      res.status(200).json(playlists);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
})

module.exports = router;
