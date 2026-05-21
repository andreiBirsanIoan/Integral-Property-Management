const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const verifyRole = require('../middleware/verifyRole');
const { getChiriasi,addChirias } = require('../controllers/chiriasiController');

router.get('/', auth, getChiriasi);
router.post('/', auth,verifyRole('admin'), addChirias);
module.exports = router;