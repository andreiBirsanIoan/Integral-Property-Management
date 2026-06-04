const express=require('express');
const router=express.Router();
const auth=require('../middleware/auth');
const {getFacturi,putFacturi,addFacturi}=require('../controllers/facturiController');
const verifyRole = require('../middleware/verifyRole');
router.get('/',auth,getFacturi);
router.post('/',auth,verifyRole('admin'),addFacturi);
router.put('/:id',auth,putFacturi);
module.exports=router;