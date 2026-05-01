const express=require('express');
const router=express.Router();
router.get('/',(req,res)=> res.json({mesaj:'GET tickets'}));
router.post('/',(req,res)=> res.json({mesaj:'POST tickets'}));
module.exports=router;