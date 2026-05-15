const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getChiriasi,addChirias } = require('../controllers/chiriasiController');

router.get('/', auth, getChiriasi);
router.post('/', auth,addChirias);
module.exports = router;