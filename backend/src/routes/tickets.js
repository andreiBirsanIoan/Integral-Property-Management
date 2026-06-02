const express=require('express');
const router=express.Router();
const auth=require('../middleware/auth');
const {getTickets,putTickets}=require('../controllers/ticketsController');
router.get('/',auth,getTickets);
router.put('/:id',auth,putTickets);
module.exports=router;