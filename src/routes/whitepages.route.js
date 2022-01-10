const express = require('express');
const { suggestLocations, searchNumbers } = require('../controllers/whitepages.controller');

const router = express.Router();

router.get('/location/:location', suggestLocations);
router.get('/numbers/s/:search/:location/:sublocation?', searchNumbers);

module.exports = router;
