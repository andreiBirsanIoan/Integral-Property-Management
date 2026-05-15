const express=require('express');
const router=express.Router();
const auth=require('../middleware/auth');
const {getTickets}=require('../controllers/ticketsController');
router.get('/',auth,getTickets);
module.exports=router;