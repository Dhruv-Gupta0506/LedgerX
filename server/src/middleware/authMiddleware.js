const jwt=require('jsonwebtoken');
const User=require('../models/Users');
const authMiddleware=async (req,res,next)=>{
    const token=req.cookies.token;
    if(!token){
        return res.status(401).json({message:'Access denied. please login first'});
    }
    try{
        const verified=jwt.verify(token,process.env.JWT_SECRET);
        req.user=await User.findById(verified.id).select('-password');
        next();
    }catch(err){
        res.status(401).json({message:'invalid token'});
    }
};

module.exports=authMiddleware;