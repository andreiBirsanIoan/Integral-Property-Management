module.exports=(...roles)=>(req,res,next)=>{
    if(!roles.includes(req.user.rol)){
        return res.status(403).json({error:'Acces interzis: rol insuficient.'});
}
next();
};