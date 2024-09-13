const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req,res,next)=>{
    try{
       const token = req.body.token;
       if(!token){
        return res.status(401).json({
            success:false,
            message:"Token Missing"
        });
       }
        try{
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        console.log(decode);
        req.user = decode;
       } catch(error){
        return res.status(401).json({
            success:false,
            message:'token is invalid'
        });
       }
       next();
    }
    catch(error){
        return res.status(401).json({
            success:true,
            message:'Something went wrong,while verifying the token'
        })
    }
}