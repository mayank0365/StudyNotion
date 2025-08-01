const User=require("../models/User");
const OTP=require("../models/OTP");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken")

require("dotenv").config();
const otpGenerator=require("otp-generator");
const Profile=require("../models/Profile");
const mailSender=require("../utils/mailSender");

const { passwordUpdated }=require("../mail/templates/passwordUpdate");
const emailHtml=require("../mail/templates/emailVerificationTemplate");



//sendOTP
exports.sendOTP =async (req,res)=>{
try{
        //fetch email from request ki body

    const {email}=req.body;

    //check is user already exists
    console.log("Email received",email);

    const checkUserPresent=await User.findOne({email});

    console.log("user found?",checkUserPresent);

    //if user already exitst then return a response


    if(checkUserPresent){
        return res.status(401).json({
            success:false,
            message:`User already registered`,
        });
    }

    //generate otp

    var otp=otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
    });
    console.log("OTP generated",otp);

    //check unique otp or not
    let result=await OTP.findOne({otp: otp});

    while(result){
        otp=otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
    });

    result=await OTP.findOne({otp: otp});
    }
    
    const otpPayload={email,otp};

    //create an entry for otp

    const otpBody=await OTP.create(otpPayload);
    console.log("saved otp:",otpBody);

//send verification mail 
       try{
       const emailTemplate=emailHtml(otp);
        await mailSender(email,"verification email from StudyNotion",emailTemplate);
        console.log("verification email sent successfully");
    }
    catch(error){
        console.error("error sending email:",error);
    }

    //return response successful
    res.status(200).json({
        success:true,
        message:'OTP sent Successfully',
        otp,
    })


 


}
catch(error){
    console.log(error);
    return res.status(500).json({
        success:false,
        message:error.message,
    })

}
};



//sign up

exports.signUp=async(req,res)=>{


  try{
      //data fetch from req body


    const {
        firstName,lastName,email,password,confirmPassword,accountType,contactNumber,otp
    } =req.body;
    //validate krlo

    if(!firstName || !lastName || !email || !password || !confirmPassword ||  !otp){
        return res.status(403).json({
            success:false,
            message:"All fields are required",
        })
    }


    //2 password match krlo

    if(password!=confirmPassword){
        return res.status(400).json({
            success:false,
            message:'Password and confirmPassword value does not match, please try again',
        })
    }
    //check user exist or not

    const existingUser=await User.findOne({email});

    if(existingUser){
        return res.status(400).json({
            success:false,
            message:'User is already registered',
        })
    }


    //find most recent otp stored for the user

    const recentOtp=await OTP.find({email}).sort({createdAt:-1}).limit(1);
    

    console.log(recentOtp);
    //validate otp

    if(recentOtp.length == 0){
        //otp not found
        return res.status(400).json({
            success:false,
            message:'OTP not found',
        })
    }
    else if(otp != recentOtp[0].otp){
        //invalid otp
        return res.status(400).json({
            success:false,
            message:"invalid otp",

        })
    }

    //hash password

    const hashedPassword=await bcrypt.hash(password,10);

    //create entry in db

    const profileDetaills = await Profile.create({
        gender:null,
        dateOfBirth:null,
        about:null,
        contactNumber:null,
    });

    const user=await User.create({
        firstName,
        lastName,
        email,
        contactNumber,
        password:hashedPassword,
        accountType,
        additionalDetails:profileDetaills._id,
        image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    })

    //return res
    return res.status(200).json({
        success:true,
        message:'User is registered Successfully',
        user,
    });
    

  }
    
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User cannot be registered, Please try again",
        })

    }
}

//login

exports.login=async(req,res)=>{
    try{

        //data fetch\
        const{email,password}=req.body;

        //validation data
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:'All fields are required,please try again',
            })
        }
        //user check exist or not
        const user=await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered, please signup first",
            })
        }
        //generate JWT,after password matchin

        if(await bcrypt.compare(password,user.password)){

            const payload ={
                email:user.email,
                id:user.id,
                accountType:user.accountType,
            }
            const token=jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h",
            });
            user.token=token;
            user.password=undefined;


               //create cookie and send response

               const options={
                expires: new Date(Date.now() +3*24*60*60*1000),
                httpOnly:true,

               }
               res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:'Logged in Successfully',
               })
        }

        else{
            return res.status(401).json({
                success:false,
                message:'Password is incorrect',
            });
        }
    }
    catch(error){
         console.log(error);
         res.status(500).json({
            success:false,
            message:'Login failure please try again',
         });
    }
}

//changePassword

exports.changePassword=async(req,res)=>{
    try{
        //fetch data for body

        const userDetails=await User.findById(req.user.id);
        //get old passwird,newPassword,confirmPassword

        const {oldPassword, newPassword, confirmPassword}=req.body;

        //validate old password

        const isPasswordMatch=await bcrypt.compare(
            oldPassword,
            userDetails.password
        );

        if(!isPasswordMatch){
            //if old does not match return a 401 unauthorized error

            return res.status(401).json({
                success:false,
                message:"the password is incorrect"
            });
        }

        //matchc new password and confirm new password 
        if(newPassword!=confirmPassword){
            return res.status(400).json({
                success:false,
                message:"The password and confirm passsword does not match ",

            });
        }



        //upadate pwd in db

        const encryptedPassword=await bcrypt.hash(newPassword,10);
        const updatedUserDetails=await User.findByIdAndUpdate(
            req.user.id,
            {password:encryptedPassword},
            {new:true}
        );


        //send mail->password updated
        //send notification mail
        try{
            const emailResponse=await mailSender(
                updatedUserDetails.email,
                passwordUpdated(
                    updatedUserDetails.email,
                    `password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
                )
            );

            console.log("email sent successfully:", emailResponse.response);
        }
        catch(error){
            console.error("error occured",error);
            return res.status(500).json({
                success:false,
                message:"error occured while sending email",
                error:error.message,
            });
        }
        //return response
         return res.status(200).json({
            success:true,
            message:"password updated successfully"
         });

    }
    catch(error){
         console.error("error occured while udating password",error);
         return res.status(500).json({
            success:false,
            message:"error occured while updating password",
            error:error.message,
         });
    }
};

