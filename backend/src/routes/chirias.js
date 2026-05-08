const express=require('express');
const router=express.Router();
router.get('/',(req,res)=> res.json({mesaj:'GET chirias'}));
router.post('/',(req,res)=> res.json({mesaj:'POST chirias'}));
module.exports=router;