const express=require('express');
const router=express.Router();
const auth=require('../middleware/auth');
const {getApartamente}=require('../controllers/apartamenteController');
router.get('/',auth,getApartamente);
module.exports=router;