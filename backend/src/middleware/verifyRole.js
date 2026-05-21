module.exports=(...roles)=>(req,res,next)=>{
    if(!roles.includes(req.user.rol)){
        return res.status(403).json({eroare:'Acces interzis: rol insuficient.'});
}
next();
};