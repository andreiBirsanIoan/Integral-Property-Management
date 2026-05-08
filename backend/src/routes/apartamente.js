const express=require('express');
const router=express.Router();
router.get('/',(req,res)=> res.json({mesaj:'GET apartamente'}));
router.post('/',(req,res)=> res.json({mesaj:'POST apartamente'}));
module.exports=router;