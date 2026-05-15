const express=require('express');
const router=express.Router();
const auth=require('../middleware/auth');
const {getFacturi}=require('../controllers/facturiController');
router.get('/',auth,getFacturi);
module.exports=router;