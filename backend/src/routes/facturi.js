const express=require('express');
const router=express.Router();
router.get('/',(req,res)=> res.json({mesaj:'GET facturi'}));
router.post('/',(req,res)=> res.json({mesaj:'POST facturi'}));
module.exports=router;