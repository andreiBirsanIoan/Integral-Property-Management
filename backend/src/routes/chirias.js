const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const verifyRole = require('../middleware/verifyRole');
const { getChiriasi,addChirias,updateChirias,deleteChirias } = require('../controllers/chiriasiController');

router.get('/', auth, getChiriasi);
router.post('/', auth,verifyRole('admin'), addChirias);
router.put('/:id',auth,verifyRole('admin'),updateChirias);
router.delete('/:id',auth,verifyRole('admin'),deleteChirias);
module.exports = router;