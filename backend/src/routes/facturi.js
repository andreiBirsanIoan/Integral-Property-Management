const express=require('express');
const router=express.Router();
const auth=require('../middleware/auth');
const {getFacturi,putFacturi}=require('../controllers/facturiController');
router.get('/',auth,getFacturi);
router.put('/:id',auth,putFacturi);
module.exports=router;