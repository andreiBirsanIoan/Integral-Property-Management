const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const verifyRole = require('../middleware/verifyRole');
const { getApartamente, addApartamente, updateApartamente, deleteApartamente } = require('../controllers/apartamenteController');

router.get('/', auth, getApartamente);
router.post('/', auth, verifyRole('admin'), addApartamente);
router.put('/:id', auth, verifyRole('admin'), updateApartamente);
router.delete('/:id', auth, verifyRole('admin'), deleteApartamente);

module.exports = router;