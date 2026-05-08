const express=require('express');
const router=express.Router();
router.get('/',(req,res)=> res.json({mesaj:'GET auth'}));
router.post('/',(req,res)=> res.json({mesaj:'POST auth'}));
module.exports=router;