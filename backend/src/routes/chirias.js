const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getChiriasi } = require('../controllers/chiriasiController');

router.get('/', auth, getChiriasi);

module.exports = router;