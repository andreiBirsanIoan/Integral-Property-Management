const express=require('express');
const router=express.Router();
router.get('/',(req,res)=> res.json({mesaj:'GET auth'}));///get cere date de la server
router.post('/',(req,res)=> res.json({mesaj:'POST auth'}));//post trimite date catre server
                                                          //La login de exemplu trimiţi email şi parolă, serverul verifică şi îţi returnează un token.
module.exports=router;