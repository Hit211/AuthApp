const bcrypt = require("bcrypt");
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const { options } = require("../routes/user");
require("dotenv").config();

exports.signup = async(req,res)=>{
    try{
       const {name,email,password,role} = req.body;
       const existing = await User.findOne({email});
       if(existing){
        return res.status(400).json({
            success:false,
            message:"User already Exists"
        })
       } 

       let hashedPassword;
       try{
        hashedPassword = await bcrypt.hash(password,10);
       }

       catch(err){
        return res.status(500).json({
            status:false,
            message:"Error"
        })
       }

       const user = await User.create({
        name,email,password:hashedPassword,role
       })

       return res.status(200).json({
        success:true,
        message:"mission successful"
       })
    }
    catch(err){
       console.error(err);
       return res.status(500).json({
        success:false,
        message:"User Cannot be registered"
       })
    }
}

exports.login = async(req,res)=>{
    try{
        const {email,password} = req.body;

        if(!email||!password){
            return res.status(400).json({
                success:true,
                message:"Please Fill all blanks"
            });
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered"
            });
        }

        const payload = {  
            email:user.email,
            id:user._id,
            role:user.role
        }

        if(await bcrypt.compare(password,user.password)){
            let token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"2h"});
            const userRes = user.toObject();
            userRes.token = token;
            delete userRes.password;
            const options = {
                expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly:true,
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user:userRes,message:"User Logged in"
            })

        }else{
            return res.status(403).json({
                success:false,
                message:"Password Incorrect"
            })
        }
    }
    catch(err){
        console.error(err);
        return res.status(500).json({
         success:false,
         message:"User Cannot be Loggedin"
        })
     }
}