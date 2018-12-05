const express = require('express');
const router  = express.Router();

// router.get(endpoint, callback) goes here

router.get('/', function(req, res, err){
  res.status(200).json({message: "Endpoint connected"})
})

module.exports = router;
