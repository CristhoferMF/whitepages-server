const express = require('express');
const { suggestLocations } = require('../controllers/whitepages.controller');

const router = express.Router();

router.get('/location/:location', suggestLocations);

module.exports = router;
