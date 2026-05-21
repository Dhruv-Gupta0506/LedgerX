const User=require('../models/Users');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');

const register=async(req,res)=>{
    try{
        const {name,email,password}=req.body;
        const userExists=await User.findOne({email:email});
        if(userExists){
            return res.status(400).json({message: 'this email is already registered.'});
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const user=new User({
            name,
            email,
            password:hashedPassword
        });
        await user.save();
        res.status(201).json({message:'user registered successfully'});
    }
    catch(err){
        res.status(400).json({error:err.message});
    }
};

const login=async(req,res)=>{
    try{
        const{email,password}=req.body;
        const user=await User.findOne({email:email});
        if(!user){
            return res.status(400).json({message:'invalid credentials'});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:'invalid password'});
        }
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1h'});
        res.cookie('token',token,{httpOnly:true,secure:false,maxAge:3600000});
        res.json({message:'login successful'});
    }
    catch(err){
        res.status(400).json({message:err.message});
    }
};

const logout=async(req,res)=>{
    res.clearCookie('token',{httpOnly:true,secure:false,maxAge:0});
    res.json({message:'logout successful'});
};

module.exports={
    register,
    login,
    logout
};

