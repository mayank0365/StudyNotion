const jwt=require("jsonwebtoken");
require("dotenv").config();
const User=require("../models/User");

//auth

exports.auth=async(req,res,next)=>{
   // console.log("auth middleware hit")
    try{
        //extract token
        // const authHeader=req.header("Authorization");
        // const token=req.cookies.token
        //               || req.body.token
        //               || (authHeader && authHeader.replace("Bearer ",""));
        const authHeader = req.headers.authorization;

    // Check if header exists and starts with "Bearer"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Authorization header missing or invalid" });
    }

    // Extract the token from "Bearer <token>"
    const token = authHeader.split(" ")[1];

        console.log("extracted token:", token)

        //if token is missing,then return response
         if(!token) {
            return res.status(401).json({
                success:false,
                message:'Token is Missing',
            });
        }

        //verify the token
        try{
            const decode= jwt.verify(token,process.env.JWT_SECRET);
            console.log("decode",decode);
            req.user=decode;
            console.log("req.user object:",req.user);
        }
        catch(err){

            //verification -issue
            console.log("JWT verify error:",err);
            return res.status(401).json({
                success:false,
                message:'token is invalid',
            });

        }
        next();

    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:'Something went wrong while validating the token',
        })

    }
}

//isStudent

exports.isStudent=async(req,res,next)=>{
    try{
          if(req.user.accountType !=="Student"){
            return res.status(401).json({
                success:false,
                message:'this is a protected route for students only',
            });
          }
          next();

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified please try again',
        });
    }
}

//isInstructor

exports.isInstructor=async(req,res,next)=>{
   // console.log("isinstructoe middleware hit ")
    try{
          if(req.user.accountType !=="Instructor"){
            return res.status(401).json({
                success:false,
                message:'this is a protected route for Instructor only',
            });
          }
          next();

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified please try again',
        });
    }
}

//isAdmin

exports.isAdmin=async(req,res,next)=>{
    try{
          if(req.user.accountType !=="Admin"){
            return res.status(401).json({
                success:false,
                message:'this is a protected route for Admin only',
            });
          }
          next();

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified please try again',
        });
    }
}
